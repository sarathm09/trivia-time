import { useRouter } from 'next/router'
import ProfileCard from './ProfileCard'
import TopScorersCard from './TopScorersCard'
import styles from '#styles/Profile.module.css'
import UserSessionsList from './UserSessionsList'
import React, { useEffect, useState } from 'react'

const UserProfile = ({ profile, lastGameScore, totalScore, highestScore, correctlyAnswered, rank, userSessions, topScorers }) => {
    const router = useRouter()
    const [cardValues, setCardValues] = useState({ lastGameScore, totalScore, highestScore, correctlyAnswered, rank })

    return (
        <>
            <h2 className={styles.subTitle}>{profile?.user_metadata?.full_name || profile?.email || 'Player'}&apos;s Profile</h2>
            <div className={styles.profileCardsBox}>
                <ProfileCard profile={profile} cardValues={cardValues} type="LAST_GAME_SCORE" />
                <ProfileCard profile={profile} cardValues={cardValues} type="HIGHEST_GAME_SCORE" />
                <ProfileCard profile={profile} cardValues={cardValues} type="CORRECTLY_ANSWERED" />
                <ProfileCard profile={profile} cardValues={cardValues} type="TOTAL_SCORE" />
                <ProfileCard profile={profile} cardValues={cardValues} type="RANK" />
            </div>
            <UserSessionsList userSessions={userSessions} />
            <TopScorersCard topScorers={topScorers} />
        </>
    )
}

export default UserProfile
