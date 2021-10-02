import styles from '../styles/QuestionScreen.module.css'



const detailTitles = {
    QUESTION: 'Question',
    SCORE: 'Score',
    TIME: 'Time'
}

const detailIcons = {
    QUESTION: 'Question',
    SCORE: 'Score',
    TIME: 'Time'
}

const QuestionDetailCard = ({ type }) => {

    const detailsToShow = {
        QUESTION: [{
            key: 'Level',
            value: '2'
        }, {
            key: 'Number',
            value: 10
        }, {
            key: 'Category',
            value: 'Geography'
        }],
        SCORE: [{
            key: 'Total',
            value: 100
        }, {
            key: 'Rank',
            value: 10
        }, {
            key: 'Level',
            value: 'Gold'
        }],
        TIME: [{
            key: 'Remaining',
            value: '1:20'
        }]
    }

    return (
        <div className={styles.detailCard}>
            <div className={styles.detailIconWrapper}>
                <div className={styles.detailIcon}>

                </div>
            </div>
            <div className={styles.detailText}>
                <h4 className={styles.detailTitle}>{detailTitles[type]}</h4>
                <div className={styles.detailValue}>
                    <div className={styles.detailValueKey}>
                        {detailsToShow[type].map(entry => (
                            <span key={entry.key}>{entry.key}<br /></span>
                        ))}
                    </div>
                    <div className={styles.detailValueValue}>
                        {detailsToShow[type].map(entry => (
                            <span key={entry.key}>: {entry.value}<br /></span>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default QuestionDetailCard
