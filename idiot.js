function getArgs(text) {
    function getArgName(argname) {
        var argall = [argname]
        var argmultimatch = argname.match(/\(([\s\S]*?)\)/g) ?? []
        var argmulti = argmultimatch.map(multi => {
            return {
                rp: multi,
                rpc: multi.substring(1, multi.length - 1).split('/')
            }
        })

        if (argmulti.length > 0) {
            argall = []
            for (var argm of argmulti) {
                for (var rpc of argm.rpc) {
                    argall.push(argname.replace(argm.rp, rpc))
                }
            }
        }

        return argall
    }

    var [ args, description ] = text.split(' - ')
    var argmatch = args.match(/((\([^(\\]*(?:\\[\S\s][^)\\]*)*\)|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|<[^<\\]*(?:\\[\S\s][^>\\]*)*>|\{[^\{\\]*(?:\\[\S\s][^}\\]*)*}|\[[^\[\\]*(?:\\[\S\s][^\]\\]*)*\]|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+))(\.\.\.)?/g)
    if (argmatch[0].includes('newpoopy')) argmatch.splice(0, 1)
    var argreq = {
        "<": true,
        "{": false,
        "[": false
    }
    var arglist = []

    var cmd = argmatch.splice(0, 1)[0].split('/')[0].replace(/[^a-z0-9_-]/g, '')

    for (var arg of argmatch) {
        var multiarg = false
        var specifarg = false

        if (arg[0] == '-') break
        if (arg[0] == '(') break
    
        var origarg = arg
        if (arg[0].endsWith('...')) {
            multiarg = true
            arg = arg.substring(0, arg.length - 3)
        }
        if (arg[0] == '"') arg = arg.substring(1, arg.length - 1)
        var required = argreq[arg[0]]
        arg = arg.substring(1, arg.length - 1)
        var argsplit = arg.match(/(\([^(\\]*(?:\\[\S\s][^)\\]*)*\)|(?:\\\s|\S)+)/g)

        var argname = argsplit[0]
        if (multiarg) argname = argname.substring(0, argname.length - 1) + 's'
        if (argname[0] == '-') {
            specifarg = true
            argname = argname.substring(1)
        }
        for (var argm of getArgName(argname, multiarg)) {
            arglist.push({
                name: argm,
                required,
                specifarg,
                orig: origarg
            })
        }
    }

    return {
        name: cmd,
        args: arglist,
        description
    }
}

const fs = require('fs')
const poopyRegex = /poopy\.[a-zA-Z0-9_]+(\.|\[|\()/g

fs.readdirSync('cmds').forEach(cat => {
    fs.readdirSync(`cmds/${cat}`).forEach(cmn => {
        let cmdData = require(`./cmds/${cat}/${cmn}`)
        let execute = cmdData.execute.toString()
        let spacing = execute.split('\n')[1].match(/^ */)
        
        let matches = execute.match(poopyRegex)

        if (matches) {
            matches = matches.map(m => m.substring(6, m.length - 1)).filter((lang, index, self) => self.findIndex(l => l === lang) === index)
            let poopers = matches.map(m => `${spacing}let ${m} = poopy.${m}`)
            let newexe = execute.replace(poopyRegex, s => s.substring(6)).split('\n')
            
            newexe[1] += `\n${poopers.join('\n')}`
            fs.writeFileSync(`cmds/${cat}/${cmn}`, cmd.replace(execute, newexe.join('\n')))
        }
    })
})