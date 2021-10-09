import styles from '#styles/Help.module.css';

const index = () => {
    return (
        <div className={styles.container}>
            <h2>Help</h2>
            <div className={styles.helpBox}>
                <h3>Logging in</h3>
                <p>
                    This game supports multiple sign in methods. They are:
                    <ul>
                        <li>Signing in with magic link (email)</li>
                        <li>Signing in with Google</li>
                        <li>Signing in with Github</li>
                        <li>Signing in with Twitter</li>
                    </ul>

                    In the first approach, you have to enter your email address and we&apos;ll mail you a top secret &quot;magic&quot; link 😉
                    Just click on the link and you&apos;ll be redirected to the app and magically logged in 🙂
                    <br />
                    <br />
                    In the other approaches, just click on the button, it&apos;ll redirect you to the signin page of the provider. Provide the credentials mentioned by the provider and you&apos;ll be able to signin in into this app.
                </p>
            </div>
            <div className={styles.helpBox}>
                <h3>Playing Trivia</h3>
                <p>In order to start a new game, first sign in into the app. Then select the categories from which you want the questions to come from (by default all are selected). After that, select the difficulty level and click on start to start the game</p>
                <p>Once the game starts, it is pretty much straight forward. You have a question and four possible options for every answer. The category, difficulty and the score for each question is mentioned in the same page. The score keeps changing based on the number of attempts.</p>
            </div>
            <div className={styles.helpBox}>
                <h3>Scoring</h3>
                <p>Every question has a base score. Based on the number of attempts for the question, the actual score that you get changes. The lower the number of attempts, the better the score. If you do not answer a question, the same base score is subtracted from your total score</p>
            </div>
            <div className={styles.helpBox}>
                <h3>Tools</h3>
                <p>This app was built using three main tools</p>
                <ul>
                    <li><a href="https://nextjs.org/" target="_blank" rel="noreferrer">Next.js</a></li>
                    <li><a href="https://supabase.io/" target="_blank" rel="noreferrer">Supabase</a></li>
                    <li><a href="https://opentdb.com/" target="_blank" rel="noreferrer">Open Trivia DB</a></li>
                </ul>
                <p>Special thanks to the developers of these tools and to the open source community</p>
            </div>
        </div>
    )
}

export default index
