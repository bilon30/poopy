module.exports = {
    helpf: '(query | index) (nsfw channel only)',
    desc: 'rule 34',
    func: async function (matches, msg) {
        let poopy = this
        let { splitKeyFunc, getIndexOption, parseNumber } = poopy.functions
        let modules = poopy.modules
        
        if (!msg.channel.nsfw) return 'no'

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var query = getIndexOption(split, 0)[0]
        var page = getIndexOption(split, 1, { n: Infinity }).join(' | ')
        var res = await modules.axios.get(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${encodeURIComponent(query)}`).catch(() => { })
        
        if (!res) return word

        var urls = res.data.map(result => result.file_url)
        
        if (!urls || !urls.length) return word

        var page = parseNumber(page, { dft: Math.floor(Math.random() * urls.length), min: 0, max: urls.length - 1, round: true })

        return urls[page]
    },
    attemptvalue: 10,
    limit: 5,
    cmdconnected: 'rule34'
}