import { getQuestionForSession } from "../../../../../utils/questions"


export default async function handler(req, res) {
    const sessionId = req.query.sessionId
    res.status(200).json(getQuestionForSession(sessionId))
}