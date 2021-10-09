import supabase from '../utils/supabase'
import { useEffect, useState } from 'react'
import styles from '../styles/QuestionScreen.module.css'

const QuestionWrapper = ({ question, sessionId, setQuestionIndex, router, setConfettiEnabled }) => {
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
    const [disableClick, setDisableClick] = useState(false)

    function nextQuestion() {
        setTimeout(() => {
            setConfettiEnabled(false)
            setQuestionIndex(idx => idx + 1)
            setSelectedAnswers([])
            setIsAnswerCorrect(false)
            setDisableClick(false)
        }, 3000)
    }

    useEffect(() => {
        if (!question) router.push('/profile')
    }, [])

    useEffect(() => {
        if (!!selectedAnswers && selectedAnswers.length > 2) {
            setSelectedAnswer(question.options.filter(op => !selectedAnswers.includes(op.value))[0].value)
            setIsAnswerCorrect(true)
            nextQuestion()
        } else if (!isAnswerCorrect) {
            setDisableClick(false)
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
                    setConfettiEnabled(true)
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
    }

    function getScoreForQuestion(baseScore) {
        if (selectedAnswers.length === 0) {
            return baseScore
        } if (selectedAnswers.length === 1) {
            return baseScore / 2
        } if (selectedAnswers.length === 2) {
            return baseScore / 5
        }
        return 0
    }

    return question ? (
        <div className={styles.questionWrapper}>
            <div className={styles.detailsBox}>
                <div className={styles.detailItem}>
                    Category: {question.category.split(':').slice(-1)[0].trim()}
                </div>
                <div className={styles.detailItem}>
                    Difficulty: {question.difficulty.toUpperCase()}
                </div>
                <div className={styles.detailItem}>
                    Score: {getScoreForQuestion(question.baseScore)}
                </div>
            </div>
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

            {/* <div className={styles.helpBox}>
                <div className={styles.helpItem}>
                    <button className={styles.button}>
                        Skip this question
                    </button>
                </div>
                <div className={styles.helpItem}>
                    <button className={styles.button}>
                        Remove one option
                    </button>
                </div>
            </div> */}
        </div>
    ) : <></>
}

export default QuestionWrapper
