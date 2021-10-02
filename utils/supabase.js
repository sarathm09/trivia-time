import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database 
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function signin(provider) {
    const { user, session, error } = await supabase.auth.signIn({ provider })
    console.log(user, session, error)
    return { user, session, error }
}

export async function signout() {
    const { error } = await supabase.auth.signOut();
}

export default supabase