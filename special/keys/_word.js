module.exports = {
    desc: 'Returns a random word.', func: async function () {
        let poopy = this

        var wordJSON = poopy.json.wordJSON
        return wordJSON.data[Math.floor(Math.random() * wordJSON.data.length)].word.value
    }
}