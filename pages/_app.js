import Link from 'next/link'
import Image from 'next/image'
import '../styles/globals.css'
import { useRouter } from 'next/router'
import { supabase } from '#utils/supabase'
import { useState, useEffect } from 'react'

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

    useEffect(() => {
        if (authenticatedState === 'authenticated' && location.href.includes('sign-in')) {
            router.push('/')
        }
    }, [authenticatedState, router])

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
                        <a style={homeLink}><Image src="/favicon.png" height="20" width="20" alt="logo" />&nbsp;Trivia Time</a>
                    </Link>
                    {/* {authenticatedState === 'authenticated' && (
                        <Link href="/play/trivia">
                            <a style={linkStyle}>Continue previous game</a>
                        </Link>
                    )} */}
                    {authenticatedState === 'authenticated' && (
                        <Link href="/submit">
                            <a style={linkStyle}>Submit a new question</a>
                        </Link>
                    )}
                </div>
                <div style={rightButtons}>
                    <Link href="/help" >
                        <a style={linkStyle}>Help</a>
                    </Link>
                    {authenticatedState === 'not-authenticated' && (
                        <Link href="/sign-in">
                            <a style={linkStyle}>Sign In</a>
                        </Link>
                    )}
                    {authenticatedState === 'authenticated' && (
                        <a style={linkStyle} onClick={async () => {
                            await supabase.auth.signOut()
                            router.push('/sign-in')
                        }}>Sign Out</a>
                    )}
                </div>
            </nav>
            <Component {...pageProps} />
            <div style={emptyDiv} />
            <footer style={footer}>
                Powered by
                <Image
                    src="/supabase-logo-dark.png"
                    alt="Supabase logo"
                    width="100"
                    height="20"
                />
            </footer>
        </div>
    )
}

const navStyle = {
    display: 'flex',
    height: '5rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '0 1.2rem',
    boxShadow: 'rgba(0, 0, 0, 0.56) 0px 10px 36px 0px, rgba(0, 0, 0, 0.56) 0px 0px 0px 1px'
}

const homeLink = {
    marginRight: '0.3rem',
    cursor: 'pointer',
    color: 'aliceblue',
    fontSize: '1.2rem'
}

const linkStyle = {
    marginRight: 3,
    cursor: 'pointer'
}
const rightButtons = {
    flexGrow: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    display: 'flex',
    gap: '0.5rem'
}

const leftButtons = {
    height: '100%',
    alignItems: 'center',
    flexGrow: 4,
    display: 'flex',
    gap: '1rem'
}

const footer = {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: 'var(--bodyColor)',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    gap: '0.5rem',
    boxShadow: 'rgba(0, 0, 0, 0.96) 0px 10px 36px 0px, rgba(0, 0, 0, 0.56) 0px 0px 0px 1px'
}

const emptyDiv = {
    height: '1.5rem'
}

export default MyApp