import styles from '#styles/Profile.module.css'
import Link from 'next/link'
import { useEffect } from 'react'

const UserSessionsList = ({ userSessions }) => {
    useEffect(() => {
        if (userSessions) {
            userSessions.forEach(session => {
                session.categories = session.categories?.map(c => c.split(':').slice(-1)[0].trim())
            })
        }
    }, [userSessions])

    return (
        <div className={styles.userSessionsList}>
            <h3>Games Played</h3>

            <table className={styles.userSessionsTable}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Categories</th>
                        <th>Difficulty</th>
                        <th>Score</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {userSessions && userSessions.map((session, i) => (
                        <Link href="/play/trivia" key={session.session_id}>
                            <tr key={session.session_id} className={session.active ? styles.activeRow : ''}>
                                <td>{i + 1}</td>
                                <td>{new Date(session.created_at).toLocaleString()}</td>
                                <td>{session.categories.slice(0, 5).join(', ')} {session.categories.length > 5 ? `+${session.categories.length - 5} more` : ''}</td>
                                <td>{session.difficulties.join(', ')}</td>
                                <td>{session.score}</td>
                                <td>{session.active ? 'Ongoing' : 'Completed'}</td>
                            </tr>
                        </Link>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default UserSessionsList
