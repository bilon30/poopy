module.exports = {
  helpf: '(phrase | regexp)',
  desc: 'Matches the content in the phrase with the RegExp.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var phrase = split[0] ?? ''
    var reg = split.slice(1).length ? split.slice(1).join('|') : ''
    var regexp = new RegExp(reg, 'i')
    var match = phrase.match(regexp) ?? []
    return match[1] ?? match[0] ?? ''
  }
}