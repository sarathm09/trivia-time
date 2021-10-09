import { useState, useEffect } from 'react';
import { supabase } from '#utils/supabase'
import { useRouter } from 'next/router'


import styles from '#styles/Profile.module.css'
import NewGameInput from '../components/NewGameInput';

export default function Profile() {
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

    return (
        <div className={styles.container}>
            <div className={styles.headerBox}>
                <h1>Trivia Time</h1>
            </div>
            <div className={styles.contentBox}>
                <div className={styles.newSessionBox}>
                    <NewGameInput profile={profile} />
                </div>
                <div className={styles.scoreBox}>
                </div>
            </div>

        </div>
    )
}