import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '#utils/supabase'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
    const router = useRouter()
    const [authenticatedState, setAuthenticatedState] = useState('not-authenticated')

    useEffect(() => {
        /* fires when a user signs in or out */
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            handleAuthChange(event, session)
            if (event === 'SIGNED_IN') {
                setAuthenticatedState('authenticated')
                router.push('/profile')
            }
            if (event === 'SIGNED_OUT') {
                setAuthenticatedState('not-authenticated')
            }
        })
        checkUser()
        return () => {
            authListener.unsubscribe()
        }
    }, [])

    async function checkUser() {
        /* when the component loads, checks user to show or hide Sign In link */
        const user = await supabase.auth.user()
        if (user) {
            setAuthenticatedState('authenticated')
        }
    }

    async function handleAuthChange(event, session) {
        /* sets and removes the Supabase cookie */
        await fetch('/api/auth', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({ event, session }),
        })
    }

    return (
        <div>
            <nav style={navStyle}>
                <Link href="/">
                    <a style={linkStyle}>Home</a>
                </Link>
                {authenticatedState === 'authenticated' && (
                    <Link href="/profile">
                        <a style={linkStyle}>Profile</a>
                    </Link>
                )}
                {authenticatedState === 'not-authenticated' && (
                    <Link href="/sign-in">
                        <a style={linkStyle}>Sign In</a>
                    </Link>
                )}
                {authenticatedState === 'authenticated' && (
                    <Link href="/play/trivia">
                        <a style={linkStyle}>Play</a>
                    </Link>
                )}
            </nav>
            <Component {...pageProps} />
        </div>
    )
}

const navStyle = {
    margin: 20
}
const linkStyle = {
    marginRight: 10
}

export default MyApp