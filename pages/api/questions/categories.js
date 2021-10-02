import fetch from 'node-fetch'

export default async function handler(req, res) {
    const categoryUrl = 'https://opentdb.com/api_category.php'
    const categoriesResponse = await fetch(categoryUrl).then(resp => resp.json())
    res.status(200).json(categoriesResponse.trivia_categories)
}
