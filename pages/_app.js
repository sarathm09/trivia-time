import '../styles/globals.css'
import supabase from '../utils/supabase'


function MyApp({ Component, pageProps }) {
  console.log(supabase.auth.session())
  return <Component {...pageProps} />
}

export default MyApp
