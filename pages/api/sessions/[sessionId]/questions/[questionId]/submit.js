import { supabase } from "#utils/supabase"


async function isSessionValid(userId, sessionId, res) {
    const { data: sessions, error } = await supabase
        .from('session')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .eq('session_id', sessionId)

    if (error || sessions.length === 0) {
        res.status(404).json({ message: 'Session not found' })
        return false
    }
    return true
}

async function getQuestion(questionId, res) {
    const { data: questions, error } = await supabase
        .from('question')
        .select('*')
        .eq('id', questionId)

    if (!questions || questions.length === 0) {
        res.status(404).json({ message: 'Question not found' })
    }
    return questions[0]
}

async function logQuestionAttempt(userId, sessionId, question, answer, score = 0) {
    const { data, error } = await supabase
        .from('session_questions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('question_id', question.id)
        .neq('answer', null)
        .order('attempt', { ascending: false })

    await supabase
        .from('session_questions')
        .upsert({
            session_id: sessionId,
            question_id: question.id,
            attempt: (data[0]?.attempt + 1) || 1,
            answer,
            score: score / ((data[0]?.attempt + 1) || 1)
        })
    return score / ((data[0]?.attempt + 1) || 1)
}

export default async function handler(req, res) {
    const { sessionId, questionId } = req.query
    const { user } = await supabase.auth.api.getUserByCookie(req)

    if (await isSessionValid(user.id, sessionId, res)) {
        const question = await getQuestion(questionId, res)

        if (question && req.body.selectedAnswer === question.answer) {
            let score = await logQuestionAttempt(user.id, sessionId, question, req.body.selectedAnswer, question.base_score)
            res.status(200).json({
                status: true,
                score
            })
        } else {
            // attempt++
            let score = await logQuestionAttempt(user.id, sessionId, question, req.body.selectedAnswer, 0)
            res.status(200).json({
                status: false,
                score
            })
        }
    }
}