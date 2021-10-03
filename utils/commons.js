import decode from 'decode-html'

export function shuffleValues(values) {
    return values?.sort((a, b) => Math.random() - 0.5) || []
}

export function decodeText(text) {
    return unescape(decode(text).split('&#039;').join('\''))
}