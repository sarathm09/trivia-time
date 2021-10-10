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
        supabase.auth.onAuthStateChange((event, session) => {
            handleAuthChange(event, session)
            if (event === 'SIGNED_IN') {
                setAuthenticatedState('authenticated')
                router.push('/')
            }
            if (event === 'SIGNED_OUT') {
                setAuthenticatedState('not-authenticated')
            }
        })
        checkUser()
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
                <div style={leftButtons}>
                    <Link href="/" >
                        <a style={homeLink}>Trivia Time</a>
                    </Link>
                    {authenticatedState === 'not-authenticated' && (
                        <Link href="/sign-in">
                            <a style={linkStyle}>Sign In</a>
                        </Link>
                    )}
                    {/* {authenticatedState === 'authenticated' && (
                        <Link href="/play/trivia">
                            <a style={linkStyle}>Continue previous game</a>
                        </Link>
                    )} */}
                    <Link href="/help" >
                        <a style={homeLink}>Help</a>
                    </Link>
                </div>
                <div style={rightButtons}>
                    {authenticatedState === 'authenticated' && (
                        <a style={linkStyle} onClick={async () => {
                            await supabase.auth.signOut()
                            router.push('/sign-in')
                        }}>Sign Out</a>
                    )}
                </div>
            </nav>
            <Component {...pageProps} />
        </div>
    )
}

const navStyle = {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    padding: '0 1.2rem',
    boxShadow: 'rgba(0, 0, 0, 0.56) 0px 10px 36px 0px, rgba(0, 0, 0, 0.56) 0px 0px 0px 1px'
}

const homeLink = {
    marginRight: '2rem',
    cursor: 'pointer'
}

const linkStyle = {
    marginRight: 10,
    cursor: 'pointer'
}
const rightButtons = {
    flexGrow: 1,
    justifyContent: 'flex-end',
    display: 'flex'
}

const leftButtons = {
    flexGrow: 5,
    display: 'flex',
    gap: '1rem'
}


export default MyApp