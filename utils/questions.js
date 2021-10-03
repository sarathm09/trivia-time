import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'
import supabase from './supabase'
import { decodeText, shuffleValues } from './commons'


export async function getQuestionForSession(sessionId) {
    // TODO set category code if needed
    const questionsUrl = `https://opentdb.com/api.php?amount=1&type=multiple&token=${sessionId}`
    const questionsResponse = await fetch(questionsUrl).then(response => response.json())

    let question = questionsResponse.results[0]
    const savedData = await saveQuestionToDb(question)

    return {
        id: savedData?.id,
        category: savedData?.category,
        difficulty: savedData?.difficulty,
        question: savedData?.question,
        options: savedData?.options.map(option => ({
            value: option,
            enabled: true
        }))
    }
}


async function saveQuestionToDb(question) {
    const decodedQuestionText = decodeText(question.question)
    const savedQuestionData = await getQuestionByText(decodedQuestionText)

    if (savedQuestionData) {
        return savedQuestionData
    }

    const { data, error } = await supabase
        .from('question')
        .upsert([{
            id: uuid(),
            category: question.category,
            difficulty: question.difficulty,
            question: decodedQuestionText,
            options: shuffleValues([...question.incorrect_answers, question.correct_answer].map(text => decodeText(text))),
            answer: question.correct_answer
        }])

    if (error) {
        console.error(error)
        return {}
    }

    return data[0]
}

export async function getQuestionByText(questionText) {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('question', questionText)

    if (error) {
        console.error(error)
        return
    }
    if (data?.length > 0) {
        return data[0]
    }
}

export async function getQuestionById(questionId) {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('id', questionId)

    if (error) {
        console.error(error)
        return
    }
    if (data?.length > 0) {
        return data[0]
    }
}
