module.exports = {
    desc: 'Returns a random DM phrase.', func: async (msg) => {
        let poopy = this

        return poopy.arrays.dmPhrases[Math.floor(Math.random() * poopy.arrays.dmPhrases.length)]
            .replace(/{mention}/, `<@${msg.author.id}>`)
    }
}