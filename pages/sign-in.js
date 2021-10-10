import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/SignIn.module.css'
import { supabase } from '#utils/supabase'

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState()
    const [provider, setProvider] = useState('')

    async function signIn(provider = 'email') {
        setProvider(provider)
        if (provider === 'email') {
            const { error, data } = await supabase.auth.signIn({ email })
            setError(error)
        } else {
            const { error, data } = await supabase.auth.signIn({ provider })
            setError(error)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Trivia Time - Sign in</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:title" content="Sign in to Trivia Time" key="title" />
            </Head>
            <div className={styles.signInBox}>
                <h1 className={styles.title}>
                    Sign In
                </h1>
                {(!error && provider === 'email') ? (
                    <div className={styles.infoLabel}>
                        <h4>Please check your email for the magic link</h4>
                    </div>
                ) : (
                    <>
                        <div className={styles.signInWithMagicLink}>
                            <label htmlFor="sign-in-with-email">Sign in with your email</label>
                                <input id="sign-in-with-email" type="email" placeholder="Sign in with email" onChange={e => setEmail(e.target.value)} className={styles.emailBox} />
                            <button onClick={() => signIn()} className={styles.signInButton}>Sign In</button>
                        </div>
                        <div className={styles.signInWithProviders}>

                            <button className={styles.signInProvider} onClick={() => signIn('google')}>
                                <Image className={styles.signInProviderLogo} width="20px" height="20px" src="/google.svg" alt="Google logo" />
                                Login with Google
                            </button>

                            <button className={styles.signInProvider} onClick={() => signIn('github')}>
                                <Image className={styles.signInProviderLogo} width="20px" height="20px" src="/github.svg" alt="Github logo" />
                                Login with Github
                            </button>

                            <button className={styles.signInProvider} onClick={() => signIn('twitter')}>
                                <Image className={styles.signInProviderLogo} width="20px" height="20px" src="/twitter.svg" alt="Twitter logo" />
                                Login with Twitter
                            </button>

                        </div>
                    </>
                )}

            </div>
        </div>
    )
}