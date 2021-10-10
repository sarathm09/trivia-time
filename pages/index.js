import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '#utils/supabase'
import { useState, useEffect } from 'react'
import styles from '#styles/Profile.module.css'
import UserProfile from '../components/UserProfile'
import NewGameInput from '../components/NewGameInput'

export default function Profile({ user, userSessions, lastGameScore, totalScore, highestScore, correctlyAnswered, rank, topScorers }) {
    const [profile, setProfile] = useState(user)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            fetchProfile().then(profile => {
                if (!profile) {
                    setTimeout(() => {
                        router.push('/')
                    }, 1500)
                } else {
                    setProfile(user)
                }
            })
        }
    }, [user, profile, router])

    async function fetchProfile() {
        const profileData = await supabase.auth.user()
        if (!profileData) {
            router.push('/sign-in')
        } else {
            setProfile(profileData)
        }
        return profileData
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Trivia Time</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Trivia Time" key="title" />
            </Head>
            <div className={styles.contentBox}>
                <div className={styles.newSessionBox}>
                    <NewGameInput profile={profile} />
                </div>
                <div className={styles.scoreBox}>
                    <UserProfile
                        profile={profile}
                        lastGameScore={lastGameScore}
                        totalScore={totalScore}
                        highestScore={highestScore}
                        correctlyAnswered={correctlyAnswered}
                        rank={rank}
                        userSessions={userSessions}
                        topScorers={topScorers}
                    />
                </div>
            </div>
        </div>
    )
}


export async function getServerSideProps({ req }) {
    let user

    const { user: u1 } = await supabase.auth.api.getUserByCookie(req) // This is not working!!!
    const { user: u2 } = await supabase.auth.api.getUser(req.cookies['sb:token'])

    if (u1) user = u1
    if (u2) user = u2

    if (!user) {
        return { props: {}, redirect: { destination: '/sign-in' } }
    }

    let totalScore = 0, lastGameScore = 0, highestScore = 0
    const results = await Promise.all([
        supabase
            .from('session')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(500),
        supabase
            .from('session')
            .select('user_id,score,created_at,categories,difficulties')
            .order('score', { ascending: false })
            .limit(10000)
    ])
    const userSessions = results[0].data

    for (let i = 0; i < userSessions.length; i++) {
        const session = userSessions[i]
        highestScore = Math.max(highestScore, session.score)
        totalScore += session.score
    }

    const { data: userQuestions } = await supabase
        .from('session_questions')
        .select('question_id,session_id,score')
        .in('session_id', userSessions.map(s => s.session_id))
        .neq('answer', null)

    const correctlyAnswered = `${userQuestions?.filter(d => d.score).length}/${userQuestions.length}` || ''

    const userScore = {}
    for (let i = 0; i < results[1].data.length; i++) {
        const { user_id, score } = results[1].data[i]
        userScore[user_id] = (userScore[user_id] || 0) + score
    }
    const sortedScores = Object.entries(userScore).sort((a, b) => b[1] - a[1]).slice(0, 20)
    const sortedScoreUsers = sortedScores.map(score => score[0])
    lastGameScore = userSessions[0]?.score || 0

    return {
        props: {
            user,
            lastGameScore,
            totalScore,
            highestScore,
            userSessions,
            correctlyAnswered,
            topScorers: sortedScores,
            rank: sortedScoreUsers.indexOf(user.id) + 1
        }
    }
}
