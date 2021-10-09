import styles from '#styles/Profile.module.css'

const TopScorersCard = ({ topScorers }) => {
    return (
        <div className={styles.userSessionsList}>
            <h3>Overall Top Scorers</h3>

            <table className={styles.userSessionsTable}>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User ID</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {topScorers && topScorers.map((session, i) => (
                        <tr key={session[0]}>
                            <td>{i + 1}</td>
                            <td>{session[0]}</td>
                            <td>{session[1]}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default TopScorersCard
