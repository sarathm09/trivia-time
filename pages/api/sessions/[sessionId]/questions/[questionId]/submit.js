import { supabase } from "#utils/supabase"


async function isSessionValid(userId, sessionId, res) {
    const { data: sessions, error } = await supabase
        .from('session')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .eq('session_id', sessionId)

    if (error || sessions.length === 0) {
        res.status(404).json({ message: 'Session not found' })
        return false
    }
    return true
}

async function getQuestion(questionId, res) {
    const { data: questions, error } = await supabase
        .from('question')
        .select('*')
        .eq('id', questionId)

    if (!questions || questions.length === 0) {
        res.status(404).json({ message: 'Question not found' })
    }
    return questions[0]
}


function getScoreForQuestion(baseScore, attempts, isAnswerCorrect) {
    if (isAnswerCorrect) {
        if (attempts === 1) {
            return baseScore
        } if (attempts === 2) {
            return baseScore / 2
        } if (attempts === 3) {
            return baseScore / 5
        }
    } else if (attempts === 3) {
        return -1 * baseScore
    }

    return 0
}

async function addScoreToSession(userId, sessionId, score) {
    const { data, error: _ } = await supabase
        .from('session')
        .select('*')
        .eq('session_id', sessionId)

    await supabase
        .from('session')
        .upsert({
            user_id: userId,
            session_id: sessionId,
            score: data[0].score + score,
            updated_at: new Date().toUTCString()
        })
}

async function logQuestionAttempt(userId, sessionId, question, answer, score = 0, isAnswerCorrect) {
    const { data, error } = await supabase
        .from('session_questions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('question_id', question.id)
        .neq('answer', null)
        .order('attempt', { ascending: false })

    const attempt = (data[0]?.attempt || 0) + 1
    score = getScoreForQuestion(score, (data[0]?.attempt + 1) || 1, isAnswerCorrect)

    await Promise.all([
        supabase
            .from('session_questions')
            .upsert({
                session_id: sessionId,
                question_id: question.id,
                attempt,
                answer,
                score
            }),
        addScoreToSession(userId, sessionId, score)
    ])

    return score
}

export default async function handler(req, res) {
    const { sessionId, questionId } = req.query
    const { user } = await supabase.auth.api.getUserByCookie(req)

    if (await isSessionValid(user.id, sessionId, res)) {
        const question = await getQuestion(questionId, res)

        let score = await logQuestionAttempt(user.id, sessionId, question, req.body.selectedAnswer, question.base_score, req.body.selectedAnswer === question.answer)
        if (question && req.body.selectedAnswer === question.answer) {
            res.status(200).json({
                status: true,
                score
            })
        } else {
            // attempt++
            res.status(200).json({
                status: false,
                score
            })
        }
    }
}