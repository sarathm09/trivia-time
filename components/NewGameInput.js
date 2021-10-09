import React, { useEffect, useState } from 'react'
import styles from '#styles/Profile.module.css'
import { supabase } from '#utils/supabase'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'

const NewGameInput = ({ profile }) => {
    const [categories, setCategories] = useState([])
    const [difficulties, setDifficulties] = useState([])
    const [selectedDifficulties, setSelectedDifficulties] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])

    const router = useRouter()

    useEffect(() => {
        setDifficulties([{
            key: 'easy',
            value: 'Easy'
        }, {
            key: 'medium',
            value: 'Medium'
        }, {
            key: 'hard',
            value: 'Hard'
        }])
        setSelectedDifficulties(['easy', 'medium', 'hard'])
        getCategories()
    }, [])

    async function getCategories() {
        const { data, error } = await supabase
            .from('question')
            .select('category')
        const uniqueCategories = [...new Set(data.map(d => d.category))]
        setCategories(uniqueCategories.sort().map(cat => ({
            key: cat,
            value: cat.split(':').slice(-1)[0].trim()
        })))
        setSelectedCategories(uniqueCategories)
    }

    async function handleNewGameBtnClick() {
        await supabase
            .from('session')
            .update({ active: false, updated_at: new Date().toISOString() })
            .match({ user_id: profile.id })

        await supabase
            .from('session')
            .upsert({
                user_id: profile.id,
                session_id: uuid(),
                active: true,
                categories: selectedCategories,
                difficulties: selectedDifficulties
            })

        router.push('/play/trivia')
    }


    return (
        <>
            <h3 className={styles.subTitle}>New Game</h3>
            <div className={styles.newSessionDetails}>
                <div className={styles.category}>
                    <div className={styles.buttonHeader}>
                        <b>Category</b>
                        <button className={styles.button} onClick={() => setSelectedCategories([])}>Clear</button>
                        <button className={styles.button} onClick={() => setSelectedCategories(categories.map(c => c.key))}>Select All</button>
                    </div>
                    <div className={styles.buttonBox}>
                        {categories && categories.map(category => (
                            <button
                                key={category.key}
                                className={selectedCategories.includes(category.key) ? `${styles.button} ${styles.buttonSelected}` : styles.button}
                                onClick={() => setSelectedCategories(c => c.includes(category.key) ? c.filter(_ => _ !== category.key) : [...c, category.key])}>
                                {category.value}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.difficulty}>
                    <div className={styles.buttonHeader}>
                        <b>Difficulty</b>
                        <button className={styles.button} onClick={() => setSelectedDifficulties([])}>Clear</button>
                        <button className={styles.button} onClick={() => setSelectedDifficulties(difficulties.map(d => d.key))}>Select All</button>
                    </div>
                    <div className={styles.buttonBox}>
                        {difficulties && difficulties.map(difficulty => (
                            <button
                                key={difficulty.key}
                                className={selectedDifficulties.includes(difficulty.key) ? `${styles.button} ${styles.buttonSelected}` : styles.button}
                                onClick={() => setSelectedDifficulties(d => d.includes(difficulty.key) ? d.filter(_ => _ !== difficulty.key) : [...d, difficulty.key])}>
                                {difficulty.value}
                            </button>
                        ))}
                    </div>
                </div>
                <button className={styles.start} onClick={() => handleNewGameBtnClick()}>
                    Start
                </button>
            </div>
        </>
    )
}

export default NewGameInput
