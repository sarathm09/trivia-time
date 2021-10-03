import { useEffect, useState } from 'react'
import supabase from '../utils/supabase'
import { shuffleValues } from '../utils/commons'
import styles from '../styles/QuestionScreen.module.css'

const QuestionWrapper = ({ question, sessionId, setQuestionIndex, router }) => {
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
    const [disableClick, setDisableClick] = useState(false)

    function nextQuestion() {
        setTimeout(() => {
            setQuestionIndex(idx => idx + 1)
            setSelectedAnswers([])
            setIsAnswerCorrect(false)
        }, 3000)
    }

    useEffect(() => {
        if (!question) router.push('/profile')
    }, [])

    useEffect(() => {
        if (!!selectedAnswers && selectedAnswers.length > 2) {
            nextQuestion()
        }
    }, [selectedAnswers, setQuestionIndex])

    useEffect(() => {
        if (!!selectedAnswer && selectedAnswers.length < 3) {
            checkAnswer()
        }
    }, [selectedAnswer])

    const checkAnswer = async () => {
        setDisableClick(true)
        const submitAnswerUrl = `${window.location.protocol}//${window.location.host}/api/sessions/${sessionId}/questions/${question.id}/submit`
        try {
            const submissionResponse = await fetch(submitAnswerUrl, {
                method: 'post',
                body: JSON.stringify({ selectedAnswer }),
                headers: {
                    'content-type': 'application/json'
                }
            })

            if (submissionResponse.status === 200) {
                const data = await submissionResponse.json()
                setIsAnswerCorrect(data.status)
                if (data.status) {
                    nextQuestion()
                } else {
                    setSelectedAnswers([...selectedAnswers, selectedAnswer])
                }
            } else {
                setSelectedAnswers([...selectedAnswers, selectedAnswer])
            }
        } catch (error) {
            //TODO show error
            console.log(error)
        }
        setDisableClick(false)
    }

    return question ? (
        <div className={styles.questionWrapper}>
            <div className={styles.questionBox}>
                <div className={styles.questionText}>
                    {question.question}
                </div>
            </div>
            <div className={styles.answersBox}>
                {question.options.map(answer => (
                    <div
                        className={`${styles.answerOption} ${selectedAnswer === answer.value ? styles.selected : ''} ${selectedAnswers.includes(answer.value) ? styles.errorBlink : ''} ${isAnswerCorrect && selectedAnswer === answer.value ? styles.successBlink : ''}`}
                        key={answer.value}
                        onClick={() => (disableClick) ? false : setSelectedAnswer(answer.value)}>
                        {answer.value}
                    </div>
                ))}

            </div>

            {/* <div className={styles.buttonContainer}>
                <button className={styles.button} disabled={!selectedAnswer} onClick={() => setSelectedAnswer('')}>
                    Clear
                </button>
                <button className={styles.button} disabled={!selectedAnswer} onClick={() => onClickSubmit()}>
                    SUBMIT
                </button>
            </div> */}

            <div className={styles.helpBox}>
                <div className={styles.helpItem}>

                </div>
                <div className={styles.helpItem}>

                </div>
                <div className={styles.helpItem}>

                </div>
            </div>
        </div>
    ) : <></>
}

export default QuestionWrapper
