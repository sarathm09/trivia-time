import { useState } from 'react'
import { useRouter } from 'next/router'
import { shuffleValues } from '../utils/commons'
import styles from '../styles/QuestionScreen.module.css'
import supabase from '../utils/supabase'

const QuestionWrapper = ({ question, sessionId }) => {
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const router = useRouter()

    if (!question) return <></>

    const onClickSubmit = async () => {
        const submitAnswerUrl = `${window.location.protocol}//${window.location.host}/api/sessions/${sessionId}/questions/${question.id}/submit`
        try {
            const submissionResponse = await fetch(submitAnswerUrl, {
                method: 'post',
                body: JSON.stringify({ selectedAnswer }),
                headers: {
                    'Authorization': `Bearer ${supabase.auth.session().access_token}`,
                    'content-type': 'application/json'
                }
            })

            if (submissionResponse.status === 200) {
                const response = await submissionResponse.json()
                console.log(response)
                router.push(`/sessions/${sessionId}/questions/${response.question}`)
            }
        } catch (error) {
            //TODO show error
        }


    }

    return (
        <div className={styles.questionWrapper}>

            <div className={styles.questionBox}>
                <div className={styles.questionText}>
                    {question.question}
                </div>
            </div>
            <div className={styles.answersBox}>
                {shuffleValues(question.options).map(answer => (
                    <div className={`${styles.answerOption} ${selectedAnswer === answer ? styles.selected : ''}`} key={answer.value} onClick={() => setSelectedAnswer(answer.value)}>
                        {answer.value}
                    </div>
                ))}

            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.button} disabled={!selectedAnswer} onClick={() => setSelectedAnswer('')}>
                    Clear
                </button>
                <button className={styles.button} disabled={!selectedAnswer} onClick={() => onClickSubmit()}>
                    SUBMIT
                </button>
            </div>

            <div className={styles.helpBox}>
                <div className={styles.helpItem}>

                </div>
                <div className={styles.helpItem}>

                </div>
                <div className={styles.helpItem}>

                </div>
            </div>
        </div>
    )
}

export default QuestionWrapper
