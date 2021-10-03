const fetch = require('node-fetch')
const { writeFile } = require('fs/promises')
const decode = require('decode-html')
const uuid = require('uuid').v5

const TOKEN = '7f84f2a5ee02751aa9a78638ee7ac8bdb13a4a14f3115f4814c0ec177fb29209'


const get = async () => {
    const questions = []
    const parsed = new Set()

    while (questions.length < 5000) {
        const result = await fetch('https://opentdb.com/api.php?amount=50&type=multiple')
            .then(resp => resp.json())

        result.result.filter(q => !parsed.has(q.question)).forEach(q => {
            parsed.add(q.question)
            questions.push({
                id: uuid(),
                category: q.category,
                difficulty: q.difficulty,
                question: decodeText(q.question),
                options: shuffleValues([...q.incorrect_answers, q.correct_answer].map(text => decodeText(text))),
                answer: q.correct_answer
            })
        })

        console.log(questions.length)
        await writeFile('questions.json', JSON.stringify(questions, null, 2))
    }
}

function shuffleValues(values) {
    return values.sort((a, b) => Math.random() % 2 ? 1 : -1)
}

function decodeText(text) {
    return unescape(decode(text).split('&#039;').join('\''))
}

get()

