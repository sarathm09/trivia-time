import styles from '#styles/Submit.module.css'
import { useEffect, useState } from 'react'
import { supabase } from '#utils/supabase'
import { useRouter } from 'next/router'
import { GiCheckMark } from 'react-icons/gi'
import { v4 as uuid } from 'uuid'


const SubmitQuestions = ({ categories, difficulties }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState()
    const [selectedCategory, setSelectedCategory] = useState()
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState()

    const [question, setQuestion] = useState()
    const [answerChoices, setAnswerChoices] = useState(new Array(4).fill(''))
    const [errorMessage, setErrorMessage] = useState()
    const [file, setFile] = useState()

    const [profile, setProfile] = useState(null)

    const router = useRouter()

    useEffect(() => {
        fetchProfile()
    }, [])

    async function fetchProfile() {
        const profileData = await supabase.auth.user()
        if (!profileData) {
            router.push('/sign-in')
        } else {
            setProfile(profileData)
        }
    }

    const onSubmitButtonClick = async () => {
        if (!question || !question.trim().length < 5) {
            setErrorMessage('Question cannot be empty')
        } else if (!answerChoices || !answerChoices.some(ch => !ch.trim().length)) {
            setErrorMessage('Answer options cannot be empty')
        } else if (!selectedCategory || !selectedCategory.trim().length) {
            setErrorMessage('Select a category˝')
        } else if (!selectedDifficulty || !selectedDifficulty.trim().length) {
            setErrorMessage('Select some difficulty level')
        } else {
            const questionId = uuid()
            if (file) {
                const { data, error } = await supabase.storage
                    .from('question-images')
                    .upload(`questions/${questionId}.png`, file)
            }

            const { data, error } = await supabase
                .from('question_unverified')
                .insert([
                    {
                        id: questionId,
                        created_at: new Date().toISOString(),
                        category: selectedCategory,
                        difficulty: selectedDifficulty,
                        question,
                        options: answerChoices,
                        answer: answerChoices[correctAnswerIndex],
                        base_score: selectedDifficulty === 'hard' ? 300 : selectedDifficulty === 'medium' ? 200 : 100,
                        user_id: profile.id
                    },
                ])

            if (!error) {
                alert('Question sent for review')
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.submitBox}>
                <h2>Submit new Questions</h2>
                <div className={styles.infoCard}>
                    Please note that the questions you submit will reflect in the app only after the admin reviews and approves it
                </div>

                <div className={styles.category}>
                    <div className={styles.buttonHeader}>
                        <b>Category</b>
                        <button className={styles.button} onClick={() => setSelectedCategory()}>Clear</button>
                    </div>
                    <div className={styles.buttonBox}>
                        {categories && categories.map(category => (
                            <button
                                key={category.key}
                                className={selectedCategory === category.key ? `${styles.button} ${styles.buttonSelected}` : styles.button}
                                onClick={() => setSelectedCategory(category.key)}>
                                {category.value}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.difficulty}>
                    <div className={styles.buttonHeader}>
                        <b>Difficulty</b>
                        <button className={styles.button} onClick={() => setSelectedDifficulty()}>Clear</button>
                    </div>
                    <div className={styles.buttonBox}>
                        {difficulties && difficulties.map(difficulty => (
                            <button
                                key={difficulty.key}
                                className={selectedDifficulty === difficulty.key ? `${styles.button} ${styles.buttonSelected}` : styles.button}
                                onClick={() => setSelectedDifficulty(difficulty.key)}>
                                {difficulty.value}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.questionBox}>
                    <input placeholder="Enter your question here" onChange={(e) => setQuestion(e.target.value)} />
                </div>

                <div className={styles.answerChoices}>
                    {new Array(4).fill('').map((_, i) => i + 1).map(i => (
                        <div className={styles.answerChoice} key={i}>
                            <span>Choice {i}</span>
                            <input type="text" placeholder={`Enter the answer choice ${i}`} onChange={(e) => {
                                answerChoices[i - 1] = e.target.value
                                setAnswerChoices(answerChoices)
                            }} />
                            <button onClick={() => setCorrectAnswerIndex(i)} className={correctAnswerIndex === i ? styles.correctAnswer : ''}><GiCheckMark /></button>
                        </div>
                    ))}
                </div>

                <div className={styles.fileUploadBox}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <div className={styles.submitBtnBox}>
                    {errorMessage && (<p className={styles.errorMessage}>{errorMessage}</p>)}
                    <button type="submit" onClick={() => onSubmitButtonClick()}>Submit</button>
                </div>


            </div>
        </div>
    )
}

export async function getServerSideProps() {
    const { data, error } = await supabase
        .from('question')
        .select('category')

    const categories = [...new Set(data.map(d => d.category))].sort().map(cat => ({
        key: cat,
        value: cat.split(':').slice(-1)[0].trim()
    }))

    return {
        props: {
            categories,
            difficulties: [{
                key: 'easy',
                value: 'Easy'
            }, {
                key: 'medium',
                value: 'Medium'
            }, {
                key: 'hard',
                value: 'Hard'
            }]
        }
    }
}

export default SubmitQuestions
