import Confetti from 'react-confetti'
import { useRouter } from 'next/router'
import { supabase } from '#utils/supabase'
import { useEffect, useState } from 'react'
import { shuffleValues } from '../../utils/commons'
import styles from '#styles/QuestionScreen.module.css'
import QuestionWrapper from '../../components/QuestionWrapper'

export default function Trivia({ user, questions, sessionId }) {
    const [questionIndex, setQuestionIndex] = useState(0)
    const [enableConfetti, setConfettiEnabled] = useState(false)

    const router = useRouter()

    async function logQuestionAttempt(userId, sessionId, question) {
        const { data, error } = await supabase
            .from('session_questions')
            .select('*')
            .eq('session_id', sessionId)
            .eq('question_id', question.id)
            .neq('answer', null)
            .order('attempt', { ascending: false })

        await supabase
            .from('session_questions')
            .upsert({
                session_id: sessionId,
                question_id: question.id,
                attempt: (data[0]?.attempt + 1) || 1
            })
    }

    useEffect(() => {
        if (!!user && !!questions && questions.length > 0 && !!sessionId) {
            // logQuestionAttempt(user.id, sessionId, questions[questionIndex])
        }
        if (questions.length === 0) {
            router.push('/')
        }
    }, [questionIndex, questions, user, sessionId])

    return questions ? (
        <div className={styles.root}>
            <Confetti className={`${styles.confetti} ${!enableConfetti ? styles.disableConfetti : styles.enableConfetti}`} width={'10000'} height={'1000'}>
            </Confetti>
            <div className={styles.container}>
                <div className={styles.detailsBox}>
                    <div className={styles.detailCardSmall}>
                    </div>
                </div>
                <QuestionWrapper
                    question={questions[questionIndex]}
                    sessionId={sessionId}
                    user={user}
                    router={router}
                    setQuestionIndex={setQuestionIndex}
                    setConfettiEnabled={setConfettiEnabled}
                />
            </div>

        </div >
    ) : <></>
}

async function getQuestionAskedInSession(sessionId) {
    const { data: questionsAsked } = await supabase
        .from('session_questions')
        .select('question_id')
        .eq('session_id', sessionId)
        .eq('answer', null)
    return questionsAsked?.map(q => q.question_id) || []
}

async function getNextSetOfQuestions(sessionId, difficulty, categories) {
    const questionsAsked = await getQuestionAskedInSession(sessionId)
    let questions = []

    if (questionsAsked.length) {
        const { data, error } = await supabase
            .from('question')
            .select('*')
            .in('difficulty', difficulty)
            .in('category', categories)
            .not('id', 'in', '(' + questionsAsked.join(',') + ')')
            .limit(1500)
        questions = shuffleValues(data)
        console.log(error)
    } else {
        const { data, error } = await supabase
            .from('question')
            .select('*')
            .in('difficulty', difficulty)
            .in('category', categories)
            .limit(1500)
        questions = shuffleValues(data)
    }
    return questions
}

export async function getServerSideProps({ req }) {
    const { user } = await supabase.auth.api.getUserByCookie(req)

    if (!user) {
        return { props: {}, redirect: { destination: '/sign-in' } }
    }
    const { data: sessions, error } = await supabase
        .from('session')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)

    if (sessions.length === 0) {
        // create a new session
        return { props: {}, redirect: { destination: '/profile' } }
    } else {
        const session = sessions[0]
        let questions = await getNextSetOfQuestions(session.session_id, session.difficulties, session.categories)
        questions = questions
            .sort((a, b) => Math.random() % 2 ? 1 : -1)
            .slice(0, 50)
            .map(q => ({
                id: q.id,
                question: q.question,
                category: q.category,
                difficulty: q.difficulty,
                baseScore: q.base_score,
                options: shuffleValues(q.options.map(option => ({
                    value: option,
                    enabled: true
                })))
            }))

        return {
            props: {
                user,
                sessionId: session.session_id,
                questions
            }
        }
    }
}