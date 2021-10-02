import { getQuestionForSession } from '../../utils/questions'

const QuestionScreen = () => {
    return <></>
}

export async function getServerSideProps(context) {
    const sessionId = context.params.sessionId
    const question = await getQuestionForSession(sessionId)
    console.log(question)
    return {
        redirect: {
            destination: `/sessions/${sessionId}/questions/${question.id}`,
            permanent: false,
        }
    }
}

export default QuestionScreen
