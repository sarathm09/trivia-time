import { useRouter } from "next/router";
import QuestionDetailCard from '../../../../components/QuestionDetailCard'
import QuestionWrapper from '../../../../components/QuestionWrapper'
import styles from '../../../../styles/QuestionScreen.module.css'
import { getQuestionForSession } from '../../../../utils/questions'
import supabase from "../../../../utils/supabase";
import { Auth, Typography, Button } from "@supabase/ui";

const QuestionScreen = ({ question }) => {
    const { query: { sessionId } } = useRouter()
    const { user } = Auth.useUser()
    console.log("234")
    console.log(user)
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.detailsBox}>
                    <QuestionDetailCard type="QUESTION" />
                    <QuestionDetailCard type="SCORE" />
                    <QuestionDetailCard type="TIME" />

                    <div className={styles.detailCardSmall}>
                    </div>
                </div>
                <QuestionWrapper question={question} sessionId={sessionId} user={user} />
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const sessionId = context.params.sessionId
    const question = await getQuestionForSession(sessionId)

    return {
        props: {
            question
        }
    }
}

export default QuestionScreen
