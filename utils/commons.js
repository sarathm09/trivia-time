
export function shuffleValues(values) {
    return values?.sort((a, b) => Math.random() - 0.5) || []
}
