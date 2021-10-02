import { decodeText } from "../../../../../../utils/commons"
import { getQuestionById, getQuestionForSession } from "../../../../../../utils/questions"
import supabase from "../../../../../../utils/supabase"


export default async function handler(req, res) {
    const { sessionId, questionId } = req.query

    console.log(supabase.auth.currentUser)
    console.log(req.header)
    const question = await getQuestionById(questionId)

    if (!question) {
        res.status(404).json({ message: 'Question not found' })
    }
    if (decodeText(question.answer) === decodeText(req.body.selectedAnswer)) {
        let newQuestion = await getQuestionForSession(sessionId)
        res.status(200).json({
            status: true,
            score: 0,
            question: newQuestion.id
        })
    } else {
        // attempt++
        res.status(400).json({
            status: false,
            score: 0,
            timeTaken: ''
        })
    }

}