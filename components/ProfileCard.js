import { useState } from 'react'
import styles from '#styles/Profile.module.css'
import { BsSortNumericUpAlt } from 'react-icons/bs'
import { MdOutlineSportsScore } from 'react-icons/md'
import { GiPodiumWinner, GiRank3, GiCheckMark } from 'react-icons/gi'

const ProfileCard = ({ type, cardValues }) => {
    const { lastGameScore, totalScore, highestScore, correctlyAnswered, rank } = cardValues

    const cardData = {
        LAST_GAME_SCORE: (
            <>
                <div className={styles.profileMiniCardIcon}>
                    <MdOutlineSportsScore className={styles.profileCardIcon} />
                </div>

                <div className={styles.profileMiniCardContent}>
                    <b>{lastGameScore}</b>
                    <i>Last Game Score</i>
                </div>
            </>
        ),
        HIGHEST_GAME_SCORE: (
            <>
                <div className={styles.profileMiniCardIcon}>
                    <BsSortNumericUpAlt className={styles.profileCardIcon} />
                </div>

                <div className={styles.profileMiniCardContent}>
                    <b>{highestScore}</b>
                    <i>Highest Score</i>
                </div>
            </>
        ),
        CORRECTLY_ANSWERED: (
            <>
                <div className={styles.profileMiniCardIcon}>
                    <GiCheckMark className={styles.profileCardIcon} />
                </div>

                <div className={styles.profileMiniCardContent}>
                    <b>{correctlyAnswered}</b>
                    <i>Correctly Answered</i>
                </div>

            </>
        ),
        TOTAL_SCORE: (
            <>
                <div className={styles.profileMiniCardIcon}>
                    <GiPodiumWinner className={styles.profileCardIcon} />
                </div>

                <div className={styles.profileMiniCardContent}>
                    <b>{totalScore}</b>
                    <i>Total Score</i>
                </div>

            </>
        ),
        RANK: (
            <>
                <div className={styles.profileMiniCardIcon}>
                    <GiRank3 className={styles.profileCardIcon} />
                </div>

                <div className={styles.profileMiniCardContent}>
                    <b>{rank}</b>
                    <i>Rank</i>
                </div>

            </>
        )
    }

    return (
        <div className={styles.profileCard}>
            {cardData[type]}
        </div>
    )
}


export default ProfileCard
