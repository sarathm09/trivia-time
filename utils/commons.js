import decode from 'decode-html'

export function shuffleValues(values) {
    return values.sort((a, b) => Math.random() % 2 ? 1 : -1)
}

export function decodeText(text) {
    return unescape(decode(text).split('&#039;').join('\''))
}