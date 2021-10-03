import { useState, useEffect } from 'react';
import { supabase } from '#utils/supabase'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'

import styles from '#styles/Profile.module.css'

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [difficulty, setDifficulty] = useState('all')
    const [category, setCategory] = useState('all')
    const [categories, setCategories] = useState([])
    const [difficulties, setDifficulties] = useState(['easy', 'medium', 'hard'])

    const router = useRouter()

    useEffect(() => {
        fetchProfile()
        getCategories()
    }, [])

    async function fetchProfile() {
        const profileData = await supabase.auth.user()
        if (!profileData) {
            router.push('/sign-in')
        } else {
            setProfile(profileData)
        }
    }

    async function getCategories() {
        const { data, error } = await supabase
            .from('question')
            .select('category')
        setCategories([...new Set(data.map(d => d.category))])
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
                categories: category === 'all' ? categories : [category],
                difficulties: difficulty === 'all' ? difficulties : [difficulty]
            })

        router.push('/play/trivia')
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerBox}>
                <h1>Trivia Time</h1>
            </div>
            <div className={styles.newSessionBox}>
                <h3 className={styles.subTitle}>New Game</h3>
                <div className={styles.newSessionDetails}>
                    <div className={styles.category}>
                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">All</option>
                            {categories.map(category => <option value={category} key={category}>{category}</option>)}
                        </select>
                    </div>
                    <div className={styles.difficulty}>
                        <label htmlFor="difficulty">Difficulty</label>
                        <select
                            name="difficulty"
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value.toLowerCase())}>
                            <option value="all">All</option>
                            {difficulties.map(difficulty => <option value={difficulty} key={difficulty}>{difficulty.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <button className={styles.start} onClick={() => handleNewGameBtnClick()}>
                        Start
                    </button>
                </div>
            </div>
            <div className={styles.scoreBox}>

            </div>
        </div>
    )
}