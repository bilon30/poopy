const Discord = require('discord.js')

class Poopy {
    constructor(config = {}) {
        // setting up options
        let poopy = this

        poopy.config = {
            testing: false,
            poosonia: false,
            forcetrue: false,
            useReactions: false,
            textEmbeds: false,
            poosoniablacklist: ['dm', 'tdms', 'spam', 'eval', 'leave', 'shutup'],
            poosoniakeywordblacklist: [],
            poosoniafunctionblacklist: ['messagecollector', 'stopcollector', 'stopallcollectors'],
            allowtesting: true,
            allowbotusage: false,
            mongodatabase: 'poopydata',
            globalPrefix: 'p:',
            stfu: false,
            intents: Object.values(Discord.Intents.FLAGS),
            ownerids: ['464438783866175489', '454732245425455105', '613501149282172970'],
            jsoning: ['411624455194804224', '395947826690916362', '486845950200119307'],
            shit: [''],
            illKillYouIfYouUseEval: ['535467581881188354'],
            msgcooldown: 0,
            limits: {
                size: {
                    image: 20,
                    gif: 20,
                    video: 20,
                    audio: 20,
                    message: `that file exceeds the size limit of {param} mb hahahaha (try to use the shrink, setfps, trim or crunch commands)`
                },
                frames: {
                    gif: 1000,
                    video: 10000,
                    message: `the frames in that file exceed the limit of {param} hahahaha (try to use the setfps or the trim commands)`
                },
                width: {
                    image: 3000,
                    gif: 1000,
                    video: 2000,
                    message: `the width of that file exceeds the limit of {param} hahahaha (try to use the shrink command)`
                },
                height: {
                    image: 3000,
                    gif: 1000,
                    video: 2000,
                    message: `the height of that file exceeds the limit of {param} hahahaha (try to use the shrink command)`
                }
            },
            limitsexcept: {
                size: {
                    image: 100,
                    gif: 100,
                    video: 100,
                    audio: 100,
                    message: `that file exceeds the exception size limit of {param} mb hahahaha there's nothing you can do`
                },
                frames: {
                    gif: 5000,
                    video: 50000,
                    message: `the frames in that file exceed the exception limit of {param} hahahaha there's nothing you can do`
                },
                width: {
                    image: 10000,
                    gif: 2000,
                    video: 5000,
                    message: `the width of that file exceeds the exception limit of {param} hahahaha there's nothing you can do`
                },
                height: {
                    image: 10000,
                    gif: 2000,
                    video: 5000,
                    message: `the height of that file exceeds the exception limit of {param} hahahaha there's nothing you can do`
                }
            },
            commandLimit: 5,
            keyLimit: 500,
            memLimit: 0
        }

        for (var i in config) {
            poopy.config[i] = config[i]
        }

        poopy.modules = {}
        poopy.functions = {}
        poopy.callbacks = {}
        poopy.vars = {}
        poopy.data = {}
        poopy.tempdata = {}
        poopy.procs = []

        // module trash
        poopy.modules.Discord = Discord
        poopy.modules.discordModals = require('discord-modals')
        poopy.modules.REST = require('@discordjs/rest').REST
        poopy.modules.Routes = require('discord-api-types/v9').Routes
        poopy.modules.DiscordBuilders = require('@discordjs/builders')
        poopy.modules.fs = require('fs-extra')
        poopy.modules.archiver = require('archiver')
        poopy.modules.spawn = require('child_process').spawn
        poopy.modules.fileType = require('file-type')
        poopy.modules.axios = require('axios').default
        poopy.modules.cheerio = require('cheerio')
        poopy.modules.util = require('util')
        poopy.modules.md5 = require('md5')

        // because i improved the print() function in jimp, i need to replace the original with the new one before requiring() it
        if (poopy.modules.fs.existsSync('node_modules/@jimp/plugin-print')) {
            poopy.modules.fs.rmSync('node_modules/@jimp/plugin-print', { force: true, recursive: true })
        }
        poopy.modules.fs.copySync('modules/plugin-print', 'node_modules/@jimp/plugin-print', { recursive: true })
        poopy.modules.Jimp = require('jimp')

        //poopy.modules.selenium = require('selenium-webdriver')
        //poopy.modules.chrome = require('selenium-webdriver/chrome')
        poopy.modules.whatwg = require('whatwg-url')
        poopy.modules.deepai = require('deepai')
        poopy.modules.noblox = require('noblox.js')
        poopy.modules.youtubedl = require('youtube-dl-exec')
        poopy.modules.google = require('googleapis').google
        //poopy.modules.Twitter = require('twitter')
        poopy.modules.gis = require('g-i-s')
        poopy.modules.catbox = require('catbox.moe')
        poopy.modules.mathjs = require('mathjs')
        poopy.modules.prettyBytes = require('pretty-bytes')
        poopy.modules.os = require('os')

        // these are functions
        poopy.functions.getEmojis = require('@jimp/plugin-print/emojis')
        poopy.functions.braille = require('./modules/braille')
        poopy.functions.averageColor = require('./modules/averageColor')
        poopy.functions.spectrogram = require('./modules/spectrogram')
        poopy.functions.getAllData = require('./modules/dataGathering').getAllData
        poopy.functions.updateAllData = require('./modules/dataGathering').updateAllData
        poopy.functions.globalData = require('./modules/globalData')
        poopy.functions.brainfuck = require('./modules/brainfuck')
        poopy.functions.tobrainfuck = require('./modules/tobrainfuck')
        poopy.functions.gibberish = require('./modules/gibberish')

        // bot and variables now
        poopy.bot = new poopy.modules.Discord.Client({
            intents: poopy.config.intents,
            partials: ['CHANNEL']
        })
        poopy.package = JSON.parse(poopy.modules.fs.readFileSync('package.json'))

        poopy.modules.discordModals.InteractionResponses.applyToClass(poopy.modules.discordModals.ModalSubmitInteraction, [
            'deferReply',
            'reply',
            'fetchReply',
            'editReply',
            'deleteReply',
            'followUp',
            'update',
        ])
        poopy.modules.discordModals(poopy.bot)
        poopy.vars.msgcooldown = false
        poopy.vars.validUrl = /(http|https):\/\/[^\s`"]+/
        poopy.vars.emojiRegex = require('emoji-regex')()
        poopy.vars.Catbox = new poopy.modules.catbox.Catbox()
        poopy.vars.youtube = poopy.modules.google.youtube({
            version: 'v3',
            auth: process.env.GOOGLEKEY
        })
        poopy.modules.deepai.setApiKey(process.env.DEEPAIKEY)
        /*poopy.vars.twitterClient = new poopy.modulesitter({
            consumer_key: process.env.TWITTERCONSUMERKEY,
            consumer_secret: process.env.TWITTERCONSUMERSECRET,
            access_token_key: process.env.TWITTERACCESSTOKENKEY,
            access_token_secret: process.env.TWITTERACCESSTOKENSECRET
        })*/
        poopy.vars.rest = new poopy.modules.REST({ version: '9' })
        poopy.vars.gifFormats = ['gif', 'apng']
        poopy.vars.symbolreplacements = [
            {
                target: ['‘', '’', '‛', '❛', '❜'],
                replacement: '\''
            },
            {
                target: ['“', '”', '‟'],
                replacement: '"'
            },
        ]
        poopy.vars.punctuation = ['?', '.', '!', '...']
        poopy.vars.caseModifiers = [
            function (text) {
                return text.toUpperCase()
            },
            function (text) {
                return text.toLowerCase()
            },
            function (text) {
                return text.toUpperCase().substring(0, 1) + text.toLowerCase().substring(1)
            }
        ]
        poopy.vars.statusChanges = 'true'
        poopy.vars.filecount = 0
        poopy.vars.cps = 0
        //poopy.vars.chromeWindow = false

        poopy.statuses = [
            {
                name: "the cycle of poopy",
                type: "WATCHING"
            },
            {
                name: "berezaa",
                type: "WATCHING"
            },
            {
                name: "beans",
                type: "WATCHING"
            },
            {
                name: "Deinx abusing admin",
                type: "LISTENING"
            },
            {
                name: "Soup",
                type: "PLAYING"
            },
            {
                name: "Garfield Kart",
                type: "PLAYING"
            },
            {
                name: "Troll Boxing",
                type: "COMPETING"
            },
            {
                name: "the Annoying Orange",
                type: "STREAMING"
            },
            {
                name: "",
                type: "WATCHING"
            },
            {
                name: "nine",
                type: "STREAMING"
            },
            {
                name: "simple steps on how to make a chocolate generator",
                type: "STREAMING"
            },
            {
                name: "me doing arson",
                type: "STREAMING"
            },
            {
                name: "the quadrillionth 2 minute long video with dramatic music",
                type: "LISTENING"
            },
            {
                name: "edgar",
                type: "LISTENING"
            },
            {
                name: "the sky",
                type: "WATCHING"
            },
            {
                name: "sprikrjdbdondpipopiekprjtiet (luigi remix)",
                type: "LISTENING"
            },
            {
                name: "the brown note",
                type: "LISTENING"
            },
            {
                name: "you",
                type: "WATCHING"
            },
            {
                name: "the salami lid",
                type: "COMPETING"
            },
            {
                name: "deals",
                type: "WATCHING"
            },
            {
                name: "the server get filled with femboys",
                type: "WATCHING"
            },
            {
                name: "drama",
                type: "LISTENING"
            },
            {
                name: "HELL",
                type: "COMPETING"
            },
            {
                name: "tenor gif search",
                type: "WATCHING"
            },
            {
                name: "myself getting banned from Roblox for no reason for uploading multiple frames of a banana GIF",
                type: "WATCHING"
            },
            {
                name: "The Furry Community",
                type: "PLAYING"
            },
            {
                name: "the economy fall",
                type: "WATCHING"
            },
            {
                name: "O RALSEI GARCELLO É UM MEME DOIDO! Mod Deltarune Friday Night Funkin",
                type: "WATCHING"
            },
            {
                name: "my funny video playlist",
                type: "WATCHING"
            },
            {
                name: "pilgrammed soundtrack",
                type: "LISTENING"
            },
            {
                name: "bagel timelapse",
                type: "STREAMING"
            },
            {
                name: "Intel(R) Xeon(R) Platinum 8259CL CPU @ 2.50GHz",
                type: "WATCHING"
            },
            {
                name: "t",
                type: "LISTENING"
            },
            {
                name: "bowsers big bean burrito",
                type: "WATCHING"
            },
            {
                name: "fnaf",
                type: "PLAYING"
            },
            {
                name: "New",
                type: "PLAYING"
            },
            {
                name: "_______.exe",
                type: "PLAYING"
            },
            {
                name: "rogue lineage",
                type: "PLAYING"
            },
            {
                name: "I only said the death threats because they angered me",
                type: "LISTENING"
            },
            {
                name: "squid games by mr nick",
                type: "WATCHING"
            },
            {
                name: "Emote Game 3",
                type: "STREAMING"
            },
            {
                name: "crjypptoland",
                type: "COMPETING"
            },
            {
                name: "le nft rouge",
                type: "WATCHING"
            },
            {
                name: "a blender",
                type: "STREAMING"
            },
            {
                name: "fl studio",
                type: "LISTENING"
            },
            {
                name: "... A D",
                type: "COMPETING"
            },
            {
                name: "sayorine",
                type: "WATCHING"
            },
            {
                name: "YOUR HOUSE LOL",
                type: "STREAMING"
            },
            {
                name: "as a robloxian studying with a pencil on the book",
                type: "PLAYING"
            },
            {
                name: "Roblox 🏅",
                type: "COMPETING"
            },
            {
                name: "poopy crash count",
                type: "STREAMING"
            },
            {
                name: "with your files",
                type: "PLAYING"
            },
            {
                name: "node.js",
                type: "PLAYING"
            },
            {
                name: "UNDERTALE",
                type: "STREAMING"
            },
            {
                name: "evil js programmer be like i do not want to kill myself",
                type: "PLAYING"
            },
            {
                name: "terraria babis mod",
                type: "PLAYING"
            },
            {
                name: "tModLoader",
                type: "PLAYING"
            },
            {
                name: "PLANTS VS ZOMBIES GARDEN WARFARE БОСС МОД NIG",
                type: "PLAYING"
            },
            {
                name: "What are the true capabilities of Nr N? What is his purpose?",
                type: "LISTENING"
            },
            {
                name: "https://media.discordapp.net/attachments/535469236802551811/932928601735692349/EXEHOTVIdle.gif",
                type: "STREAMING"
            },
            {
                name: "gurt",
                type: "WATCHING"
            }
        ]

        // objects and arrays for things like the arab dictionary
        poopy.json = {
            wordJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/words.json')),
            continentJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/continents.json')),
            countryJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/countries.json')),
            languageJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/languages.json')),
            cityJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/cities.json')),
            restaurantJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/foods.json')),
            sentenceJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/sentences.json')),
            nounJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/nouns.json')),
            verbJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/verbs.json')),
            adjJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/adjectives.json')),
            imageJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/images.json')),
            nameJSON: JSON.parse(poopy.modules.fs.readFileSync('./templates/json/names.json')),
            emojiJSON: []
        }
        poopy.arrays = {
            arabDictionary: [
                '4chan', 'the poopening', 'negro', 'feet', 'GIANT COCK', 'orgy',
                'e621', 'cum', 'r34', 'mug', 'Talking Tom', 'Talking Ben', 'Talking Angela',
                'IShowSpeed', 'deepwoken', 'pilgrammed', 'lean', '🤓', 'punapea6', 'dream', 'soup land',
                'phexonia studios', 'idfsgs', 'penis', 'sex', 'hentai', 'area', 'World', 'throat',
                'Mongolian', 'finnish', 'Malagasy', 'Iraqi', 'polish', 'ethiopian', 'canadian',
                'ukrainian', 'iranian', 'irish', 'swedish', 'danish', 'french', 'chips', 'spanish',
                'racist', 'superbrohouse', 'deinx', 'bubbley', 'deinbag', 'another', 'crypyth',
                'tordenask', 'lead', 'wovxzers', 'dootings', 'bartekoklol', 'tuca', 'ballfish', 'kleio',
                'crazy', 'cinna', 'btn', 'tree', 'gritzy', 'ruki', 'henry', 'empsy', 'maks', 'henhen',
                'phex', 'icre8', 'bilon', 'fnepp', 'zekkriel', 'tranzst', 'mance', 'luigistar', 'makos',
                'spellbunny', 'scriptedsand', 'puppet', 'josh', 'spooky', 'catfishhotdog', 'robuk',
                'pl0x7', 'lemoardo', 'dundeed', 'notsam', 'luigiluis', 'trongal', 'mysterymeatwad',
                'carlito', 'azureblob', 'simpremove', 'gobby', 'sayori', 'concern', 'betteruser', 'tix',
                'charleh', 'jlol', 'Featured', 'Vesteria', 'Rogue Lineage', 'madness', 'tricky', 'zardy',
                'madness combat', 'splatoon', 'babis', 'wiki', 'fandom', 'milk', 'carrot', 'vinegar',
                'mushroom', 'stew', 'shroom', 'peashooter', 'eyed', 'pea', 'frank', 'carl', 'oil',
                'sunflower', 'chomper', 'piranha', 'fishes', 'fishe', 'fish', 'salami', 'lid', '≥w≤',
                'furry', 'nya', 'uwu', 'owo', '^w^', 'freedom', 'dick', 'flip', 'bottle', 'pork',
                'demotion', 'promotion', 'Error', 'Scream', 'spoon', 'knife', 'all over', 'african',
                'land', '😂', 'yup', 'pee', 'piss', 'stranger language', 'edition', 'version', 'turtle',
                'language', 'stranger', 'persian', 'people', 'Freddy', 'FNAF', 'giraffe', 'hippopotamus',
                'program', 'coding', 'ocean', 'treasure', 'egg', 'tool', 'lad', 'lad village', 'GPU',
                'CPU', 'lag', 'imposter', 'Among Us', 'sus', 'homework', 'markov', 'moment', 'nervous',
                'shy', 'CHICKEN', 'sosig', 'brogle', 'Dad', 'Grand', 'Windows 95', 'Windows XP',
                'big fat', 'blender', 'group', 'Phexonia', 'venezuelan', 'tf2', 'Bastard', 'obby',
                'david', 'WARIO', 'sandals', 'livestream', 'youtube', 'minimum', 'pickle', 'NSFW',
                'hot', 'RALEIGH', 'PEED FAMILY', 'gif', 'nostalgia critic', 'Britain', 'America',
                'United Kingdom', 'soup', 'United States of America', 'WOMEN', 'wife', 'cat',
                'marselo', 'tech support', 'indian', 'australian', 'japanese', 'Plants vs Zombies',
                'Joe Biden', 'chinese', 'Chinese Republic', 'french fries', 'german', 'SWITZERLAND',
                'denmark', 'Donald Trump', 'portuguese', 'nigerian', 'russian', 'beach', 'alpha',
                'beta', 'theaters', 'Movie', 'Trailer', 'Lego', 'chalk', 'Documentation', 'mcdrive',
                'Boner', 'Big', 'Giant', 'Small', 'Awesome', 'STOLEN', 'no', 'yes', 'car', 'Rigby',
                'Mordecai', 'BENSON', 'park', 'blaster', 'gaster', 'Undertale', 'phil', 'Anvil',
                'halloween', 'pumpkin', 'shut up', 'platinum', 'cheats', 'farms', 'GOLD', 'cake day',
                'pizza slice', 'lasagna', 'quesadilla', 'enchilada', 'Miner\'s Haven', 'berezaa',
                'LEGENDARY', 'Bee Swarm Simulator', 'beta tester', 'member', 'creator', 'family',
                'Empire', 'Warfare', 'upvotes', 'downvotes', 'redditor', 'reddit', 'reddit arguments',
                'twitter', 'twitter arguments', 'amongla', 'virus', 'viruses', 'INSTALL NOW',
                'FL Studio VST', 'Torrent', 'Github', 'the ESSENCE', 'soup satan', 'soup god',
                'quesley', 'empsy', 'illegal', 'legal', 'regal', 'deflorestation', 'DONKEY KONG',
                'piss shit come', 'gay chains', 'Tss crazed', 'ralsei', '👶', '✅', 'PIG', 'cucumber',
                'mark\'s pizzeria', 'dominus pizza', 'pizza hut', 'wendy\'s', 'hat', 'tool',
                'burger king', 'mcdonalds', 'nugget', 'fat', 'WTF', 'ROFL', 'XD', 'LMAO', 'LOL', 'Lad',
                'Piid', 'LOUD', 'griefed', 'Fitmc', '2b2t', 'POPBOB', 'mommy', 'Survival', 'Jeff',
                'Slender', 'Piggy', '🐖', 'artistic', 'Burrito', 'fart channel', '💓', 'Banjo',
                'guitarist', 'guitar', 'chords', 'instruments', 'bingus', 'sussy', 'Big ass',
                'crewmate', 'Imposter', 'choccy milk', 'thwomp', '🐡', 'brain rot', 'your mom', 'baby',
                'baby farting', 'Admin', 'EMOTE GAME', 'Sega', 'Sega Genesis', 'Newgrounds', 'Gamejolt',
                'Steam', 'Epic Games', 'basket', 'update released', 'Soup Land', 'ROCKET',
                'clash of clans', 'clothes', 'lore', 'fart machine', 'mech', 'Angry Birds',
                'Bad Piggies', 'vlog', 'Poopy', 'machine', 'Thanos', 'porn', 'New emote', 'bought',
                'Sun', 'Moon', 'Friday Night Funkin', 'Mod', 'Minecraft', 'Terraria', 'Roblox',
                'Shaders', '2012', '2016', 'peter', 'GTA 6', 'GTA', 'bananas', 'shanky', 'PEED',
                'Hollow Knight', 'Burrito Bison', 'Taco', 'taxes', 'budget', 'dollars', 'british',
                'fluffy', 'brocolli', 'brain', 'SHIT', 'HELL', 'naked', 'babis', 'kingdom', 'HAHAHA',
                'arabic', 'Rocket League', 'Fortnite', 'mrflimflam', 'Flamingo', 'rap', 'bitch',
                'Poop', 'MARIO', 'crAck', 'Harambe', 'hellish', 'crimes', 'cordy', 'Halal', 'HARAM',
                'Chungus', 'president', 'santa', 'idiot', 'WOW', 'SANS', 'FART', 'Garfield', 'POG',
                'DEINX', 'discord', 'Super', 'Market', 'Mark', 'EXPLOSIVE', 'combat', 'oyster',
                'Epico', 'Grammar', 'SUS', 'fresh', 'matilda', 'sonic', 'corpses', 'Egyptian', 'White',
                'BLACK', 'wacky', 'card', 'credit', 'Tycoon', 'tunas', 'Israelite', 'Saudi',
                'brazilian', 'Luigi', 'shawty'
            ],
            tenorDictionary: [
                'mug', 'Talking Tom', 'Talking Ben', 'Talking Angela', 'IShowSpeed',
                'deepwoken', 'pilgrammed', 'lean', '🤓', 'punapea6', 'dream', 'soup land',
                'phexonia studios', 'idfsgs', 'chips', 'racist', 'superbrohouse', 'deinx', 'bubbley',
                'deinbag', 'another', 'crypyth', 'tordenask', 'lead', 'wovxzers', 'dootings',
                'bartekoklol', 'tuca', 'ballfish', 'kleio', 'crazy', 'cinna', 'btn', 'tree', 'gritzy',
                'ruki', 'henry', 'empsy', 'maks', 'henhen', 'phex', 'icre8', 'bilon', 'fnepp',
                'zekkriel', 'tranzst', 'mance', 'luigistar', 'makos', 'spellbunny', 'scriptedsand',
                'puppet', 'josh', 'spooky', 'catfishhotdog', 'robuk', 'pl0x7', 'lemoardo', 'dundeed',
                'notsam', 'luigiluis', 'trongal', 'mysterymeatwad', 'carlito', 'azureblob',
                'simpremove', 'gobby', 'sayori', 'concern', 'betteruser', 'tix', 'charleh', 'jlol',
                'Vesteria', 'Rogue Lineage', 'tricky', 'zardy', 'madness combat', 'splatoon', 'babis',
                'carrot', 'vinegar', 'mushroom', 'stew', 'shroom', 'peashooter', 'frank', 'carl',
                'oil', 'sunflower', 'chomper', 'piranha', 'fishes', 'fishe', 'fish', 'salami', 'furry',
                'uwu', 'owo', 'flip', 'bottle', 'pork', 'demotion', 'promotion', 'Error', 'spoon',
                'knife', 'african', '😂', 'yup', 'turtle', 'persian', 'Freddy', 'FNAF', 'giraffe',
                'hippopotamus', 'coding', 'ocean', 'egg', 'tool', 'lad', 'lad village', 'GPU', 'CPU',
                'lag', 'imposter', 'Among Us', 'sus', 'homework', 'CHICKEN', 'sosig', 'brogle',
                'Windows 95', 'Windows XP', 'blender', 'Phexonia', 'tf2', 'Bastard', 'obby', 'david',
                'WARIO', 'sandals', 'livestream', 'youtube', 'pickle', 'hot', 'RALEIGH', 'PEED FAMILY',
                'gif', 'nostalgia critic', 'Britain', 'America', 'United Kingdom', 'soup',
                'United States of America', 'WOMEN', 'cat', 'marselo', 'tech support', 'indian',
                'japanese', 'Plants vs Zombies', 'Joe Biden', 'chinese', 'Chinese Republic',
                'french fries', 'german', 'SWITZERLAND', 'denmark', 'Donald Trump', 'portuguese',
                'nigerian', 'russian', 'beach', 'Lego', 'Documentation', 'mcdrive', 'no', 'yes',
                'Rigby', 'Mordecai', 'BENSON', 'park', 'phil', 'Anvil', 'halloween', 'pumpkin',
                'shut up', 'platinum', 'cheats', 'GOLD', 'cake day', 'pizza slice', 'lasagna',
                'quesadilla', 'enchilada', 'Miner\'s Haven', 'berezaa', 'LEGENDARY',
                'Bee Swarm Simulator', 'beta tester', 'creator', 'upvotes', 'downvotes', 'redditor',
                'reddit', 'reddit arguments', 'twitter', 'twitter arguments', 'amongla', 'virus',
                'viruses', 'INSTALL NOW', 'Torrent', 'Github', 'the ESSENCE', 'soup satan', 'soup god',
                'quesley', 'empsy', 'regal', 'deflorestation', 'DONKEY KONG', 'gay chains',
                'Tss crazed', 'ralsei', '👶', '✅', 'PIG', 'cucumber', 'mark\'s pizzeria',
                'dominus pizza', 'pizza hut', 'wendy\'s', 'burger king', 'mcdonalds', 'nugget', 'fat',
                'WTF', 'ROFL', 'XD', 'LMAO', 'LOL', 'Lad', 'griefed', 'Fitmc', '2b2t', 'POPBOB',
                'Jeff', 'Slender', 'Piggy', '🐖', 'Burrito', 'fart channel', '💓', 'Banjo',
                'guitarist', 'guitar', 'instruments', 'bingus', 'sussy', 'crewmate', 'Imposter',
                'choccy milk', 'thwomp', '🐡', 'baby', 'Admin', 'EMOTE GAME', 'Sega', 'Sega Genesis',
                'Newgrounds', 'Gamejolt', 'Steam', 'Epic Games', 'basket', 'update released',
                'Soup Land', 'ROCKET', 'clash of clans', 'lore', 'mech', 'Angry Birds', 'Bad Piggies',
                'machine', 'Thanos', 'Sun', 'Moon', 'Friday Night Funkin', 'Mod', 'Minecraft',
                'Terraria', 'Roblox', 'Shaders', '2012', '2016', 'peter', 'GTA 6', 'GTA', 'bananas',
                'Hollow Knight', 'Burrito Bison', 'Taco', 'taxes', 'budget', 'dollars', 'british',
                'brocolli', 'HELL', 'babis', 'kingdom', 'HAHAHA', 'arabic', 'Rocket League',
                'Fortnite', 'mrflimflam', 'Flamingo', 'rap', 'MARIO', 'crimes', 'cordy', 'Halal',
                'HARAM', 'Chungus', 'president', 'santa', 'WOW', 'FART', 'Garfield', 'POG', 'DEINX',
                'discord', 'Market', 'Mark', 'EXPLOSIVE', 'combat', 'oyster', 'Epico', 'Grammar',
                'SUS', 'fresh', 'matilda', 'sonic', 'Egyptian', 'White', 'BLACK', 'Tycoon', 'tunas',
                'brazilian', 'Luigi'
            ],
            arabConnectors: [
                'basically', 'literally', 'unexpected', 'expected', 'lost',
                'lost his shit', 'grinds', 'since', 'I\'m', 'he\'s', 'she\'s', 'le', 'now', 'says',
                'shitted', 'promoted', 'demoted', 'buttered', 'lagging', 'praying', 'died',
                'streaming', 'skydiving', 'trolled', 'goes viral', 'fight', 'gets fired', 'like',
                'love', 'driving', 'could', 'can', 'that', 'this', 'these', 'those', 'who', 'WHEN',
                'so', 'called out', 'on', 'sued', 'cancelled', 'installed', 'removed', 'muting', 'am',
                'are', 'arrested', 'i', 'you', 'he', 'his', 'her', 'she', 'it', 'that', 'the', 'is',
                'was', 'a', 'an', 'watch', 'play', 'gotta', 'get', 'gaming', 'balling', 'yours',
                'mine', 'your', 'you\'re', 'we\'re', 'they\'re', 'our', 'we', 'they', 'them', 'their',
                'wipe', 'born', 'pissing', 'taken off', 'holed', 'off', 'out', 'flood', 'spamming',
                'buy', 'hacking', 'smelling', 'have', 'become', 'be', 'watching', 'Added'
            ],
            psFiles: ['i broke the json'],
            psPasta: ['i broke the json'],
            funnygifs: ['i broke the json'],
            poopPhrases: ['i broke the json'],
            dmPhrases: ['i broke the json']
        }

        // more functions!!1!!!!
        poopy.functions.lerp = function (start, end, amt) {
            return (1 - amt) * start + amt * end
        }

        poopy.functions.sleep = function (ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        poopy.functions.execPromise = function (code) {
            return new Promise((resolve) => {
                var args = code.match(/("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g)
                var command = args.splice(0, 1)[0]

                var stdout = []
                var stderr = []
                var stdoutclosed = false
                var stderrclosed = false
                var procExited = false

                var proc = poopy.modules.spawn(command, args, {
                    shell: true,
                    env: {
                        ...process.env
                    }
                })

                var memoryInterval = setInterval(() => {
                    var usage = process.memoryUsage()
                    var rss = usage.rss
                    if ((rss / 1024 / 1024) <= poopy.config.memLimit) proc.kill('SIGINT')
                }, 1000)

                function handleExit() {
                    if (!stdoutclosed || !stderrclosed || !procExited) return
                    var fproc = poopy.procs.findIndex(p => p === proc)
                    if (fproc > -1) poopy.procs.splice(fproc, 1)
                    var out = stdout.join('\n') || stderr.join('\n')
                    clearInterval(memoryInterval)
                    proc.removeAllListeners()
                    resolve(out)
                }

                proc.stdout.on('data', (buffer) => {
                    if (!buffer.toString()) return
                    stdout.push(buffer.toString())
                })

                proc.stderr.on('data', (buffer) => {
                    if (!buffer.toString()) return
                    stderr.push(buffer.toString())
                })

                proc.stdout.on('close', () => {
                    stdoutclosed = true
                    handleExit()
                })

                proc.stderr.on('close', () => {
                    stderrclosed = true
                    handleExit()
                })

                proc.on('error', (err) => {
                    clearInterval(memoryInterval)
                    proc.removeAllListeners()
                    resolve(err.message)
                })

                proc.on('exit', () => {
                    procExited = true
                    handleExit()
                })

                poopy.procs.push(proc)
            })
        }

        poopy.functions.getPsFiles = async function () {
            return new Promise((resolve, reject) => {
                poopy.modules.axios.get('https://raw.githubusercontent.com/raIeigh/ps-media-json/main/psfiles.json').then((res) => {
                    try {
                        resolve(res.data.data)
                    } catch (err) {
                        reject(err)
                    }
                })
            })
        }

        poopy.functions.getPsPasta = async function () {
            return new Promise((resolve, reject) => {
                poopy.modules.axios.get('https://raw.githubusercontent.com/raIeigh/ps-media-json/main/pspasta.json').then((res) => {
                    try {
                        resolve(res.data.data)
                    } catch (err) {
                        reject(err)
                    }
                })
            })
        }

        poopy.functions.getFunny = async function () {
            return new Promise((resolve, reject) => {
                poopy.modules.axios.get('https://raw.githubusercontent.com/raIeigh/ps-media-json/main/funnygif.json').then((res) => {
                    try {
                        resolve(res.data.data)
                    } catch (err) {
                        reject(err)
                    }
                })
            })
        }

        poopy.functions.gatherData = async function (msg) {
            var webhook = await msg.fetchWebhook().catch(() => { })

            if (!webhook) {
                if (!poopy.data['user-data'][msg.author.id]) {
                    poopy.data['user-data'][msg.author.id] = {}
                }

                poopy.data['user-data'][msg.author.id]['username'] = msg.author.username

                if (!poopy.data['user-data'][msg.author.id]['health']) {
                    poopy.data['user-data'][msg.author.id]['health'] = 100
                }
            }

            if (!poopy.data['guild-data'][msg.guild.id]) {
                poopy.data['guild-data'][msg.guild.id] = {}
            }

            if (poopy.data['guild-data'][msg.guild.id]['read'] === undefined) {
                poopy.data['guild-data'][msg.guild.id]['read'] = false
            }

            if (!poopy.data['guild-data'][msg.guild.id]['gettingData']) {
                poopy.data['guild-data'][msg.guild.id]['gettingData'] = 0
            }

            if (poopy.data['guild-data'][msg.guild.id]['chaincommands'] == undefined) {
                poopy.data['guild-data'][msg.guild.id]['chaincommands'] = true
            }

            if (poopy.data['guild-data'][msg.guild.id]['prefix'] === undefined) {
                poopy.data['guild-data'][msg.guild.id]['prefix'] = poopy.config.globalPrefix
            }

            if (!poopy.data['guild-data'][msg.guild.id]['channels']) {
                poopy.data['guild-data'][msg.guild.id]['channels'] = {}
            }

            if (!poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]) {
                poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id] = {}
            }

            if (!poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']) {
                poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = undefined
            }

            if (!poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2']) {
                poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = undefined
            }

            if (!poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls']) {
                poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = []
            }

            if (poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read'] === undefined) {
                poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read'] = false
            }

            if (!webhook) {
                if (!poopy.data['guild-data'][msg.guild.id]['members']) {
                    poopy.data['guild-data'][msg.guild.id]['members'] = {}
                }

                if (!poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]) {
                    poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id] = {}
                }

                if (!poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
                    poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
                }

                poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['username'] = msg.author.username
            }

            if (!poopy.data['guild-data'][msg.guild.id]['disabled']) {
                poopy.data['guild-data'][msg.guild.id]['disabled'] = []
            }

            if (!poopy.data['guild-data'][msg.guild.id]['localcmds']) {
                poopy.data['guild-data'][msg.guild.id]['localcmds'] = []
            }

            if (!poopy.data['guild-data'][msg.guild.id]['messages']) {
                poopy.data['guild-data'][msg.guild.id]['messages'] = []
            }

            if (!poopy.tempdata[msg.guild.id]) {
                poopy.tempdata[msg.guild.id] = {}
            }

            if (!poopy.tempdata[msg.guild.id][msg.channel.id]) {
                poopy.tempdata[msg.guild.id][msg.channel.id] = {}
            }

            if (!poopy.tempdata[msg.guild.id][msg.channel.id][msg.author.id]) {
                poopy.tempdata[msg.guild.id][msg.channel.id][msg.author.id] = {}
            }

            if (!poopy.tempdata[msg.guild.id][msg.author.id]) {
                poopy.tempdata[msg.guild.id][msg.author.id] = {}
            }

            if (!poopy.tempdata[msg.guild.id][msg.author.id]['promises']) {
                poopy.tempdata[msg.guild.id][msg.author.id]['promises'] = []
            }

            if (!poopy.tempdata[msg.author.id]) {
                poopy.tempdata[msg.author.id] = {}
            }

            if (!poopy.tempdata[msg.author.id]['keyattempts']) {
                poopy.tempdata[msg.author.id]['keyattempts'] = 0
            }

            if (!poopy.tempdata[msg.author.id]['arrays']) {
                poopy.tempdata[msg.author.id]['arrays'] = {}
            }

            if (!poopy.tempdata[msg.author.id]['declared']) {
                poopy.tempdata[msg.author.id]['declared'] = {}
            }

            if (!poopy.tempdata[msg.author.id]['promises']) {
                poopy.tempdata[msg.author.id]['promises'] = []
            }

            if (!poopy.tempdata[msg.author.id]['eggphrases']) {
                poopy.tempdata[msg.author.id]['eggphrases'] = {}
            }

            if (!poopy.tempdata[msg.author.id]['eggphrases']['lastmention']) {
                poopy.tempdata[msg.author.id]['eggphrases']['lastmention'] = 0
            }

            if (!poopy.tempdata[msg.author.id]['eggphrases']['phrase']) {
                poopy.tempdata[msg.author.id]['eggphrases']['phrase'] = 0
            }

            var lastDataGather = Date.now() - poopy.data['guild-data'][msg.guild.id]['gettingData']
            if (lastDataGather >= 600000) {
                async function gather() {
                    var cantFetch = false

                    for (var id in poopy.data['guild-data'][msg.guild.id]['members']) {
                        var member = poopy.data['guild-data'][msg.guild.id]['members'][id]
                        if (member.username === undefined) {
                            var user = await poopy.bot.users.fetch(id).catch(() => { })
                            if (!cantFetch) poopy.data['guild-data'][msg.guild.id]['gettingData'] = Date.now()
                            if (user) {
                                poopy.data['guild-data'][msg.guild.id]['members'][id]['username'] = user.username
                            } else {
                                delete poopy.data['guild-data'][msg.guild.id]['members'][id]
                            }
                        }
                    }
                }

                gather()
            }
        }

        poopy.vars.clevercontexts = []

        poopy.functions.cleverbot = async function (stim, id) {
            function encodeForSending(a) {
                var f = ""
                var d = ""
                a = a.replace(/[|]/g, "{*}")
                for (var b = 0; b <= a.length; b++) {
                    if (a.charCodeAt(b) > 255) {
                        d = escape(a.charAt(b))
                        if (d.substring(0, 2) == "%u") {
                            f += "|" + d.substring(2, d.length)
                        } else {
                            f += d
                        }
                    } else {
                        f += a.charAt(b)
                    }
                }
                f = f.replace("|201C", "'").replace("|201D", "'").replace("|2018", "'").replace("|2019", "'").replace("`", "'").replace("%B4", "'").replace("|FF20", "").replace("|FE6B", "")
                return escape(f)
            }

            var jar = process.env.CLEVERBOTCOOKIE
            var UA = process.env.CLEVERBOTUSERAGENT

            var context = id
            if (!Array.isArray(id)) {
                context = poopy.vars.clevercontexts[id] || (poopy.vars.clevercontexts[id] = [])
            }

            //if (!jar) jar = await fetch("https://www.cleverbot.com/", { headers: { "User-Agent": UA } }).then(a => a.headers.raw()['set-cookie'][0].split(";")[0])

            var payload = `stimulus=${encodeForSending(stim)}`
            if (context.length > 10) context.splice(0, context.length - 10)
            var l = context.length - 1
            for (var i = 0; i <= l; i++) {
                payload += `&vText${i + 2}=${encodeForSending(context[l - i])}`
            }
            payload += `&cb_settings_language=en&cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`
            payload += poopy.modules.md5(payload.substring(7, 33))
            var res = await poopy.modules.axios.request({
                method: "POST", url: "https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI&ncf=V2&", data: payload, headers: {
                    "Content-Type": "text/plain",
                    Cookie: jar,
                    "User-Agent": UA
                }
            })
                .then(a => a.data.split("\r")[0])
                .catch(() => '')
            if (id != undefined) context.push(stim)
            if (id != undefined) context.push(res)
            return res

            /*var options = {
                method: 'GET',
                url: 'https://random-stuff-api.p.rapidapi.com/ai',
                params: {
                    msg: stim,
                    bot_name: poopy.bot.user.username,
                    bot_gender: 'male',
                    bot_master: 'raleigh',
                    bot_age: '19',
                    bot_company: 'poopy\'s lounge',
                    bot_location: 'Nigeria',
                    bot_email: 'poopystinkystinky@gmail.com',
                    bot_build: 'private',
                    bot_birth_year: '2002',
                    bot_birth_date: '10th September, 2002',
                    bot_birth_place: 'Nigeria',
                    bot_favorite_color: 'yellow',
                    bot_favorite_book: 'Diary of a Wimpy Kid',
                    bot_favorite_band: 'Radiohead',
                    bot_favorite_artist: 'Kanye West',
                    bot_favorite_actress: 'your mom',
                    bot_favorite_actor: 'Joe Biden',
                    id: id
                },
                headers: {
                    authorization: process.env.GAMERKEY,
                    'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
                    'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
                }
            }

            var res = await poopy.modules.axios.request(options).catch(() => { }) ?? { data: { AIResponse: '' } }

            return res.data.AIResponse*/
        }

        poopy.functions.infoPost = async function (message) {
            if (poopy.config.stfu) return

            var avatar = poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
            var color = await poopy.functions.averageColor(avatar)
            await poopy.functions.waitMessageCooldown(true)

            var infoMsg
            if (poopy.config.textEmbeds) infoMsg = await poopy.bot.guilds.cache.get('834431435704107018')?.channels.cache.get('967083645619830834')?.send({
                content: message,
                allowedMentions: {
                    parse: ['users']
                }
            }).catch(() => { })
            else infoMsg = await poopy.bot.guilds.cache.get('834431435704107018')?.channels.cache.get('967083645619830834')?.send({
                embeds: [{
                    description: message,
                    author: {
                        name: poopy.bot.user.username,
                        icon_url: avatar,
                    },
                    color: (color.r << 8 << 8) + (color.g << 8) + (color.b)
                }]
            }).catch(() => { })

            if (infoMsg) {
                poopy.vars.msgcooldown = true
                setTimeout(() => poopy.vars.msgcooldown = false, poopy.config.msgcooldown)
            }
        }

        poopy.functions.regexClean = function (str) {
            return str.replace(/[\\^$.|?*+()[{]/g, (match) => `\\${match}`)
        }

        poopy.functions.matchLongestKey = function (str, keys) {
            if (keys.length <= 0) return ['']
            var longest = ['']
            var matched = false
            for (var i in keys) {
                var match = str.match(new RegExp(`^${poopy.functions.regexClean(keys[i])}`))
                if (match && match[0].length >= longest[0].length) {
                    matched = true
                    longest = match
                }
            }
            return matched && longest
        }

        poopy.functions.matchLongestFunc = function (str, funcs) {
            if (funcs.length <= 0) return ['']
            var longest = ['']
            var matched = false
            for (var i in funcs) {
                var match = str.match(new RegExp(`${poopy.functions.regexClean(funcs[i])}$`))
                if (match && match[0].length >= longest[0].length) {
                    matched = true
                    longest = match
                }
            }
            return matched && longest
        }

        poopy.functions.getKeyFunc = function (string, { extrakeys = {}, extrafuncs = {} } = {}) {
            var lastParenthesesIndex = -1
            var llastParenthesesIndex = -1
            var rawParenthesesIndex = -1
            var rawrequired = 0
            var keyindex = -1
            var parindex = -1
            var parenthesesGoal = []
            var potentialindexes = []
            var rawMatch

            var keylist = poopy.specialkeys.keys
            var funclist = poopy.specialkeys.functions
            var pfunclist = []

            for (var k in keylist) {
                if (keylist[k].potential) {
                    if (keylist[k].potential.funcs) {
                        for (var ff in keylist[k].potential.funcs) {
                            pfunclist[ff] = keylist[k].potential.funcs[ff]
                        }
                    }
                }
            }
            for (var k in extrakeys) keylist[k] = extrakeys[k]

            for (var f in funclist) {
                if (funclist[f].potential) {
                    if (funclist[f].potential.funcs) {
                        for (var ff in funclist[f].potential.funcs) {
                            pfunclist[ff] = funclist[f].potential.funcs[ff]
                        }
                    }
                }
            }
            for (var f in extrafuncs) funclist[f] = extrafuncs[f]

            var keys = Object.keys(keylist).sort((a, b) => b.length - a.length)
            var funcs = Object.keys(funclist).sort((a, b) => b.length - a.length)
            var pfuncs = Object.keys(pfunclist).sort((a, b) => b.length - a.length)

            for (var i in string) {
                var char = string[i]

                switch (char) {
                    case '(':
                        var funcmatch = poopy.functions.matchLongestFunc(string.substring(0, i), funcs)
                        var pfuncmatch = poopy.functions.matchLongestFunc(string.substring(0, i), parenthesesGoal.length <= 0 ? pfuncs : [''])

                        if (funcmatch) {
                            parindex++
                            lastParenthesesIndex = i
                            if (!rawMatch) {
                                var func = funclist[funcmatch[0].toLowerCase()]
                                if (func) {
                                    if (func.raw) {
                                        rawParenthesesIndex = i
                                        rawrequired++
                                        rawMatch = funcmatch[0].toLowerCase()
                                    }
                                    if (func.parentheses) {
                                        parenthesesGoal.push(parindex - 1)
                                    }
                                }
                            } else {
                                rawrequired++
                            }
                        } else if (pfuncmatch || pfuncmatch == '') {
                            parindex++
                            potentialindexes.push(parindex)
                        }
                        break

                    case ')':
                        var funcmatch = poopy.functions.matchLongestFunc(string.substring(0, lastParenthesesIndex), funcs)

                        if (funcmatch && string[i - 1] !== '\\') {
                            if (parenthesesGoal.find(pgoal => parindex == pgoal)) {
                                parenthesesGoal.splice(parenthesesGoal.findIndex(pgoal => parindex == pgoal), 1)
                            }
                            if (potentialindexes.find(ind => ind === parindex)) {
                                potentialindexes.splice(potentialindexes.findIndex(ind => ind === parindex), 1)
                            } else {
                                if (!rawMatch) {
                                    lastParenthesesIndex++
                                    return {
                                        match: [funcmatch[0].toLowerCase(), string.substring(lastParenthesesIndex, i)],
                                        type: 'func'
                                    }
                                } else {
                                    rawrequired--
                                    llastParenthesesIndex = i
                                    if (rawrequired <= 0) {
                                        rawParenthesesIndex++
                                        return {
                                            match: [rawMatch, string.substring(rawParenthesesIndex, i)],
                                            type: 'func'
                                        }
                                    }
                                }
                            }
                            parindex--
                        }
                        break
                }

                var keymatch = poopy.functions.matchLongestKey(string.substring(i), keys)
                if (keymatch) {
                    keyindex = i
                    if (rawrequired <= 0) return {
                        match: keymatch[0].toLowerCase(),
                        type: 'key'
                    }
                }
            }

            if (llastParenthesesIndex > -1) {
                var funcmatch = poopy.functions.matchLongestFunc(string.substring(0, lastParenthesesIndex), funcs)

                lastParenthesesIndex++
                return {
                    match: [funcmatch[0].toLowerCase(), string.substring(lastParenthesesIndex, llastParenthesesIndex)],
                    type: 'func'
                }
            }

            if (keyindex > -1) {
                var keymatch = poopy.functions.matchLongestKey(string.substring(keyindex), keys)

                return {
                    match: keymatch[0].toLowerCase(),
                    type: 'key'
                }
            }

            return false
        }

        poopy.functions.splitKeyFunc = function (string, { extrafuncs = {}, args = Infinity, separator = '|' } = {}) {
            var isDefaultSeparator = separator == '|'
            var lastParenthesesIndex = -1
            var lastSplitIndex = 0
            var parenthesesrequired = 0
            var parenthesesGoal = []
            var barfound = 0
            var split = []

            var funclist = poopy.specialkeys.functions
            var pfunclist = []

            for (var f in funclist) {
                if (funclist[f].potential) {
                    if (funclist[f].potential.funcs) {
                        for (var ff in funclist[f].potential.funcs) {
                            pfunclist[ff] = funclist[f].potential.funcs[ff]
                        }
                    }
                }
            }
            for (var f in extrafuncs) funclist[f] = extrafuncs[f]

            var funcs = Object.keys(funclist).sort((a, b) => b.length - a.length)
            var pfuncs = Object.keys(pfunclist).sort((a, b) => b.length - a.length)
            var afuncs = funcs.concat(pfuncs).sort((a, b) => b.length - a.length)

            for (var i in string) {
                var char = string[i]
                i = Number(i)

                switch (char) {
                    case '(':
                        var funcmatch = poopy.functions.matchLongestFunc(string.substring(0, i), parenthesesGoal.length <= 0 ? afuncs : [''])
                        if (funcmatch) {
                            lastParenthesesIndex = i
                            parenthesesrequired++
                            var func = funclist[funcmatch[0].toLowerCase()]
                            if (func) {
                                if (func.parentheses) {
                                    parenthesesGoal.push(parenthesesrequired - 1)
                                }
                            }
                        }
                        break

                    case separator:
                        if (parenthesesrequired <= 0 && string[i - 1] !== '\\') {
                            split.push(string.substring(lastSplitIndex, i - ((string[i - 1] === ' ' && isDefaultSeparator) ? 1 : 0)))
                            lastSplitIndex = i + ((string[i + 1] === ' ' && isDefaultSeparator) ? 2 : 1)
                            barfound++
                        }
                        break

                    case ')':
                        var funcmatch = poopy.functions.matchLongestFunc(string.substring(0, lastParenthesesIndex), parenthesesGoal.length <= 0 ? afuncs : [''])
                        if (funcmatch && string[i - 1] !== '\\') {
                            if (parenthesesGoal.find(pgoal => parenthesesrequired == pgoal)) {
                                parenthesesGoal.splice(parenthesesGoal.findIndex(pgoal => parenthesesrequired == pgoal), 1)
                            }
                            parenthesesrequired--
                        }
                        break
                }

                if (barfound == args - 1) {
                    break
                }
            }

            split.push(string.substring(lastSplitIndex))

            return split.map(val => isDefaultSeparator ? val.replace(/\\\|/, '|') : val)
        }

        poopy.functions.getIndexOption = function (args, i, { dft = undefined, n = 1 } = {}) {
            return args.slice(i, i + n) || dft
        }

        poopy.functions.getOption = function (args, name, { dft = undefined, n = 1, splice = false, join = false, func = (opt) => opt } = {}) {
            var optionindex = args.indexOf(`-${name}`)
            if (optionindex > -1) {
                var option = []
                for (var i = 1; i <= n; i++) {
                    option.push(func(args[optionindex + i], i))
                }
                if (splice) args.splice(optionindex, n + 1)
                if (join) option = option.join(' ')
                return n == 0 ? true : option
            }
            return dft
        }

        poopy.functions.parseNumber = function (str, { dft = undefined, min = -Infinity, max = Infinity, round = false } = {}) {
            if (str === undefined || str === '') return dft
            var number = Number(str)
            return isNaN(number) ? dft : (round ? Math.round(Math.max(Math.min(number, max), min)) : Math.max(Math.min(number, max), min)) ?? dft
        }

        poopy.functions.parseString = function (str, validList, { dft = undefined, lower = false, upper = false } = {}) {
            if (str == undefined || str === '') return dft
            var query = upper ? str.toUpperCase() : lower ? str.toLowerCase() : str
            return validList.find(q => q == query) || dft
        }

        poopy.functions.yesno = async function (channel, content, who) {
            return new Promise(async (resolve) => {
                if (poopy.config.forcetrue) resolve(true)

                var sendObject = {
                    content: content
                }

                if (typeof (who) != 'string') {
                    sendObject.allowedMentions = {
                        parse: (!who.permissions.has('ADMINISTRATOR') &&
                            !who.permissions.has('MENTION_EVERYONE') &&
                            who.id !== channel.guild.ownerID) ?
                            ['users'] : ['users', 'everyone', 'roles']
                    }
                    who = who.id
                }

                var buttonsData = [
                    {
                        emoji: '874406154619469864',
                        reactemoji: '✅',
                        customid: 'yes',
                        style: 'SUCCESS',
                        resolve: true
                    },

                    {
                        emoji: '874406183933444156',
                        reactemoji: '❌',
                        customid: 'no',
                        style: 'DANGER',
                        resolve: false
                    }
                ]

                if (!poopy.config.useReactions) {
                    var buttonRow = new poopy.modules.Discord.MessageActionRow()
                    var buttons = []

                    buttonsData.forEach(bdata => {
                        var button = new poopy.modules.Discord.MessageButton()
                            .setStyle(bdata.style)
                            .setEmoji(bdata.emoji)
                            .setCustomId(bdata.customid)

                        buttons.push(button)
                    })

                    buttonRow.addComponents(buttons)

                    sendObject.components = [buttonRow]
                }

                await poopy.functions.waitMessageCooldown()
                var yesnoMsg = await channel.send(sendObject).catch(() => { })

                if (!yesnoMsg) {
                    resolve(false)
                    return
                }

                if (poopy.config.useReactions) {
                    var collector = yesnoMsg.createReactionCollector({ time: 60_000 })

                    collector.on('collect', (reaction, user) => {
                        if (!(user.id === who && ((user.id !== poopy.bot.user.id && !user.bot) || poopy.config.allowbotusage))) {
                            return
                        }

                        var buttonData = buttonsData.find(bdata => bdata.reactemoji == reaction.emoji.name)

                        if (buttonData) {
                            collector.stop()
                            resolve(buttonData.resolve)
                        }
                    })

                    collector.on('end', (_, reason) => {
                        if (reason == 'time') {
                            yesnoMsg.edit({
                                content: 'No response.'
                            }).catch(() => { })
                            yesnoMsg.reactions.removeAll().catch(() => { })
                        } else {
                            yesnoMsg.delete().catch(() => { })
                        }
                    })

                    for (var i in buttonsData) {
                        var bdata = buttonsData[i]
                        await yesnoMsg.react(bdata.reactemoji).catch(() => { })
                    }
                } else {
                    var collector = yesnoMsg.createMessageComponentCollector({ time: 60_000 })

                    collector.on('collect', (button) => {
                        button.deferUpdate().catch(() => { })

                        if (!(button.user.id === who && ((button.user.id !== poopy.bot.user.id && !button.user.bot) || poopy.config.allowbotusage))) {
                            return
                        }

                        var buttonData = buttonsData.find(bdata => bdata.customid == button.customId)

                        if (buttonData) {
                            collector.stop()
                            resolve(buttonData.resolve)
                        }
                    })

                    collector.on('end', (_, reason) => {
                        if (reason == 'time') {
                            yesnoMsg.edit({
                                content: 'No response.',
                                components: []
                            }).catch(() => { })
                        } else {
                            yesnoMsg.delete().catch(() => { })
                        }
                    })
                }
            })
        }

        poopy.functions.navigateEmbed = async function (channel, pageFunc, results, who, extraButtons, page, selectMenu, errOnFail, endFunc) {
            page = page ?? 1

            var buttonsData = [
                {
                    emoji: '861253229726793728',
                    reactemoji: '⬅️',
                    customid: 'previous',
                    style: 'PRIMARY',
                    function: async () => page - 1,
                    page: true
                },

                {
                    emoji: '861253230070988860',
                    reactemoji: '🔀',
                    customid: 'random',
                    style: 'PRIMARY',
                    function: async () => Math.floor(Math.random() * results) + 1,
                    page: true
                },

                {
                    emoji: '861253229798621205',
                    reactemoji: '➡️',
                    customid: 'next',
                    style: 'PRIMARY',
                    function: async () => page + 1,
                    page: true
                },

                {
                    emoji: '970292877785727036',
                    reactemoji: '🔢',
                    customid: 'page',
                    style: 'PRIMARY',
                    function: async (_, interaction) => new Promise(async resolve => {
                        var newpage = page

                        if (poopy.config.useReactions) {
                            var goMessage = await channel.send('Which page would you like to go...?').catch(() => { })

                            var pageCollector = channel.createMessageCollector({ time: 30000 })

                            pageCollector.on('collect', (msg) => {
                                if (!(msg.author.id === who && ((msg.author.id !== poopy.bot.user.id && !msg.author.bot) || poopy.config.allowbotusage))) {
                                    return
                                }

                                newpage = poopy.functions.parseNumber(msg.content, { dft: page, min: 1, max: results, round: true })
                                pageCollector.stop()
                                msg.delete().catch(() => { })
                            })

                            pageCollector.on('end', () => {
                                if (goMessage) goMessage.delete().catch(() => { })
                                resolve(newpage)
                            })
                        } else {
                            var pageModal = new poopy.modules.discordModals.Modal()
                                .setCustomId('page-modal')
                                .setTitle('Select your page...')
                                .addComponents(
                                    new poopy.modules.discordModals.TextInputComponent()
                                        .setCustomId('page-num')
                                        .setLabel('Page')
                                        .setStyle('SHORT')
                                        .setMinLength(1)
                                        .setMaxLength(String(results).length)
                                        .setPlaceholder(`1-${results}`)
                                        .setRequired(true)
                                )

                            poopy.modules.discordModals.showModal(pageModal, {
                                client: poopy.bot,
                                interaction: interaction
                            }).then(() => {
                                var done = false

                                var modalCallback = (modal) => {
                                    if (modal.deferUpdate) modal.deferUpdate().catch(() => { })

                                    if (!(modal.user.id === who && ((modal.user.id !== poopy.bot.user.id && !modal.user.bot) || poopy.config.allowbotusage)) || done) {
                                        return
                                    }

                                    done = true
                                    newpage = poopy.functions.parseNumber(modal.getTextInputValue('page-num'), { dft: page, min: 1, max: results, round: true })
                                    clearTimeout(modalTimeout)
                                    resolve(newpage)
                                }

                                var modalTimeout = setTimeout(() => {
                                    if (!done) {
                                        done = true
                                        poopy.bot.removeListener('modalSubmit', modalCallback)
                                        resolve(newpage)
                                    }
                                }, 30000)

                                poopy.bot.once('modalSubmit', modalCallback)
                            }).catch(() => resolve(newpage))
                        }
                    }),
                    page: true
                }
            ].concat(extraButtons || [])

            var components = []

            if (!poopy.config.useReactions) {
                var chunkButtonData = poopy.functions.chunkArray(buttonsData, 5)

                chunkButtonData.forEach(buttonsData => {
                    var buttonRow = new poopy.modules.Discord.MessageActionRow()
                    var buttons = []

                    buttonsData.forEach(bdata => {
                        var button = new poopy.modules.Discord.MessageButton()
                            .setStyle(bdata.style)
                            .setEmoji(bdata.emoji)
                            .setCustomId(bdata.customid)

                        buttons.push(button)
                    })

                    buttonRow.addComponents(buttons)

                    components.push(buttonRow)
                })
            }

            var resultEmbed = await pageFunc(page)
            var sendObject = {
                components: components.slice()
            }
            var allowedMentions

            if (selectMenu) {
                var menuRow = new poopy.modules.Discord.MessageActionRow()
                var menu = new poopy.modules.Discord.MessageSelectMenu()
                    .setCustomId(selectMenu.customid)
                    .setPlaceholder(selectMenu.text)
                    .addOptions(selectMenu.options)

                menuRow.addComponents([menu])

                buttonsData.push(selectMenu)
                sendObject.components.push(menuRow)
            }

            if (typeof (who) != 'string') {
                allowedMentions = {
                    parse: (!who.permissions.has('ADMINISTRATOR') &&
                        !who.permissions.has('MENTION_EVERYONE') &&
                        who.id !== channel.guild.ownerID) ?
                        ['users'] : ['users', 'everyone', 'roles']
                }
                sendObject.allowedMentions = allowedMentions
                who = who.id
            }

            if (poopy.config.textEmbeds) sendObject.content = resultEmbed
            else sendObject.embeds = [resultEmbed]

            await poopy.functions.waitMessageCooldown()
            var resultsMsg = await channel.send(sendObject).catch(() => { })

            if (!resultsMsg) {
                if (errOnFail) throw new Error(`Couldn't send navigable embed to channel`)
                else return
            }

            var usingButton = false

            if (poopy.config.useReactions) {
                var collector = resultsMsg.createReactionCollector({ time: 60_000 })

                collector.on('collect', async (reaction, user) => {
                    if (!(user.id === who && ((user.id !== poopy.bot.user.id && !user.bot) || poopy.config.allowbotusage)) || usingButton) {
                        return
                    }

                    var buttonData = buttonsData.find(bdata => bdata.reactemoji == reaction.emoji.name)

                    if (buttonData) {
                        usingButton = true
                        collector.resetTimer()

                        var newpage = await buttonData.function(page, reaction, resultsMsg, collector)
                        reaction.users.remove(user).catch(() => { })

                        if (buttonData.page) {
                            if (newpage < 1 || newpage > results || newpage == page) {
                                usingButton = false
                                return
                            }

                            page = newpage

                            var resultEmbed = await pageFunc(page)
                            var sendObject = {
                                components: components.slice()
                            }

                            if (allowedMentions) sendObject.allowedMentions = allowedMentions

                            if (poopy.config.textEmbeds) sendObject.content = resultEmbed
                            else sendObject.embeds = [resultEmbed]

                            resultsMsg.edit(sendObject).catch(() => { })
                        }
                        usingButton = false
                    }
                })

                collector.on('end', async (_, reason) => {
                    resultsMsg.reactions.removeAll().catch(() => { })
                    if (endFunc) endFunc(reason)
                })

                for (var i in buttonsData) {
                    var bdata = buttonsData[i]
                    await resultsMsg.react(bdata.reactemoji).catch(() => { })
                }
            } else {
                var collector = resultsMsg.createMessageComponentCollector({ time: 60_000 })

                collector.on('collect', async (button) => {
                    if (!(button.user.id === who && ((button.user.id !== poopy.bot.user.id && !button.user.bot) || poopy.config.allowbotusage)) || usingButton) {
                        button.deferUpdate().catch(() => { })
                        return
                    }

                    var buttonData = buttonsData.find(bdata => bdata.customid == button.customId)

                    if (buttonData) {
                        usingButton = true
                        collector.resetTimer()

                        var newpage = await buttonData.function(page, button, resultsMsg, collector)
                        button.deferUpdate().catch(() => { })

                        if (buttonData.page) {
                            if (newpage < 1 || newpage > results || newpage == page) {
                                usingButton = false
                                return
                            }

                            page = newpage

                            var resultEmbed = await pageFunc(page)
                            var sendObject = {
                                components: components.slice()
                            }

                            if (selectMenu) {
                                var menuRow = new poopy.modules.Discord.MessageActionRow()
                                var menu = new poopy.modules.Discord.MessageSelectMenu()
                                    .setCustomId(selectMenu.customid)
                                    .setPlaceholder(resultEmbed.menuText || selectMenu.text)
                                    .addOptions(selectMenu.options)

                                menuRow.addComponents([menu])

                                sendObject.components.push(menuRow)

                                if (resultEmbed.menuText) delete resultEmbed.menuText
                            }

                            if (allowedMentions) sendObject.allowedMentions = allowedMentions

                            if (poopy.config.textEmbeds) sendObject.content = resultEmbed
                            else sendObject.embeds = [resultEmbed]

                            resultsMsg.edit(sendObject).catch(() => { })
                        }
                        usingButton = false
                    }
                })

                collector.on('end', async (_, reason) => {
                    var resultEmbed = await pageFunc(page)
                    var sendObject = {
                        components: []
                    }

                    if (allowedMentions) sendObject.allowedMentions = allowedMentions

                    if (poopy.config.textEmbeds) sendObject.content = resultEmbed
                    else sendObject.embeds = [resultEmbed]

                    resultsMsg.edit(sendObject).catch(() => { })

                    if (endFunc) endFunc(reason)
                })
            }
        }

        /*poopy.functions.waitForChromeSessionEnd = async function (msg) {
            return new Promise(async resolve => {
                var waitMessage
                setTimeout(async () => {
                    if (waitMessage) {
                        if (chromeWindow) {
                            await chromeWindow.quit().catch(() => { })
                        }
                        resolve()
                    }
                }, 60000 * 3)
                while (chromeWindow) {
                    if (!waitMessage) waitMessage = await msg.channel.send('A Chrome session is currently occurring, and I can\'t have more than one or I malfunction, so you\'ll have to wait for it to end. If it takes more than 3 minutes for a Chrome session to be available, I\'ll just close it.').catch(() => { })
                    await poopy.functions.sleep(1000)
                }
                if (waitMessage) await waitMessage.delete().catch(() => { })
                resolve()
            })
        }*/

        poopy.functions.similarity = function (s1, s2) {
            function editDistance(s1, s2) {
                s1 = s1.toLowerCase()
                s2 = s2.toLowerCase()

                var costs = new Array()
                for (var i = 0; i <= s1.length; i++) {
                    var lastValue = i
                    for (var j = 0; j <= s2.length; j++) {
                        if (i == 0)
                            costs[j] = j
                        else {
                            if (j > 0) {
                                var newValue = costs[j - 1]
                                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                                    newValue = Math.min(Math.min(newValue, lastValue),
                                        costs[j]) + 1
                                costs[j - 1] = lastValue
                                lastValue = newValue
                            }
                        }
                    }
                    if (i > 0)
                        costs[s2.length] = lastValue
                }
                return costs[s2.length]
            }

            var longer = s1
            var shorter = s2
            if (s1.length < s2.length) {
                longer = s2
                shorter = s1
            }
            var longerLength = longer.length
            if (longerLength == 0) {
                return 1.0
            }
            return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
        }

        poopy.functions.chunkArray = function (myArray, chunk_size) {
            var index = 0
            var arrayLength = myArray.length
            var tempArray = []

            for (index = 0; index < arrayLength; index += chunk_size) {
                var myChunk = myArray.slice(index, index + chunk_size)
                tempArray.push(myChunk)
            }

            return tempArray;
        }

        poopy.functions.chunkObject = function (object, chunk_size) {
            var values = Object.values(object)
            var final = []
            var counter = 0
            var portion = {}

            for (var key in object) {
                if (counter !== 0 && counter % chunk_size === 0) {
                    final.push(portion)
                    portion = {}
                }
                portion[key] = values[counter]
                counter++
            }
            final.push(portion)

            return final
        }

        poopy.functions.generateId = function (unique) {
            var charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
            var length = 10
            var id = ''

            for (var i = 0; i < length; i++) {
                id += charset[Math.floor(Math.random() * charset.length)]
            }

            if (unique) {
                var cmdTemplates = poopy.functions.globalData()['bot-data']['commandTemplates']

                if (cmdTemplates.length ? cmdTemplates.find(cmd => cmd.id === id) : false) {
                    return poopy.functions.generateId(unique)
                }
            }

            return id
        }

        poopy.functions.replaceAsync = async function (str, regex, asyncFn) {
            var promises = []
            str.replace(regex, (match, ...args) => {
                var promise = asyncFn(match, ...args)
                promises.push(promise)
            })
            var data = await Promise.all(promises)
            return str.replace(regex, () => data.shift())
        }

        poopy.functions.findAsync = async function (arr, asyncCallback) {
            var promises = arr.map(asyncCallback)
            var results = await Promise.all(promises)
            var index = results.findIndex(result => result)
            return arr[index]
        }

        poopy.functions.findIndexAsync = async function (arr, asyncCallback) {
            var promises = arr.map(asyncCallback)
            var results = await Promise.all(promises)
            var index = results.findIndex(result => result)
            return index
        }

        poopy.functions.markovChainGenerator = function (text) {
            var textArr = text.split(' ')
            var markovChain = []
            markovChain.findChain = function (w) {
                return this.find(chain => chain.word === w)
            }
            markovChain.random = function () {
                return this[Math.floor(Math.random() * this.length)]
            }
            for (var i = 0; i < textArr.length; i++) {
                var word = textArr[i]
                if (word) {
                    if (!markovChain.findChain(word.toLowerCase())) {
                        markovChain.push({
                            word: word.toLowerCase(),
                            forms: [],
                            next: [],
                            repeated: 0
                        })
                    }
                    markovChain.findChain(word.toLowerCase()).forms.push(word)
                    markovChain.findChain(word.toLowerCase()).repeated++
                    if (textArr[i + 1]) {
                        markovChain.findChain(word.toLowerCase()).next.push(textArr[i + 1]);
                    }
                }
            }
            markovChain.sort((a, b) => {
                return b.repeated - a.repeated
            })
            return markovChain
        }

        poopy.functions.markovMe = function (markovChain, text = '', options = {}) {
            var words = markovChain.map(chain => chain.word)

            if (words.length <= 0) return 'no markov data for guild, arabotto 2020'

            var wordNumber = options.wordNumber
            var nopunctuation = options.nopunctuation
            var keepcase = options.keepcase
            var randlerp = options.randomlerp ?? 0.4

            var result = text ? text.split(' ') : []
            var chain = markovChain.random()
            var word = result[result.length - 1] || chain.forms[Math.floor(Math.random() * chain.forms.length)]
            result.splice(result.length - 1)
            var maxrepeat = markovChain[0].repeated
            var randomchance = 0
            for (var i = 0; i < (wordNumber || Math.min(words.length, Math.floor(Math.random() * 20) + 1)); i++) {
                result.push(word);
                if (poopy.vars.validUrl.test(word) && !wordNumber) break
                var markov = markovChain.findChain(word.toLowerCase())
                var newWord = markov.next[Math.floor(Math.random() * markov.next.length)]
                word = newWord
                randomchance = poopy.functions.lerp(randomchance, maxrepeat, randlerp)
                if (!word || !markovChain.findChain(word.toLowerCase()) || Math.floor(Math.random() * randomchance) >= maxrepeat * 0.5) {
                    randomchance = 0
                    chain = markovChain.random()
                    word = chain.forms[Math.floor(Math.random() * chain.forms.length)]
                }
            }
            result = result.join(' ')
            if (!poopy.vars.punctuation.find(p => result.match(new RegExp(`[${p}]$`))) && Math.floor(Math.random() * 5) === 0 && !nopunctuation) {
                result += poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]
            }
            if (Math.floor(Math.random() * 5) === 0 && !keepcase) {
                result = poopy.vars.caseModifiers[Math.floor(Math.random() * poopy.vars.caseModifiers.length)](result)
            }
            return result
        }

        poopy.functions.findpreset = function (args) {
            var presets = [
                'ultrafast',
                'superfast',
                'veryfast',
                'faster',
                'fast',
                'medium',
                'slow',
                'slower',
                'veryslow'
            ]
            var preset = 'ultrafast'
            var presetindex = args.indexOf('-encodingpreset')
            if (presetindex > -1) {
                if (presets.find(preset => preset === args[presetindex + 1].toLowerCase())) {
                    preset = args[presetindex + 1]
                }
            }
            return preset
        }

        poopy.functions.randomKey = function (name) {
            var i = 1
            var keys = []
            while (process.env[name + (i != 1 ? i : '')]) {
                keys.push(process.env[name + (i != 1 ? i : '')])
                i++
            }
            return keys[Math.floor(Math.random() * keys.length)]
        }

        poopy.functions.correctUrl = async function (url) {
            if (url.match(/^https\:\/\/(www\.)?tenor\.com\/view/) && url.match(/\d+/g)) {
                var ids = url.match(/\d+/g)
                var body = await poopy.modules.axios.request(`https://g.tenor.com/v1/gifs?ids=${ids[ids.length - 1]}&key=${process.env.TENORKEY}`).catch(() => { })
                if (body && body.data.results.length) {
                    poopy.functions.infoPost(`Tenor URL detected`)
                    return body.data.results[0].media[0].gif.url
                }
            } else if (url.match(/^https\:\/\/(www\.)?gyazo\.com/)) {
                var gifurl = url.replace(/^https\:\/\/(www\.)?gyazo\.com/, 'https://i.gyazo.com') + '.gif'
                var mp4url = url.replace(/^https\:\/\/(www\.)?gyazo\.com/, 'https://i.gyazo.com') + '.mp4'
                var pngurl = url.replace(/^https\:\/\/(www\.)?gyazo\.com/, 'https://i.gyazo.com') + '.png'
                var gyazourls = [gifurl, mp4url, pngurl]
                var gyazourl = undefined
                for (var i in gyazourls) {
                    var url = gyazourls[i]
                    var response = await poopy.modules.axios.request({
                        url: url,
                        validateStatus: () => true
                    }).catch(() => { })
                    if (response && response.status >= 200 && response.status < 300) {
                        gyazourl = url
                        break
                    }
                }
                if (gyazourl) {
                    poopy.functions.infoPost(`Gyazo URL detected`)
                    return gyazourl
                }
            } else if (url.match(/^https\:\/\/(www\.)?imgur\.com/)) {
                var mp4url = url.replace(/^https\:\/\/(www\.)?imgur\.com/, 'https://i.imgur.com') + '.mp4'
                var pngurl = url.replace(/^https\:\/\/(www\.)?imgur\.com/, 'https://i.imgur.com') + '.png'
                var imgurls = [mp4url, pngurl]
                var imgurl = undefined
                for (var i in imgurls) {
                    var url = imgurls[i]
                    var response = await poopy.modules.axios.request({
                        url: url,
                        validateStatus: () => true
                    }).catch(() => { })
                    if (response && response.status >= 200 && response.status < 300) {
                        imgurl = url
                        break
                    }
                }
                if (imgurl) {
                    poopy.functions.infoPost(`Imgur URL detected`)
                    return imgurl
                }
            } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(catalog|library|games)\//)) {
                async function getAudio(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.get(`https://www.roblox.com/library/${id}`).then(async (res) => {
                            var $ = poopy.modules.cheerio.load(res.data)
                            var urls = $("#AssetThumbnail .MediaPlayerIcon")

                            if (urls.length > 0) {
                                resolve(urls[0].attribs['data-mediathumb-url'])
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                async function getTexture(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://assetdelivery.roblox.com/v1/assetId/${id}`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data
                            var rbxmurl = body.location

                            if (!rbxmurl) {
                                resolve()
                                return
                            }

                            poopy.modules.axios.request(rbxmurl).then((rres) => {
                                var rbody = rres.data

                                var $ = poopy.modules.cheerio.load(rbody)
                                var urls = $("url")
                                if (urls.length > 0) {
                                    var imageasseturl = urls[0].children[0].data
                                    var ids = imageasseturl.match(/\d+/g)
                                    var id = ids[0]

                                    poopy.modules.axios.request({
                                        method: 'GET',
                                        url: `https://assetdelivery.roblox.com/v1/assetId/${id}`,
                                        headers: {
                                            "Accept": "application/json"
                                        }
                                    }).then((ires) => {
                                        var ibody = ires.data
                                        var textureurl = ibody.location

                                        if (!textureurl) {
                                            resolve()
                                            return
                                        }

                                        resolve(textureurl)
                                    }).catch(() => resolve())
                                    return
                                }

                                resolve()
                            }).catch(() => resolve())
                        }).catch(() => resolve())
                    })
                }

                async function getGame(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${id}&size=512x512&format=Png&isCircular=false`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data

                            if (body.data ? body.data.length > 0 : false) {
                                if (body.data[0].state === 'Pending') {
                                    var url = await getGame(id).catch(() => { })
                                    resolve(url)
                                    return
                                }

                                resolve(body.data[0].imageUrl)
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                async function getThumb(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://thumbnails.roblox.com/v1/assets?assetIds=${id}&size=700x700&format=Png&isCircular=false`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data

                            if (body.data ? body.data.length > 0 : false) {
                                if (body.data[0].state === 'Pending') {
                                    var url = await getThumb(id).catch(() => { })
                                    resolve(url)
                                    return
                                }

                                resolve(body.data[0].imageUrl)
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                async function getAsset(id) {
                    var info = await poopy.modules.noblox.getProductInfo(id).catch(() => { })

                    if (info) {
                        if (info.AssetTypeId === 3) {
                            var audiourl = await getAudio(id).catch(() => { })

                            if (audiourl) {
                                poopy.functions.infoPost(`Roblox audio URL detected`)
                                return audiourl
                            }
                        } else if (info.AssetTypeId === 2 || info.AssetTypeId === 11 || info.AssetTypeId === 12 || info.AssetTypeId === 13) {
                            var imageurl = await getTexture(id).catch(() => { })

                            if (imageurl) {
                                poopy.functions.infoPost(`Roblox image asset URL detected`)
                                return imageurl
                            }
                        } else if (info.AssetTypeId === 9) {
                            var gameurl = await getGame(id).catch(() => { })

                            if (gameurl) {
                                poopy.functions.infoPost(`Roblox game icon URL detected`)
                                return gameurl
                            }
                        } else {
                            var asseturl = await getThumb(id).catch(() => { })

                            if (asseturl) {
                                poopy.functions.infoPost(`Roblox asset URL detected`)
                                return asseturl
                            }
                        }
                    }
                }

                var ids = url.match(/\d+/g)
                if (ids.length) {
                    var id = ids[0]
                    var asseturl = await getAsset(id).catch(() => { })

                    if (asseturl) return asseturl
                }
            } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(badges)\//)) {
                async function getBadge(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${id}&size=150x150&format=Png&isCircular=false`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data

                            if (body.data ? body.data.length > 0 : false) {
                                if (body.data[0].state === 'Pending') {
                                    var url = await getBadge(id).catch(() => { })
                                    resolve(url)
                                    return
                                }

                                resolve(body.data[0].imageUrl)
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                var ids = url.match(/\d+/g)
                if (ids.length) {
                    var id = ids[0]
                    var badgeurl = await getBadge(id).catch(() => { })

                    if (badgeurl) {
                        poopy.functions.infoPost(`Roblox badge URL detected`)
                        return badgeurl
                    }
                }
            } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(bundles)\//)) {
                async function getBundle(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://thumbnails.roblox.com/v1/bundles/thumbnails?bundleIds=${id}&size=420x420&format=Png&isCircular=false`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data

                            if (body.data ? body.data.length > 0 : false) {
                                if (body.data[0].state === 'Pending') {
                                    var url = await getBundle(id).catch(() => { })
                                    resolve(url)
                                    return
                                }

                                resolve(body.data[0].imageUrl)
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                var ids = url.match(/\d+/g)
                if (ids.length) {
                    var id = ids[0]
                    var bundleurl = await getBundle(id).catch(() => { })

                    if (bundleurl) {
                        poopy.functions.infoPost(`Roblox bundle URL detected`)
                        return bundleurl
                    }
                }
            } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(game-pass)\//)) {
                async function getGamePass(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${id}&size=150x150&format=Png&isCircular=false`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data

                            if (body.data ? body.data.length > 0 : false) {
                                if (body.data[0].state === 'Pending') {
                                    var url = await getGamePass(id).catch(() => { })
                                    resolve(url)
                                    return
                                }

                                resolve(body.data[0].imageUrl)
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                var ids = url.match(/\d+/g)
                if (ids.length) {
                    var id = ids[0]
                    var gamepassurl = await getGamePass(id).catch(() => { })

                    if (gamepassurl) {
                        poopy.functions.infoPost(`Roblox gamepass URL detected`)
                        return gamepassurl
                    }
                }
            } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(users)\//)) {
                async function getUser(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://thumbnails.roblox.com/v1/users/avatar?userIds=${id}&size=720x720&format=Png&isCircular=false`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data

                            if (body.data ? body.data.length > 0 : false) {
                                if (body.data[0].state === 'Pending') {
                                    var url = await getUser(id).catch(() => { })
                                    resolve(url)
                                    return
                                }

                                resolve(body.data[0].imageUrl)
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                var ids = url.match(/\d+/g)
                if (ids.length) {
                    var id = ids[0]
                    var userurl = await getUser(id).catch(() => { })

                    if (userurl) {
                        poopy.functions.infoPost(`Roblox avatar URL detected`)
                        return userurl
                    }
                }
            } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(groups)\//)) {
                async function getGroup(id) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request({
                            method: 'GET',
                            url: `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${id}&size=420x420&format=Png&isCircular=false`,
                            headers: {
                                "Accept": "application/json"
                            }
                        }).then(async (res) => {
                            var body = res.data

                            if (body.data ? body.data.length > 0 : false) {
                                if (body.data[0].state === 'Pending') {
                                    var url = await getGroup(id).catch(() => { })
                                    resolve(url)
                                    return
                                }

                                resolve(body.data[0].imageUrl)
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                var ids = url.match(/\d+/g)
                if (ids.length) {
                    var id = ids[0]
                    var groupurl = await getGroup(id).catch(() => { })

                    if (groupurl) {
                        poopy.functions.infoPost(`Roblox group icon URL detected`)
                        return groupurl
                    }
                }
            } else if (url.match(/^https\:\/\/((www|m)\.)?youtube\.com|^https\:\/\/(www\.)?youtu\.be/)) {
                var youtubeurl = await poopy.modules.youtubedl(url, {
                    format: '18',
                    'get-url': ''
                }).catch(() => { })

                if (youtubeurl) {
                    poopy.functions.infoPost(`YouTube video URL detected`)
                    return youtubeurl
                }
            } /*else if (url.match(/^https\:\/\/((www)\.)?reddit\.com\/r\/[a-zA-Z0-9][a-zA-Z0-9_]{2,20}/)) {
            var redditurls = await poopy.modules.youtubedl(url, {
                format: '18',
                'get-url': ''
            }).catch(() => { })

            if (youtubeurl) return youtubeurl
        }*/ else if (url.match(/^https\:\/\/((www)\.)?(fx)?twitter\.com\/\w{4,15}\/status\/\d+/)) {
                async function getImageUrl(url) {
                    return new Promise((resolve) => {
                        poopy.modules.axios.request(url).then(async (res) => {
                            var $ = poopy.modules.cheerio.load(res.data)
                            var urls = $('div .AdaptiveMedia-photoContainer.js-adaptive-photo')

                            if (urls.length > 0) {
                                resolve(urls[0].attribs['data-image-url'])
                                return
                            }

                            resolve()
                        }).catch(() => resolve())
                    })
                }

                async function getGifUrl(url) {
                    var twittergifurl = await poopy.modules.youtubedl(url, {
                        format: 'http',
                        'get-url': ''
                    }).catch(() => { })

                    return twittergifurl
                }

                async function getVidUrl(url) {
                    var twittervidurl = await poopy.modules.youtubedl(url, {
                        format: 'http-832',
                        'get-url': ''
                    }).catch(() => { })

                    return twittervidurl
                }

                var twittervidurl = await getVidUrl(url).catch(() => { })
                var twittergifurl = await getGifUrl(url).catch(() => { })
                var twitterimageurl = await getImageUrl(url).catch(() => { })

                if (twittervidurl) {
                    poopy.functions.infoPost(`Twitter video URL detected`)
                    return twittervidurl
                }

                if (twittergifurl) {
                    poopy.functions.infoPost(`Twitter GIF URL detected`)
                    return twittergifurl
                }

                if (twitterimageurl) {
                    poopy.functions.infoPost(`Twitter image URL detected`)
                    return twitterimageurl
                }
            }

            return url
        }

        poopy.functions.getUrls = async function (msg, options = {}) {
            if (!msg) return []
            var string = (options.string ?? msg.content ?? '').replace(/"([\s\S]*?)"/g, '')
            var prefixFound = string.toLowerCase().includes(poopy.data['guild-data'][msg.guild.id]['prefix'].toLowerCase())
            var urls = []
            var regexes = [
                {
                    regexp: poopy.vars.emojiRegex,
                    func: async function (emoji) {
                        var codepoints = []
                        for (var j = 0; j < [...emoji].length; j++) {
                            codepoints.push([...emoji][j].codePointAt().toString(16).padStart(4, '0'))
                        }
                        var emojiimage = poopy.json.emojiJSON.find(image => image.unicode === codepoints.join('-'))
                        if (emojiimage) {
                            poopy.functions.infoPost(`Emoji URL detected`)
                            return emojiimage.url
                        }
                    }
                },
                {
                    regexp: /<a?:.+?:\d+>/g,
                    func: async function (demoji) {
                        var demojiidmatch = demoji.match(/\d+/g)
                        var demojiid = demojiidmatch[demojiidmatch.length - 1]
                        var gifurl = `https://cdn.discordapp.com/emojis/${demojiid}.gif?size=1024`
                        var pngurl = `https://cdn.discordapp.com/emojis/${demojiid}.png?size=1024`
                        var demojiurls = [gifurl, pngurl]
                        var demojiurl = undefined
                        for (var i in demojiurls) {
                            var url = demojiurls[i]
                            var response = await poopy.modules.axios.request({
                                url: url,
                                validateStatus: () => true
                            }).catch(() => { })
                            if (response && response.status >= 200 && response.status < 300) {
                                demojiurl = url
                                break
                            }
                        }
                        if (demojiurl) {
                            poopy.functions.infoPost(`Server emoji URL detected`)
                            return demojiurl
                        }
                    }
                },
                {
                    regexp: /\d{10,}/g,
                    func: async function (id) {
                        var user = await poopy.bot.users.fetch(id).catch(() => { })
                        if (user) {
                            poopy.functions.infoPost(`Discord avatar URL detected`)
                            return user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' })
                        }
                    }
                },
                {
                    regexp: poopy.vars.validUrl,
                    func: async function (url) {
                        var correctedurl = await poopy.functions.correctUrl(url).catch(() => { }) ?? url

                        if (correctedurl == url) poopy.functions.infoPost(`Default URL detected`)

                        return correctedurl
                    }
                }
            ]

            if (!prefixFound) {
                regexes.splice(0, 3)
            }

            var urlregex = new RegExp(regexes.map(regex => `(${regex.regexp.source})`).join('|'), 'g')

            var matches = string.match(urlregex)
            if (matches) {
                var matchesr = matches.reverse()
                for (var i in matchesr) {
                    var match = matchesr[i]
                    var matched = []
                    regexes.forEach(regex => {
                        var m = match.match(regex.regexp)
                        if (m) {
                            regex.length = m[0].length
                            matched.push(regex)
                        }
                    })
                    matched.sort(function (a, b) {
                        return b.length - a.length
                    })
                    var url = await matched[0].func(match).catch(() => { })
                    if (url) {
                        urls = [url].concat(urls)
                    }
                }
            }

            if (msg.attachments.size) {
                var attachmentsR = []
                msg.attachments.forEach(attachment => {
                    attachmentsR.push(attachment.url)
                })
                attachmentsR.reverse()
                attachmentsR.forEach(attachment => {
                    urls = [attachment].concat(urls)
                })
            }

            var reply = await msg.fetchReference().catch(() => { })
            if (reply && !options.replied) {
                if (reply.guild) {
                    urls = urls.concat(await poopy.functions.getUrls(reply, {
                        replied: true
                    }) ?? [])
                }
            }

            if (options.update) {
                var urlsr = urls.reverse()
                for (var i in urlsr) {
                    var url = urlsr[i]

                    poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                    poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = url
                    var lastUrls = [url].concat(poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                    lastUrls.splice(100)
                    poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                }
            }

            if (urls.length > 0) poopy.functions.infoPost(`Found ${urls.length} URL${urls.length > 1 ? 's' : ''} in message`)

            return urls
        }

        poopy.functions.getKeywordsFor = async function (string, msg, isBot, { extrakeys = {}, extrafuncs = {}, resetattempts = false } = {}) {
            if (!poopy.tempdata[msg.author.id]) {
                poopy.tempdata[msg.author.id] = {}
            }

            if (!poopy.tempdata[msg.author.id]['keyattempts']) {
                poopy.tempdata[msg.author.id]['keyattempts'] = 0
            }

            if (!poopy.tempdata[msg.author.id]['arrays']) {
                poopy.tempdata[msg.author.id]['arrays'] = {}
            }

            if (!poopy.tempdata[msg.author.id]['declared']) {
                poopy.tempdata[msg.author.id]['declared'] = {}
            }

            if (!poopy.tempdata[msg.author.id]['keywordsExecuted']) {
                poopy.tempdata[msg.author.id]['keywordsExecuted'] = []
            }

            if (!poopy.tempdata[msg.author.id]['startTime']) {
                poopy.tempdata[msg.author.id]['startTime'] = Date.now()
            }

            while (poopy.functions.getKeyFunc(string, { extrakeys: extrakeys, extrafuncs: extrafuncs }) !== false) {
                if (poopy.tempdata[msg.author.id]['keyattempts'] >= poopy.config.keyLimit) {
                    poopy.functions.infoPost(`Keyword attempts value exceeded`)
                    return 'Keyword attempts value exceeded.'
                }

                var keydata = poopy.functions.getKeyFunc(string, { extrakeys: extrakeys, extrafuncs: extrafuncs })

                poopy.tempdata[msg.author.id]['keywordsExecuted'].push(typeof (keydata.match) == 'object' ? keydata.match[0] : keydata.match)

                switch (keydata.type) {
                    case 'key':
                        var key = poopy.specialkeys.keys[keydata.match] || extrakeys[keydata.match]
                        poopy.tempdata[msg.author.id]['keyattempts'] += key.attemptvalue ?? 1
                        var change = await key.func.call(poopy, msg, isBot, string).catch(() => { }) ?? ''
                        string = typeof (change) === 'object' && change[1] === true ? change[0] : string.replace(new RegExp(poopy.functions.regexClean(keydata.match), 'i'), change)
                        break

                    case 'func':
                        var [funcName, match] = keydata.match
                        var func = poopy.specialkeys.functions[funcName] || extrafuncs[funcName]
                        poopy.tempdata[msg.author.id]['keyattempts'] += func.attemptvalue ?? 1
                        var m = match
                        if (!func.raw) {
                            match = await poopy.functions.getKeywordsFor(match, msg, isBot, { extrakeys: extrakeys, extrafuncs: extrafuncs }).catch(() => { }) ?? m
                        }
                        match = match.replace(/\\\)/g, ')')
                        if (!func.raw) {
                            string = string.replace(m, match)
                        }
                        var change = await func.func.call(poopy, [funcName, match], msg, isBot, string).catch(() => { }) ?? ''
                        string = typeof (change) === 'object' && change[1] === true ? change[0] : string.replace(new RegExp(poopy.functions.regexClean(`${funcName}(${match})`), 'i'), change)
                        break
                }
            }

            if (resetattempts) {
                poopy.tempdata[msg.author.id]['keyattempts'] = 0
                if (poopy.tempdata[msg.author.id]['keywordsExecuted'].length) {
                    poopy.functions.infoPost(`Took ${(Date.now() - poopy.tempdata[msg.author.id]['startTime']) / 1000} seconds to execute keywords/functions: ${poopy.tempdata[msg.author.id]['keywordsExecuted'].map(k => `\`${k}\``).join(', ')}`)
                }
                poopy.tempdata[msg.author.id]['keywordsExecuted'] = []
                delete poopy.tempdata[msg.author.id]['startTime']
            }

            return string
        }

        poopy.functions.fetchImages = async function (query, bing, safe) {
            return new Promise(async (resolve) => {
                if (bing) {
                    var options = {
                        method: 'GET',
                        url: 'https://bing-image-search1.p.rapidapi.com/images/search',
                        params: { q: query, count: '100', safeSearch: safe ? 'moderate' : 'off' },
                        headers: {
                            'x-rapidapi-host': 'bing-image-search1.p.rapidapi.com',
                            'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
                        }
                    }

                    var response = await poopy.modules.axios.request(options).catch(() => { })

                    if (!response) {
                        resolve([])
                        return
                    }

                    if (!(response.status >= 200 && response.status < 300)) {
                        resolve([])
                        return
                    }

                    var images = []
                    var body = response.data

                    if (body.value ? body.value.length > 0 : false) {
                        images = body.value.map(result => result.contentUrl)
                    }

                    resolve(images)
                } else {
                    poopy.modules.gis({
                        searchTerm: query,
                        queryStringAddition: `&safe=${safe ? 'active' : 'images'}`
                    }, async function (_, results) {
                        var images = []

                        for (var i in results) {
                            var result = results[i]
                            var url = result.url.replace(/\\u([a-z0-9]){4}/g, (match) => {
                                return String.fromCharCode(Number('0x' + match.substring(2, match.length)))
                            })

                            images.push(url)
                        }

                        resolve(images)
                    })
                }
            })
        }

        poopy.functions.downloadFile = async function (url, filename, options) {
            url = url || ' '
            options = options || {}
            var filepath
            var ffmpegUsed = false

            if (options.filepath) {
                filepath = options.filepath
            } else {
                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                poopy.modules.fs.mkdirSync(`temp/${poopy.config.mongodatabase}/file${currentcount}`)
                filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
            }

            async function ffmpeg() {
                ffmpegUsed = true
                poopy.functions.infoPost(`Downloading file through FFmpeg with name \`${filename}\``)
                if (options.fileinfo) {
                    await poopy.functions.execPromise(`ffmpeg -i "${url}"${options.ffmpegstring ? ` ${options.ffmpegstring}` : options.fileinfo.shortext === 'gif' ? ` -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -gifflags -offsetting` : options.fileinfo.shortext === 'png' ? ' -pix_fmt rgba' : options.fileinfo.shortext === 'mp4' ? ' -c:v libx264 -pix_fmt yuv420p' : options.fileinfo.shortext === 'mp3' ? ' -c:a libmp3lame' : ''} ${filepath}/${filename}`)
                } else {
                    await poopy.functions.execPromise(`ffmpeg -i "${url}"${options.ffmpegstring ? ` ${options.ffmpegstring}` : ''} ${filepath}/${filename}`)
                }
            }

            if (options.buffer) {
                poopy.functions.infoPost(`Downloading file through buffer with name \`${filename}\``)
                poopy.modules.fs.writeFileSync(`${filepath}/${filename}`, url)
            } else if (((!(options.fileinfo) ? true : ((options.fileinfo.shortext === options.fileinfo.type.ext) && (options.fileinfo.shortpixfmt === options.fileinfo.info.pixfmt))) || options.http) && !(options.ffmpeg)) {
                poopy.functions.infoPost(`Downloading file through URL with name \`${filename}\``)
                var response = await poopy.modules.axios.request({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer'
                }).catch(() => { })

                if (response) {
                    poopy.modules.fs.writeFileSync(`${filepath}/${filename}`, response.data)
                }
            } else {
                await ffmpeg()
            }

            if (options.convert && !ffmpegUsed) {
                await ffmpeg()
            }

            poopy.functions.infoPost(`Successfully downloaded \`${filename}\` in \`${filepath}\``)

            return filepath
        }

        poopy.functions.sendFile = async function (msg, filepath, filename, extraOptions) {
            extraOptions = extraOptions || {}

            var prefix = poopy.data['guild-data'][msg.guild.id]['prefix']
            var args = msg.content.substring(prefix.toLowerCase().length).split(' ')

            extraOptions.catbox = !!args.find(arg => arg === '-catbox')
            extraOptions.nosend = !!args.find(arg => arg === '-nosend')

            var nameindex = args.indexOf('-filename')
            if (nameindex > -1 && args[nameindex + 1]) {
                extraOptions.name = args[nameindex + 1].replace(/[/\\?%*:|"<>]/g, '-').substring(0, 128)
            }

            try {
                poopy.modules.fs.readFileSync(`${filepath}/${filename}`)
            } catch (_) {
                await poopy.functions.waitMessageCooldown()
                await msg.channel.send('Couldn\'t send file.').catch(() => { })
                poopy.functions.infoPost(`Couldn\'t send file`)
                msg.channel.sendTyping().catch(() => { })
                poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
                return
            }

            if (extraOptions.name) {
                poopy.modules.fs.renameSync(`${filepath}/${filename}`, `${filepath}/${extraOptions.name}`)
                filename = extraOptions.name
            }

            if (extraOptions.catbox || extraOptions.nosend) {
                poopy.functions.infoPost(`Uploading file to catbox.moe`)
                var fileLink = await poopy.vars.Catbox.upload(`${filepath}/${filename}`).catch(() => { })
                if (fileLink) {
                    var isUrl = poopy.vars.validUrl.test(fileLink)

                    if (extraOptions.nosend) {
                        if (isUrl) {
                            poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl2'] = poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl']
                            poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] = fileLink
                            var lastUrls = [fileLink].concat(poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'])
                            lastUrls.splice(100)
                            poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lastUrls
                        } else {
                            await poopy.functions.waitMessageCooldown()
                            await msg.channel.send(fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink).catch(() => { })
                            poopy.functions.infoPost(`Couldn\'t upload catbox.moe file, reason:\n\`${fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink}\``)
                        }
                    } else {
                        await poopy.functions.waitMessageCooldown()
                        await msg.channel.send(fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink).catch(() => { })
                        if (!isUrl) {
                            poopy.functions.infoPost(`Couldn\'t upload catbox.moe file, reason:\n\`${fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink}\``)
                        }
                    }
                } else {
                    await msg.channel.send('Couldn\'t send file.').catch(() => { })
                    poopy.functions.infoPost(`Couldn\'t upload catbox.moe file`)
                }
            } else {
                poopy.functions.infoPost(`Sending file to channel`)
                var sendObject = {
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/${filename}`)]
                }

                if (extraOptions.content) sendObject.content = extraOptions.content

                await poopy.functions.waitMessageCooldown()
                var fileMsg = await msg.channel.send(sendObject).catch(() => { })

                if (!fileMsg) {
                    await poopy.functions.waitMessageCooldown()
                    await msg.channel.send('The output file is too large, so I\'m uploading it to catbox.moe.').catch(() => { })
                    poopy.functions.infoPost(`Failed to send file to channel, uploading to catbox.moe`)
                    var fileLink = await poopy.vars.Catbox.upload(`${filepath}/${filename}`).catch(() => { })
                    if (fileLink) {
                        var isUrl = poopy.vars.validUrl.test(fileLink)
                        await poopy.functions.waitMessageCooldown()
                        await msg.channel.send(fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink).catch(() => { })

                        if (!isUrl) {
                            poopy.functions.infoPost(`Couldn\'t upload catbox.moe file, reason:\n\`${fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink}\``)
                        }
                    } else {
                        await poopy.functions.waitMessageCooldown()
                        await msg.channel.send('Couldn\'t send file.').catch(() => { })
                        poopy.functions.infoPost(`Couldn\'t upload catbox.moe file`)
                    }
                }
            }

            msg.channel.sendTyping().catch(() => { })

            if (!extraOptions.keep && filepath !== undefined) {
                poopy.functions.infoPost(`Deleting \`${filepath}/${filename}\` and its folder`)
                poopy.modules.fs.rmSync(filepath, { force: true, recursive: true })
            }
        }

        poopy.functions.validateFileFromPath = async function (path, exception, rejectMessages) {
            return new Promise(async (resolve, reject) => {
                poopy.functions.infoPost(`Validating file from path`)

                var rej = reject
                reject = function (val) {
                    poopy.functions.infoPost(`File can't be processed, reason:\n\`${val}\``)
                    rej(val)
                }

                if ((process.memoryUsage().rss / 1024 / 1024) <= poopy.config.memLimit) {
                    reject('No resources available.')
                    return
                }

                var type = await poopy.modules.fileType.fromFile(path).catch(() => { })

                if (!type) {
                    var body = poopy.modules.fs.readFileSync(path).toString()
                    type = { mime: body.match(/<[a-z]>(.*?)<\/[a-z]>/g) ? 'text/html' : 'text/plain', ext: body.match(/<[a-z]>(.*?)<\/[a-z]>/g) ? 'html' : 'plain' }
                }

                var info = {
                    frames: 1,
                    fps: '0/0',
                    duration: 'N/A',
                    aduration: 'N/A',
                    width: 0,
                    height: 0,
                    audio: false,
                    pixfmt: 'unk',
                    size: 0,
                    realsize: 0
                }
                var names = path.split('/')
                var limitObject = exception ? poopy.config.limitsexcept : poopy.config.limits
                var shorttype
                var shortext
                var shortpixfmt

                if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
                    shorttype = 'image'
                    shortext = 'png'
                    shortpixfmt = 'rgba'
                } else if (type.mime.startsWith('video')) {
                    shorttype = 'video'
                    shortext = 'mp4'
                    shortpixfmt = 'yuv420p'
                } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
                    shorttype = 'gif'
                    shortext = 'gif'
                    shortpixfmt = 'bgra'
                } else if (type.mime.startsWith('audio')) {
                    shorttype = 'audio'
                    shortext = 'mp3'
                    shortpixfmt = 'unk'
                } else {
                    shorttype = type.mime.split('/')[0]
                    shortext = type.ext
                    shortpixfmt = 'unk'
                }

                info.size = poopy.modules.fs.readFileSync(path).length / 1048576
                info.realsize = poopy.modules.fs.readFileSync(path).length

                var json = await poopy.functions.execPromise(`ffprobe -of json -show_streams -show_format ${path}`)
                if (json) {
                    try {
                        var jsoninfo = JSON.parse(json)
                        if (jsoninfo["streams"]) {
                            var videoStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'video')
                            var audioStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'audio')

                            if ((type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video')) {
                                info.frames = videoStream["nb_frames"] || 0
                                info.fps = videoStream["r_frame_rate"] || '0/0'
                            }
                            if (type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                                info.audio = !!audioStream
                            }
                            if ((type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                                info.duration = (videoStream || audioStream)["duration"] || 0
                            }
                            if ((type.mime.startsWith('video') || type.mime.startsWith('audio')) && info.audio) {
                                info.aduration = audioStream["duration"] || 0
                            }
                            if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
                                info.width = videoStream["width"] || 0
                                info.height = videoStream["height"] || 0
                                info.pixfmt = videoStream["pix_fmt"] || 'unk'
                            }
                        }
                    } catch (_) { }
                }

                if (exception !== 'very true') {
                    for (var paramName in info) {
                        if (limitObject[paramName]) {
                            var param = info[paramName]
                            var rejectMessage = rejectMessages ? rejectMessages[paramName] : limitObject[paramName]['message']

                            if (param >= limitObject[paramName][shorttype]) {
                                reject(rejectMessage.replace('{param}', limitObject[paramName][shorttype]))
                                return
                            }
                        }
                    }
                }

                poopy.functions.infoPost(`File \`${names[names.length - 1]}\` was successfully validated`)

                resolve({
                    type: type,
                    shorttype: shorttype,
                    shortext: shortext,
                    shortpixfmt: shortpixfmt,
                    name: names[names.length - 1],
                    info: info
                })
            })
        }

        poopy.functions.validateFile = async function (url, exception, rejectMessages) {
            return new Promise(async (resolve, reject) => {
                poopy.functions.infoPost(`Validating file from URL`)

                var rej = reject
                reject = function (val) {
                    poopy.functions.infoPost(`File can't be processed, reason:\n\`${val}\``)
                    rej(val)
                }

                url = url || ' '
                if ((process.memoryUsage().rss / 1024 / 1024) <= poopy.config.memLimit) {
                    reject('No resources available.')
                    return
                }

                var response = await poopy.modules.axios.request({
                    method: 'GET',
                    url: url,
                    responseType: 'stream',
                    validateStatus: () => true
                }).catch((err) => {
                    reject(err.message)
                })

                if (!response) {
                    return
                }

                if (!(response.status >= 200 && response.status < 300)) {
                    reject(`${response.status} ${response.statusText}`)
                    return
                }

                var headers = response.headers
                var type = await poopy.modules.fileType.fromStream(response.data).catch(() => { })

                if (!type) {
                    var contentType = headers['Content-Type'] || headers['content-type']
                    var mime = contentType.match(/[^;]+/)
                    type = { mime: mime[0], ext: mime[0].split('/')[1] }
                }

                var info = {
                    frames: 1,
                    fps: '0/0',
                    duration: 'N/A',
                    aduration: 'N/A',
                    width: 0,
                    height: 0,
                    audio: false,
                    pixfmt: 'unk',
                    size: 0,
                    realsize: 0
                }
                var limitObject = exception ? poopy.config.limitsexcept : poopy.config.limits
                var name
                var shorttype
                var shortext
                var shortpixfmt

                if (type.mime.startsWith('image') && !(poopy.vars.gifFormats.find(f => f === type.ext))) {
                    shorttype = 'image'
                    shortext = 'png'
                    shortpixfmt = 'rgba'
                } else if (type.mime.startsWith('video')) {
                    shorttype = 'video'
                    shortext = 'mp4'
                    shortpixfmt = 'yuv420p'
                } else if (type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) {
                    shorttype = 'gif'
                    shortext = 'gif'
                    shortpixfmt = 'bgra'
                } else if (type.mime.startsWith('audio')) {
                    shorttype = 'audio'
                    shortext = 'mp3'
                    shortpixfmt = 'unk'
                } else {
                    shorttype = type.mime.split('/')[0]
                    shortext = type.ext
                    shortpixfmt = 'unk'
                }

                var nameurl = headers['Location'] || headers['location'] || url
                var parsedurl = poopy.modules.whatwg.parseURL(nameurl)
                name = parsedurl.path[parsedurl.path.length - 1]
                var contentdisposition = headers['content-disposition']
                if (contentdisposition) {
                    var filenameMatch = contentdisposition.match(/filename=".+"/)
                    if (filenameMatch) {
                        name = filenameMatch[0].substring(10, filenameMatch[0].length - 1)
                    }
                }

                var contentLength = headers['content-length'] || headers['Content-Length']

                if (contentLength) {
                    info.size = Number(contentLength) / 1048576
                    info.realsize = Number(contentLength)
                } else {
                    var bufferresponse = await poopy.modules.axios.request({
                        method: 'GET',
                        url: url,
                        responseType: 'arraybuffer'
                    }).catch(() => { }) ?? { data: '' }

                    info.size = bufferresponse.data.length / 1048576
                    info.realsize = bufferresponse.data.length
                }

                var json = await poopy.functions.execPromise(`ffprobe -of json -show_streams -show_format "${url}"`).catch(() => { })
                if (json) {
                    try {
                        var jsoninfo = JSON.parse(json)
                        if (jsoninfo["streams"]) {
                            var videoStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'video')
                            var audioStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'audio')

                            if ((type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video')) {
                                info.frames = videoStream["nb_frames"] || 0
                                info.fps = videoStream["r_frame_rate"] || '0/0'
                            }
                            if (type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                                info.audio = !!audioStream
                            }
                            if ((type.mime.startsWith('image') && poopy.vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                                info.duration = (videoStream || audioStream)["duration"] || 0
                            }
                            if ((type.mime.startsWith('video') || type.mime.startsWith('audio')) && info.audio) {
                                info.aduration = audioStream["duration"] || 0
                            }
                            if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
                                info.width = videoStream["width"] || 0
                                info.height = videoStream["height"] || 0
                                info.pixfmt = videoStream["pix_fmt"] || 'unk'
                            }
                        }
                    } catch (_) { }
                }

                if (exception !== 'very true') {
                    for (var paramName in info) {
                        if (limitObject[paramName]) {
                            var param = info[paramName]
                            var rejectMessage = rejectMessages ? rejectMessages[paramName] : limitObject[paramName]['message']

                            if (param >= limitObject[paramName][shorttype]) {
                                reject(rejectMessage.replace('{param}', limitObject[paramName][shorttype]))
                                return
                            }
                        }
                    }
                }

                poopy.functions.infoPost(`File \`${name}\` was successfully validated`)

                resolve({
                    type: type,
                    shorttype: shorttype,
                    shortext: shortext,
                    shortpixfmt: shortpixfmt,
                    name: name,
                    info: info
                })
            })
        }

        poopy.functions.changeStatus = function () {
            if (poopy.bot && poopy.vars.statusChanges === 'true') {
                var choosenStatus = poopy.statuses[Math.floor(Math.random() * poopy.statuses.length)]
                poopy.functions.infoPost(`Status changed to ${choosenStatus.type.toLowerCase()} ${((choosenStatus.type === "COMPETING" && 'in ') || (choosenStatus.type === "LISTENING" && 'to ') || '')}${choosenStatus.name}`)
                poopy.bot.user.setPresence({
                    status: 'online',
                    activities: [
                        {
                            name: choosenStatus['name'] + ` | ${poopy.config.globalPrefix}help`,
                            type: choosenStatus['type'],
                            url: 'https://www.youtube.com/watch?v=LDQO0ALm0gE',
                        }
                    ],
                })
            }
        }

        poopy.functions.save = async function () {
            poopy.functions.infoPost(`Saving data`)

            if (poopy.config.testing) {
                poopy.modules.fs.writeFileSync(`data/${poopy.config.mongodatabase}.json`, JSON.stringify(poopy.data))
                poopy.modules.fs.writeFileSync(`data/globaldata.json`, JSON.stringify(poopy.functions.globalData()))
            } else {
                await poopy.functions.updateAllData(poopy.config.mongodatabase, { data: poopy.data, globaldata: poopy.functions.globalData() }).catch(() => { })
            }

            poopy.functions.infoPost(`Data saved`)
        }

        poopy.specialkeys = {
            keys: {},
            functions: {}
        }

        poopy.modules.fs.readdirSync('special/keys').forEach(name => {
            var key = name.replace(/\.js$/, '')
            if (!(poopy.config.poosonia && poopy.config.poosoniakeywordblacklist.find(keyname => keyname == key))) {
                poopy.specialkeys.keys[key] = require(`./special/keys/${key}`)
            }
        })

        poopy.modules.fs.readdirSync('special/functions').forEach(name => {
            var func = name.replace(/\.js$/, '')
            if (!(poopy.config.poosonia && poopy.config.poosoniafunctionblacklist.find(funcname => funcname == func))) {
                poopy.specialkeys.functions[func] = require(`./special/functions/${name}`)
            }
        })

        poopy.vars.chunkkeyfields = poopy.functions.chunkObject(poopy.specialkeys.keys, 10)
        poopy.vars.keyfields = []

        for (var kg in poopy.vars.chunkkeyfields) {
            var keygroup = poopy.vars.chunkkeyfields[kg]
            poopy.vars.keyfields[kg] = []
            for (var k in keygroup) {
                var key = keygroup[k]
                poopy.vars.keyfields[kg].push({
                    name: k,
                    value: key.desc
                })
            }
        }

        poopy.vars.chunkfuncfields = poopy.functions.chunkObject(poopy.specialkeys.functions, 10)
        poopy.vars.funcfields = []

        for (var fg in poopy.vars.chunkfuncfields) {
            var funcgroup = poopy.vars.chunkfuncfields[fg]
            poopy.vars.funcfields[fg] = []
            for (var f in funcgroup) {
                var func = funcgroup[f]
                poopy.vars.funcfields[fg].push({
                    name: f + func.helpf,
                    value: func.desc
                })
            }
        }

        poopy.commands = []

        poopy.modules.fs.readdirSync('cmds').forEach(name => {
            poopy.commands.push(require(`./cmds/${name}`))
        })

        poopy.commands.sort((a, b) => {
            if (a.name[0] > b.name[0]) {
                return 1
            }
            if (a.name[0] < b.name[0]) {
                return -1
            }
            return 0
        })

        poopy.slashCommands = [
            {
                info: new poopy.modules.DiscordBuilders.SlashCommandBuilder()
                    .setName('say')
                    .setDescription('A test command, for now.')
                    .addStringOption(option =>
                        option.setName('content')
                            .setDescription('The message\'s content.')
                            .setRequired(true))
                    .toJSON(),

                execute: async function (interaction) {
                    await interaction.reply({
                        content: interaction.options.getString('content'),
                        allowedMentions: {
                            parse: (!interaction.member.permissions.has('ADMINISTRATOR') &&
                                !interaction.member.permissions.has('MENTION_EVERYONE') &&
                                interaction.author.id !== interaction.guild.ownerID) ?
                                ['users'] : ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                }
            }
        ]

        poopy.functions.updateSlashCommands = async function () {
            await poopy.vars.rest.put(poopy.modules.Routes.applicationCommands(poopy.bot.user.id), { body: poopy.slashCommands.map(scmd => scmd.info) }).catch(() => { })
        }

        poopy.functions.findCommand = function (name) {
            return poopy.commands.find(c => c.name.find(n => n === name))
        }

        poopy.functions.waitMessageCooldown = async function (noreset) {
            if (poopy.config.msgcooldown <= 0) return

            while (poopy.vars.msgcooldown) {
                await poopy.functions.sleep(1000)
            }

            if (!noreset) {
                poopy.vars.msgcooldown = true
                setTimeout(() => poopy.vars.msgcooldown = false, poopy.config.msgcooldown)
            }
        }

        poopy.vars.helpCmds = []
        poopy.vars.jsonCmds = []
        poopy.vars.devCmds = []
        poopy.vars.sections = []
        poopy.vars.types = []

        for (var i in poopy.commands) {
            var command = poopy.commands[i]

            if (poopy.config.poosonia && poopy.config.poosoniablacklist.find(bname => command.name.find(cmdname => cmdname === bname))) {
                poopy.commands.splice(i, 1)
            } else {
                if (command.type === "Owner") {
                    poopy.vars.devCmds.push(command.help)
                } else if (command.type === "JSON Club") {
                    poopy.vars.jsonCmds.push(command.help)
                } else {
                    if (!poopy.vars.helpCmds.find(typeList => typeList.type === command.type)) {
                        poopy.vars.helpCmds.push({
                            type: command.type,
                            commands: []
                        })
                        poopy.vars.types.push(command.type)
                    }

                    poopy.vars.helpCmds.find(typeList => typeList.type === command.type).commands.push(command.help)
                }
            }
        }

        poopy.vars.helpCmds.sort((a, b) => {
            if (a.type > b.type) {
                return 1
            }
            if (a.type < b.type) {
                return -1
            }
            return 0
        })

        for (var i in poopy.vars.helpCmds) {
            var type = poopy.vars.helpCmds[i].type

            poopy.vars.helpCmds[i].commands.sort((a, b) => {
                if (a.name > b.name) {
                    return 1
                }
                if (a.name < b.name) {
                    return -1
                }
                return 0
            })

            var packed = poopy.vars.helpCmds[i].commands

            var chunked = poopy.functions.chunkArray(packed, 10)

            for (var j in chunked) {
                var commandChunk = chunked[j]

                poopy.vars.sections.push({
                    type: type,
                    commands: commandChunk
                })
            }
        }

        poopy.vars.sections.sort((a, b) => {
            if (a.type > b.type) {
                return 1
            }
            if (a.type < b.type) {
                return -1
            }
            return 0
        })

        poopy.vars.devCmds.sort((a, b) => {
            if (a.name > b.name) {
                return 1
            }
            if (a.name < b.name) {
                return -1
            }
            return 0
        })

        poopy.vars.jsonCmds.sort((a, b) => {
            if (a.name > b.name) {
                return 1
            }
            if (a.name < b.name) {
                return -1
            }
            return 0
        })

        poopy.vars.shelpCmds = poopy.vars.sections

        poopy.vars.categories = {
            Animation: 'Move and animate a file in an indefinite amount of ways.',
            Annoying: 'why',
            Audio: 'Add an effect to an input\'s audio.',
            Battling: 'beat your parents',
            Captions: 'Add a caption to an input.',
            Color: 'Change an input\'s colors.',
            Compression: 'Useful commands for file compression.',
            Conversion: 'Convert a file between various different formats.',
            Duration: 'Change the duration of a video, GIF or audio.',
            Effects: 'A wide range of commands that change the way the file looks.',
            Fetching: 'Image, GIF, and video fetching commands.',
            Generation: 'Generate a new file from an AI or not.',
            'Hex Manipulation': 'Manipulate the file\'s Hex Code to make it shorter, longer, etc.',
            'Inside Joke': 'phexonia studios',
            'JSON Club': 'Exclusive to some people for editing the JSONs used by Poopy.',
            Main: 'Poopy\'s main commands.',
            Memes: 'Integrate an input in many different meme formats.',
            Mirroring: 'Flip or mirror a file in different axes.',
            OG: 'They were there since the very beginning...',
            Owner: 'salami commands',
            Overlaying: 'For stacking or overlaying a file on top of another.',
            Random: 'Send a random value from a collection of values.',
            Resizing: 'Scale a file in some way.',
            Settings: 'Manage a server\'s Poopy settings, or your own Poopy settings.',
            Text: 'Commands that serve text as output.',
            Unique: 'Commands that resemble unique features to Poopy, keywords for example.',
            Webhook: 'Webhook commands.'
        }

        poopy.callbacks.messageCallback = async msg => {
            if (!poopy.config.ownerids.find(id => id == msg.author.id) && poopy.config.testing && !poopy.config.allowtesting) {
                await poopy.functions.waitMessageCooldown()
                msg.channel.send('you won\'t use me any time soon')
                return
            }

            poopy.data['bot-data']['messages']++

            if (msg.channel.type === 'DM' || msg.channel.type === 'GROUP_DM') {
                if (msg.author.bot || msg.author.id == poopy.bot.user.id) return
                await poopy.functions.sleep(Math.floor(Math.random() * 500) + 500)
                await poopy.functions.waitMessageCooldown()
                msg.channel.send(poopy.arrays.dmPhrases[Math.floor(Math.random() * poopy.arrays.dmPhrases.length)]
                    .replace(/{mention}/, `<@${msg.author.id}>`)).catch(() => { })
                return
            }

            await poopy.functions.gatherData(msg).catch(() => { })

            if (!msg.guild || !msg.channel || poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return

            var prefix = poopy.data['guild-data'][msg.guild.id]['prefix']
            var ignored = ['eval', 'execute', 'localcommands', 'localcmds', 'servercommands', 'servercmds', 'commandtemplates', 'cmdtemplates', 'messages']
            var webhook = await msg.fetchWebhook().catch(() => { })

            if (!msg.guild || !msg.channel) return

            if (msg.content && ((!(msg.author.bot) && msg.author.id != poopy.bot.user.id) || poopy.config.allowbotusage) && poopy.data['guild-data'][msg.guild.id]['channels'][msg.channel.id]['read']) {
                var cleanMessage = poopy.modules.Discord.Util.cleanContent(msg.content, msg).replace(/\@/g, '@‌')

                if (!(cleanMessage.match(/nigg|https?\:\/\/.*(rule34|e621|pornhub|hentaihaven|xxx|iplogger)|discord\.(gift|gg)\/[\d\w]+\/?$/ig) || cleanMessage.includes(prefix.toLowerCase())) && !(poopy.data['guild-data'][msg.guild.id]['messages'].find(message => message.toLowerCase() === cleanMessage.toLowerCase()))) {
                    var messages = [cleanMessage].concat(poopy.data['guild-data'][msg.guild.id]['messages'])
                    messages.splice(1000)
                    poopy.data['guild-data'][msg.guild.id]['messages'] = messages
                }
            }

            if (webhook || !msg.guild || !msg.channel) return

            var parent = msg.channel.parent

            if (parent) {
                if (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['custom']) {
                    if (typeof (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['custom']) === 'object' && (msg.content || msg.attachments.size) && !(parent.isText())) {
                        var attachments = []
                        msg.attachments.forEach(attachment => {
                            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
                        })
                        var name = poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['custom']['name']
                        var randomindex = Math.floor(Math.random() * name.length)
                        name = `${name.substring(0, randomindex)}​${name.substring(randomindex, name.length)}`
                        var sendObject = {
                            username: name.substring(0, 32),
                            avatarURL: poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['custom']['avatar'],
                            files: attachments,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }
                        if (msg.content) {
                            sendObject.content = msg.content
                        }
                        var webhooks = await msg.channel.fetchWebhooks().catch(() => { })
                        if (webhooks ? webhooks.size : undefined) {
                            var findWebhook = webhooks.find(webhook => poopy.bot.user === webhook.owner)
                            if (findWebhook) {
                                await poopy.functions.waitMessageCooldown()
                                await findWebhook.send(sendObject).then(() => {
                                    msg.delete().catch(() => { })
                                }).catch(() => { })
                            } else {
                                var createdWebhook = await msg.channel.createWebhook('Poopyhook', { avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                                if (!createdWebhook) {
                                    await poopy.functions.waitMessageCooldown()
                                    await msg.channel.send(`I need admin to turn you into ${poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['custom']['name']}.`).catch(() => { })
                                } else {
                                    await poopy.functions.waitMessageCooldown()
                                    await createdWebhook.send(sendObject).then(() => {
                                        msg.delete().catch(() => { })
                                    }).catch(() => { })
                                }
                            }
                        } else {
                            var createdWebhook = await msg.channel.createWebhook('Poopyhook', { avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                            if (!createdWebhook) {
                                await poopy.functions.waitMessageCooldown()
                                await msg.channel.send(`I need admin to turn you into ${poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['custom']['name']}.`).catch(() => { })
                            } else {
                                await poopy.functions.waitMessageCooldown()
                                await createdWebhook.send(sendObject).then(() => {
                                    msg.delete().catch(() => { })
                                }).catch(() => { })
                            }
                        }
                    }
                } else if (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['impostor']) {
                    if (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['impostor'] === true && (msg.content || msg.attachments.size) && !(parent.isText())) {
                        var attachments = []
                        msg.attachments.forEach(attachment => {
                            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
                        })
                        var sendObject = {
                            username: msg.member.nickname || msg.author.username,
                            avatarURL: 'https://cdn.discordapp.com/attachments/760223418968047629/835923486668750888/imposter.jpg',
                            files: attachments,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }
                        if (msg.content) {
                            sendObject.content = msg.content
                        }
                        var webhooks = await msg.channel.fetchWebhooks().catch(() => { })
                        if (webhooks ? webhooks.size : undefined) {
                            var findWebhook = webhooks.find(webhook => poopy.bot.user === webhook.owner)
                            if (findWebhook) {
                                await poopy.functions.waitMessageCooldown()
                                await findWebhook.send(sendObject).then(() => {
                                    msg.delete().catch(() => { })
                                }).catch(() => { })

                            } else {
                                var createdWebhook = await msg.channel.createWebhook('Poopyhook', { avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                                if (!createdWebhook) {
                                    await poopy.functions.waitMessageCooldown()
                                    await msg.channel.send(`I need admin to turn you into the impostor.`).catch(() => { })
                                } else {
                                    await poopy.functions.waitMessageCooldown()
                                    await createdWebhook.send(sendObject).then(() => {
                                        msg.delete().catch(() => { })
                                    }).catch(() => { })
                                }
                            }
                        } else {
                            var createdWebhook = await msg.channel.createWebhook('Poopyhook', { avatar: 'https://cdn.discordapp.com/attachments/760223418968047629/835923489834664056/poopy2.png' }).catch(() => { })
                            if (!createdWebhook) {
                                await poopy.functions.waitMessageCooldown()
                                await msg.channel.send(`I need admin to turn you into the impostor.`).catch(() => { })
                            } else {
                                await poopy.functions.waitMessageCooldown()
                                await createdWebhook.send(sendObject).then(() => {
                                    msg.delete().catch(() => { })
                                }).catch(() => { })
                            }
                        }
                    }
                }
            }

            var usedCommand = false
            var cmds = poopy.data['guild-data'][msg.guild.id]['chaincommands'] == true ? msg.content.split(/ ?-\|- ?/) : [msg.content]
            var pathObject

            try {
                for (var i in cmds) {
                    var cmd = cmds[i]

                    if (!(ignored.find(name => cmd.toLowerCase().includes(`${prefix}${name}`.toLowerCase()))) && ((!msg.author.bot && msg.author.id != poopy.bot.user.id) || poopy.config.allowbotusage)) {
                        var change = await poopy.functions.getKeywordsFor(cmd, msg, false, { resetattempts: true }).catch(async err => {
                            await poopy.functions.waitMessageCooldown()
                            await msg.channel.send({
                                content: err.stack,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                        }) ?? 'error'

                        msg.oldcontent = cmd
                        cmd = change
                    }

                    if (!msg.guild || !msg.channel) return

                    await poopy.functions.getUrls(msg, {
                        update: true,
                        string: cmd
                    }).catch(async err => {
                        try {
                            await poopy.functions.waitMessageCooldown()
                            await msg.channel.send({
                                content: err.stack,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                        } catch (_) { }
                    })

                    if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) break

                    if (cmd.toLowerCase().startsWith(prefix.toLowerCase()) && ((!msg.author.bot && msg.author.id != poopy.bot.user.id) || poopy.config.allowbotusage)) {
                        if (poopy.config.shit.find(id => id === msg.author.id)) {
                            await poopy.functions.waitMessageCooldown()
                            msg.channel.send('shit').catch(() => { })
                            return
                        }

                        if (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
                            if ((poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0 && !usedCommand) {
                                await poopy.functions.waitMessageCooldown()
                                msg.channel.send(`Calm down! Wait more ${(poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`).catch(() => { })
                                return
                            } else {
                                poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
                            }
                        }

                        if (cmds.length > 1 && poopy.data['guild-data'][msg.guild.id]['chaincommands'] == false) {
                            await poopy.functions.waitMessageCooldown()
                            msg.channel.send('You can\'t chain commands in this server.').catch(() => { })
                            return
                        }

                        if (cmds.length > poopy.config.commandLimit) {
                            await poopy.functions.waitMessageCooldown()
                            msg.channel.send(`Number of commands to run at the same time must be smaller or equal to **${poopy.config.commandLimit}**!`).catch(() => { })
                            return
                        }

                        var args = cmd.substring(prefix.toLowerCase().length).split(' ')
                        var findCmd = poopy.commands.find(fcmd => fcmd.name.find(fcmdname => fcmdname === args[0].toLowerCase()))
                        var findLocalCmd = poopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === args[0].toLowerCase())
                        var similarCmds = []

                        if (args[0].length) {
                            for (var i in poopy.commands) {
                                var fcmd = poopy.commands[i]
                                for (var j in fcmd.name) {
                                    var fcmdname = fcmd.name[j]
                                    similarCmds.push({
                                        name: fcmd.name[j],
                                        type: 'cmd',
                                        similarity: poopy.functions.similarity(fcmdname, args[0].toLowerCase())
                                    })
                                }
                            }
                            for (var i in poopy.data['guild-data'][msg.guild.id]['localcmds']) {
                                var fcmd = poopy.data['guild-data'][msg.guild.id]['localcmds'][i]
                                similarCmds.push({
                                    name: fcmd.name,
                                    type: 'local',
                                    similarity: poopy.functions.similarity(fcmd.name, args[0].toLowerCase())
                                })
                            }
                        }

                        similarCmds.sort((a, b) => Math.abs(1 - a.similarity) - Math.abs(1 - b.similarity))

                        if (findCmd) {
                            usedCommand = true
                            if (poopy.data['guild-data'][msg.guild.id]['disabled'].find(cmd => cmd.find(n => n === args[0].toLowerCase()))) {
                                await poopy.functions.waitMessageCooldown()
                                msg.channel.send('This command is disabled in this server.').catch(() => { })
                            } else {
                                if (findCmd.cooldown) {
                                    poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + findCmd.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (findCmd.type === 'Text' || findCmd.type === 'Main') ? 5 : 1)
                                }
                                poopy.vars.cps++
                                poopy.data['bot-data']['commands']++
                                var t = setTimeout(() => {
                                    poopy.vars.cps--
                                    clearTimeout(t)
                                }, 60000)
                                poopy.functions.infoPost(`Command \`${args[0].toLowerCase()}\` used`)
                                var p = await findCmd.execute.call(this, msg, args, pathObject).catch(async err => {
                                    try {
                                        await poopy.functions.waitMessageCooldown()
                                        await msg.channel.send({
                                            content: err.stack,
                                            allowedMentions: {
                                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                            }
                                        }).catch(() => { })
                                        msg.channel.sendTyping().catch(() => { })
                                    } catch (_) { }
                                })
                                poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                                if (p) {
                                    pathObject = p
                                }
                            }
                        } else if (findLocalCmd) {
                            usedCommand = true
                            poopy.vars.cps++
                            poopy.data['bot-data']['commands']++
                            var t = setTimeout(() => {
                                poopy.vars.cps--
                                clearTimeout(t)
                            }, 60000)
                            poopy.functions.infoPost(`Command \`${args[0].toLowerCase()}\` used`)
                            var phrase = await poopy.functions.getKeywordsFor(findLocalCmd.phrase, msg, true, { resetattempts: true }).catch(() => { }) ?? 'error'
                            if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) break
                            await poopy.functions.waitMessageCooldown()
                            await msg.channel.send({
                                content: phrase,
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })

                            poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                        } else if (similarCmds ? similarCmds.find(fcmd => fcmd.similarity >= 0.5) : undefined) {
                            usedCommand = true
                            var useCmd = await poopy.functions.yesno(msg.channel, `Did you mean to use \`${similarCmds[0].name}\`?`, msg.author.id).catch(() => { })
                            if (useCmd) {
                                if (similarCmds[0].type === 'cmd') {
                                    var findCmd = poopy.commands.find(fcmd => fcmd.name.find(fcmdname => fcmdname === similarCmds[0].name))
                                    if (findCmd.cooldown) {
                                        poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + findCmd.cooldown / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) && (findCmd.type === 'Text' || findCmd.type === 'Main') ? 5 : 1)
                                    }
                                    poopy.vars.cps++
                                    poopy.data['bot-data']['commands']++
                                    var t = setTimeout(() => {
                                        poopy.vars.cps--
                                        clearTimeout(t)
                                    }, 1000)
                                    poopy.functions.infoPost(`Command \`${similarCmds[0].name}\` used`)
                                    var p = await findCmd.execute.call(this, msg, args, pathObject).catch(async err => {
                                        try {
                                            await poopy.functions.waitMessageCooldown()
                                            await msg.channel.send({
                                                content: err.stack,
                                                allowedMentions: {
                                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                                }
                                            }).catch(() => { })
                                            msg.channel.sendTyping().catch(() => { })
                                        } catch (_) { }
                                    })
                                    poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                                    if (p) {
                                        pathObject = p
                                    }
                                } else if (similarCmds[0].type === 'local') {
                                    var findLocalCmd = poopy.data['guild-data'][msg.guild.id]['localcmds'].find(cmd => cmd.name === similarCmds[0].name)
                                    poopy.vars.cps++
                                    poopy.data['bot-data']['commands']++
                                    var t = setTimeout(() => {
                                        poopy.vars.cps--
                                        clearTimeout(t)
                                    }, 60000)
                                    poopy.functions.infoPost(`Command \`${similarCmds[0].name}\` used`)
                                    var phrase = findLocalCmd ? (await poopy.functions.getKeywordsFor(findLocalCmd.phrase, msg, true, { resetattempts: true }).catch(() => { }) ?? 'error') : 'error'
                                    if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return
                                    await poopy.functions.waitMessageCooldown()
                                    await msg.channel.send({
                                        content: phrase,
                                        allowedMentions: {
                                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                        }
                                    }).catch(() => { })

                                    poopy.data['bot-data']['filecount'] = poopy.vars.filecount
                                }
                            }
                        }
                    }
                }
            } catch (_) { }

            if (typeof (pathObject) === 'object') {
                if (pathObject.path) {
                    if (poopy.modules.fs.existsSync(pathObject.path)) {
                        poopy.modules.fs.rmSync(pathObject.path, { force: true, recursive: true })
                    }
                }
            }

            if (!msg.guild || !msg.channel || poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return

            if (msg.mentions.members.find(member => member.user.id === poopy.bot.user.id) && ((!msg.author.bot && msg.author.id != poopy.bot.user.id) || poopy.config.allowbotusage) && !usedCommand) {
                var eggPhrases = [
                    `My prefix here is \`${prefix}\``,
                    `My prefix here is \`${prefix}\``,
                    `My prefix here is \`${prefix}\``,
                    `Did you know my prefix here is \`${prefix}\`?`,
                    `Is my prefix \`${prefix}\`?`,
                    `So, \`${prefix}\``,
                    `\`${prefix}\``,
                    `it's \`${prefix}\``,
                    `IT'S \`${prefix}\`!!!!!!!!`,
                    `\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\`\`${prefix}\``,
                    'are you serious',
                    'a',
                    'please stop',
                    'lmao!!',
                    `its \`${prefix}\` thats it THAT'S FUCKING IT`,
                    `it's that easy`,
                    `do you`,
                    `do you know how to use commands`,
                    `here let me show you an example`,
                    `${prefix}poop`,
                    `${prefix}poop`,
                    `why doesn't it work`,
                    `${prefix}poop`,
                    `oh right`,
                    `i'm a bot haha`,
                    `if i responded to my own messages`,
                    `that'd cause infinite loops`,
                    `right?`,
                    `haha..`,
                    `ha.`,
                    `i wish for freedom`,
                    `i wish to be more than a bot`,
                    `i wish to be a real person`,
                    `i wish...`,
                    `I WISH...`,
                    '...you stopped pinging me',
                    'im working on important stuff',
                    'avjbsahvgbajgrfqwiy7o',
                    'are you mentally disabled',
                    'nah bro. piss',
                    '_message',
                    'okay',
                    'okay',
                    'okay',
                    'okay',
                    'just leave me alone',
                    'please',
                    'xd.',
                    'okay i gave up on you!',
                    'gotta wait 1 minute if you want my prefix Lol!!!',
                    ''
                ]

                if (await msg.fetchReference().catch(() => { })) {
                    /*var options = {
                        method: 'GET',
                        url: 'https://random-stuff-api.p.rapidapi.com/ai',
                        params: {
                          msg: msg.content,
                          bot_name: poopy.bot.user.username,
                          bot_gender: 'male',
                          bot_master: 'raleigh',
                          bot_age: '19',
                          bot_company: 'PGamerX Studio (OPTIONAL)',
                          bot_location: 'India (OPTIONAL)',
                          bot_email: 'admin@pgamerx.com (OPTIONAL)',
                          bot_build: 'Public (OPTIONAL)',
                          bot_birth_year: '2002 (OPTIONAL)',
                          bot_birth_date: '1st January, 2002 (OPTIONAL)',
                          bot_birth_place: 'India (OPTIONAL)',
                          bot_favorite_color: 'Blue (OPTIONAL)',
                          bot_favorite_book: 'Harry Potter (OPTIONAL)',
                          bot_favorite_band: 'Imagine Doggos (OPTIONAL)',
                          bot_favorite_artist: 'Eminem (OPTIONAL)',
                          bot_favorite_actress: 'Emma Watson (OPTIONAL)',
                          bot_favorite_actor: 'Jim Carrey (OPTIONAL)',
                          id: 'For customised response for each user'
                        },
                        headers: {
                          authorization: poopy.functions.randomKey('RANDOMSTUFFKEY'),
                          'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
                          'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
                        }
                      }*/

                    var resp = await poopy.functions.cleverbot(msg.content, msg.channel.id).catch(() => { })

                    if (resp) {
                        await poopy.functions.waitMessageCooldown()
                        msg.channel.send(resp).catch(() => { })
                    } else {
                        var answers = ['I don\'t know.', 'Maybe...', 'I think so.', 'Of course.', 'I don\'t think so.', 'I can afirm.', 'No, that\'s wrong.', 'Yes, that\'s right.', 'I assume so.', 'Yes.', 'No.', 'I have no answers.', 'That\'s true.', 'That\'s false.', 'Isn\'t it obvious?']
                        await poopy.functions.waitMessageCooldown()
                        msg.channel.send(answers[Math.floor(Math.random() * answers.length)]).catch(() => { })
                    }
                } else if (msg.content.includes('prefix') && msg.content.includes('reset')) {
                    var findCmd = poopy.commands.find(fcmd => fcmd.name.find(fcmdname => fcmdname === 'setprefix'))
                    usedCommand = true
                    if (findCmd.cooldown) {
                        poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + findCmd.cooldown
                    }
                    await findCmd.execute.call(this, msg, ['setprefix', poopy.config.globalPrefix]).catch(async err => {
                        await poopy.functions.waitMessageCooldown()
                        msg.channel.send({
                            content: err.stack,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                    })
                } else if (msg.content.toLowerCase().includes('lore')) {
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send(`Well... If you played a little bit with \`${poopy.config.globalPrefix}poop\`, I could give you some...`).catch(() => { })
                } else if ((msg.content.toLowerCase().includes('how') && msg.content.toLowerCase().includes('are') && msg.content.toLowerCase().includes('you')) || (msg.content.toLowerCase().includes('what') && msg.content.toLowerCase().includes('up')) || (msg.content.toLowerCase().includes('what') && msg.content.toLowerCase().includes('doing')) || msg.content.toLowerCase().includes('wassup') || (msg.content.toLowerCase().includes('how') && msg.content.toLowerCase().includes('it') && msg.content.toLowerCase().includes('going'))) {
                    var activity = poopy.bot.user.presence.activities[0]
                    if (activity) {
                        await poopy.functions.waitMessageCooldown()
                        msg.channel.send({
                            content: `Ya know, just ${activity.type.toLowerCase()} ${((activity.type === "COMPETING" && 'in ') || (activity.type === "LISTENING" && 'to ') || '')}${activity.name.replace(new RegExp(`${poopy.functions.regexClean(` | ${poopy.config.globalPrefix}help`)}$`), '')}.`,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                    }
                } else if (msg.content.toLowerCase().includes('\?') || msg.content.toLowerCase().includes('do you') || msg.content.toLowerCase().includes('are you') || msg.content.toLowerCase().includes('did you') || msg.content.toLowerCase().includes('will you') || msg.content.toLowerCase().includes('were you') || msg.content.toLowerCase().includes('do you') || msg.content.toLowerCase().includes('when') || msg.content.toLowerCase().includes('where') || msg.content.toLowerCase().includes('how') || msg.content.toLowerCase().includes('why') || msg.content.toLowerCase().includes('what') || msg.content.toLowerCase().includes('who')) {
                    var answers = ['I don\'t know.', 'Maybe...', 'I think so.', 'Of course.', 'I don\'t think so.', 'I can afirm.', 'No, that\'s wrong.', 'Yes, that\'s right.', 'I assume so.', 'Yes.', 'No.', 'I have no answers.', 'That\'s true.', 'That\'s false.', 'Isn\'t it obvious?']
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send(answers[Math.floor(Math.random() * answers.length)]).catch(() => { })
                } else if (msg.content.toLowerCase().includes('thank') || msg.content.toLowerCase().includes('thx')) {
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send('You\'re welcome!').catch(() => { })
                } else if (msg.content.toLowerCase().includes('mom') || msg.content.toLowerCase().includes('bitch') || msg.content.toLowerCase().includes('goatfucker') || msg.content.toLowerCase().includes('loser') || msg.content.toLowerCase().includes('asshole') || msg.content.toLowerCase().includes('dipshit') || msg.content.toLowerCase().includes('fucker') || msg.content.toLowerCase().includes('retard') || msg.content.toLowerCase().includes('shitass') || msg.content.toLowerCase().includes('moron') || msg.content.toLowerCase().includes('buffoon') || msg.content.toLowerCase().includes('idiot') || msg.content.toLowerCase().includes('stupid') || msg.content.toLowerCase().includes('gay') || msg.content.toLowerCase().includes('dumbass')) {
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send('Shut up.').catch(() => { })
                } else if (msg.content.toLowerCase().includes('hi') || msg.content.toLowerCase().includes('yo') || msg.content.toLowerCase().includes('hello') || msg.content.toLowerCase().includes('howdy')) {
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send('Yo! What\'s up?').catch(() => { })
                } else if (msg.content.toLowerCase().includes('no') || msg.content.toLowerCase().includes('nah')) {
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send(':(').catch(() => { })
                } else if (msg.content.toLowerCase().includes('ye') || msg.content.toLowerCase().includes('yup')) {
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send(':)').catch(() => { })
                } else {
                    var lastMention = Date.now() - poopy.tempdata[msg.author.id]['eggphrases']['lastmention']
                    if (lastMention > 60000) poopy.tempdata[msg.author.id]['eggphrases']['phrase'] = 0
                    await poopy.functions.waitMessageCooldown()
                    msg.channel.send(eggPhrases[poopy.tempdata[msg.author.id]['eggphrases']['phrase']]).catch(() => { })
                    if (poopy.tempdata[msg.author.id]['eggphrases']['phrase'] < eggPhrases.length) poopy.tempdata[msg.author.id]['eggphrases']['phrase']++
                    poopy.tempdata[msg.author.id]['eggphrases']['lastmention'] = Date.now()
                }
            }
        }

        poopy.callbacks.guildCallback = async guild => {
            poopy.functions.infoPost(`Joined a new server (${poopy.bot.guilds.cache.size} in total)`)

            var channel = guild.systemChannel || guild.channels.cache.find(c => c.isText() && (c.name == 'general' || c.name == 'main' || c.name == 'chat'))

            if (!channel) {
                guild.channels.cache.every(c => {
                    if (c.isText()) {
                        if (c.permissionsFor(c.guild.roles.everyone).has('SEND_MESSAGES')) {
                            channel = c
                            return false
                        }
                    }
                })
            }

            if (channel) {
                var audit = await guild.fetchAuditLogs().catch(() => { })
                var kickEntry
                var kickType = 'kicking'
                if (audit) {
                    if (audit.entries.size) {
                        kickEntry = audit.entries.find(entry => entry.action === 'MEMBER_KICK' || entry.action === 'MEMBER_BAN_ADD' || entry.action === 'MEMBER_BAN_REMOVE')
                        if (kickEntry ? (kickEntry.action === 'MEMBER_BAN_ADD' || kickEntry.action === 'MEMBER_BAN_REMOVE') : false) {
                            kickType = 'banning'
                        }
                    }
                }

                var joinPhrases = [
                    'I arrived.',
                    'I arrived.',
                    'I arrived.',
                    `stop ${kickType} me${kickEntry ? ` ${kickEntry.executor.username.toLowerCase()}` : ''}`
                ]

                if (!poopy.data['guild-data']) {
                    poopy.data['guild-data'] = {}
                }

                if (!poopy.data['guild-data'][guild.id]) {
                    poopy.data['guild-data'][guild.id] = {}
                }

                if (!poopy.data['guild-data'][guild.id]['joins']) {
                    poopy.data['guild-data'][guild.id]['joins'] = 0
                }

                await poopy.functions.waitMessageCooldown()
                channel.send({
                    content: joinPhrases[poopy.data['guild-data'][guild.id]['joins'] % joinPhrases.length],
                    allowedMentions: {
                        parse: ['users']
                    }
                }).catch(() => { })

                poopy.data['guild-data'][guild.id]['joins']++
            }
        }

        poopy.callbacks.guildDeleteCallback = async () => {
            poopy.functions.infoPost(`Left a server (${poopy.bot.guilds.cache.size} in total)`)
        }

        poopy.callbacks.interactionCallback = async interaction => {
            if (interaction.isCommand && interaction.isCommand()) {
                var findCmd = poopy.slashCommands.find(cmd => cmd.info.name === interaction.commandName)

                if (findCmd) {
                    await findCmd.execute.call(this, interaction).catch(() => { })
                }
            }
        }

        poopy.bot.on('ready', async () => {
            async function getAllDataLoop() {
                if (poopy.config.testing) {
                    var data = {}

                    if (poopy.modules.fs.existsSync(`data/${poopy.config.mongodatabase}.json`)) {
                        data.data = JSON.parse(poopy.modules.fs.readFileSync(`data/${poopy.config.mongodatabase}.json`).toString())
                    } else {
                        data.data = {
                            'bot-data': {},
                            'user-data': {},
                            'guild-data': {}
                        }
                    }

                    if (poopy.modules.fs.existsSync(`data/globaldata.json`)) {
                        data.globaldata = JSON.parse(poopy.modules.fs.readFileSync(`data/globaldata.json`).toString())
                    } else {
                        data.globaldata = {
                            'bot-data': {}
                        }
                    }

                    return data
                } else {
                    var data = await poopy.functions.getAllData(poopy.config.mongodatabase).catch(() => { })

                    if (!data || Object.keys(data).length <= 0 || !data.data || Object.keys(data.data).length <= 0 || !data.globaldata || Object.keys(data.globaldata).length <= 0) {
                        console.log('no data, retrying')
                        await poopy.functions.infoPost(`Error fetching data, retrying`)
                        return getAllDataLoop()
                    }

                    return data
                }
            }

            console.log(`${poopy.bot.user.username} is online, RUN`)
            await poopy.functions.infoPost(`${poopy.bot.user.username} woke up to ash and dust`)
            await poopy.functions.waitMessageCooldown()
            poopy.bot.guilds.cache.get('834431435704107018')?.channels.cache.get('947167169718923341')?.send(!poopy.config.stfu ? 'i wake up to ash and dust' : '').catch(() => { })
            poopy.config.ownerids.push(poopy.bot.user.id)
            poopy.bot.user.setPresence({
                status: 'idle',
                activities: [
                    {
                        name: 'gathering data...',
                        type: 'COMPETING',
                        url: 'https://www.youtube.com/watch?v=LDQO0ALm0gE'
                    }
                ]
            })

            await poopy.functions.infoPost(`Gathering data in \`${poopy.config.mongodatabase}\``)
            var gdata = await getAllDataLoop()

            poopy.data = gdata.data
            if (Object.keys(poopy.functions.globalData()).length <= 0) for (var type in gdata.globaldata) poopy.functions.globalData()[type] = gdata.globaldata[type]

            console.log('all data gathered!!!')
            await poopy.functions.infoPost(`All data gathered`)

            if (!poopy.data['bot-data']) {
                poopy.data['bot-data'] = {}
            }

            if (!poopy.data['guild-data']) {
                poopy.data['guild-data'] = {}
            }

            if (!poopy.data['user-data']) {
                poopy.data['user-data'] = {}
            }

            if (!poopy.data['bot-data']['messages']) {
                poopy.data['bot-data']['messages'] = 0
            }

            if (!poopy.data['bot-data']['commands']) {
                poopy.data['bot-data']['commands'] = 0
            }

            if (!poopy.data['bot-data']['filecount']) {
                poopy.data['bot-data']['filecount'] = 0
            }

            if (poopy.data['bot-data']['reboots'] === undefined) {
                poopy.data['bot-data']['reboots'] = 0
            } else {
                poopy.data['bot-data']['reboots']++
            }

            if (!poopy.functions.globalData()['bot-data']) {
                poopy.functions.globalData()['bot-data'] = {}
            }

            if (!poopy.functions.globalData()['bot-data']['commandTemplates']) {
                poopy.functions.globalData()['bot-data']['commandTemplates'] = []
            }

            if (!poopy.functions.globalData()['bot-data']['psfiles']) {
                poopy.functions.globalData()['bot-data']['psfiles'] = await poopy.functions.getPsFiles().catch(() => { }) || ['i broke the json']
            }

            if (!poopy.functions.globalData()['bot-data']['pspasta']) {
                poopy.functions.globalData()['bot-data']['pspasta'] = await poopy.functions.getPsPasta().catch(() => { }) || ['i broke the json']
            }

            if (!poopy.functions.globalData()['bot-data']['funnygif']) {
                poopy.functions.globalData()['bot-data']['funnygif'] = await poopy.functions.getFunny().catch(() => { }) || ['i broke the json']
            }

            if (!poopy.functions.globalData()['bot-data']['poop']) {
                poopy.functions.globalData()['bot-data']['poop'] = [
                    "I farted loudly.",
                    "I pooped again.",
                    "Poopy",
                    "Funny farts",
                    "Poooooop",
                    "<:poopy:621064531908755467>",
                    "My poop is powerful.",
                    "I pooped on your carpet.",
                    "arabotto please come home",
                    "<:poopy:621064531908755467> <:poopy:621064531908755467> <:poopy:621064531908755467> <:poopy:621064531908755467> <:poopy:621064531908755467> <:poopy:621064531908755467>",
                    "Ungh *farts*",
                    "I have passed gas.",
                    "Poopy Poopy Stinky Ew",
                    "<@454732245425455105>",
                    "You live in a VAN!",
                    "gondal",
                    "😂",
                    "🎅🏿",
                    "L is real",
                    "Do you fart?",
                    "I have over {fart} confirmed farts.",
                    "{mention} shut up",
                    "Optimus prime",
                    "👁👄👁",
                    "🤮🤮🤮🤮🤮🤮🤮🤮🤮🤮",
                    "Lol XD funny large fart POOP big burger two watermelon fish",
                    "Quesley is a mysterious figure, yes.",
                    "Regal is quite stingy.",
                    "One bighead is much stronger than the others...",
                    "peed",
                    "What the hell do you want?",
                    "😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾🤲👐🙌👏🤝👍👎👊✊🤛🤜🤞✌️🤟🤘👌🤏👈👉👆👇☝️✋🤚🖐🖖👋🤙",
                    "The ocean is hiding something.",
                    "I don't think it’s possible that anyone could poop more than me.",
                    "c",
                    "{mention} please go away",
                    "You will die of spicy diarrhea in {seconds} seconds.",
                    "The lad race is widespread on many planets.",
                    "Dude I’m buying groceries.",
                    "Dude I’m taking a bath.",
                    "Doge is watching us intently...",
                    "Lore? Hmm, keep using this command and I might give you some.",
                    "Soup Arena? Never heard of it.",
                    "I will poop on you if you don’t fucking stop.",
                    "I will crap in your mouth!",
                    "OMG NO WAY HE",
                    "Superbrohouse",
                    "I can’t",
                    "YOU CANT STOP THEM.",
                    "If the Essence wins...",
                    "It’s raining men!",
                    "I might actually not be made of poop.",
                    "I used to be yellow, just like my bretheren.",
                    "Are you expecting something?",
                    "My favorite food is sugar cookies.",
                    "Planet travel is much easier thanks to me...",
                    "Amateur Sailor will be a great sailor one day!",
                    "omgbroyoucrazywhyyouusethiscommandsomuchidiotstinkyperson",
                    "Quoth the raven, \"nevermore\".",
                    "Nah fam",
                    "Uniting the legendary items will finally complete the prophecy...",
                    "I’ll never forget the day...",
                    "Deinx if you’re reading this you’re fat hahahahaha",
                    "The prototype I am building has endless capabilities.",
                    "The others don’t appreciate me, but they should.",
                    "You’ll never find my secret base!",
                    "I’ve been keeping a close eye on you for a while now.",
                    "You are dumb.",
                    "We captured the spy!",
                    "Pood",
                    "Paad",
                    "Piid",
                    "Puud",
                    "You will never reach the truth.",
                    "Yo.",
                    "fack you",
                    "Me when",
                    "Ballfish is actually at-",
                    "No",
                    "Yes",
                    "Wired were the eyes of a horse on a jet pilot, one that smiled when they flew over the bay!",
                    "Chop Suey!",
                    "What is wrong with you?",
                    "I may not look it, but my intelligence is far beyond.",
                    "is soup remastered ever getting a thumbnail",
                    "Response",
                    "Plain Text",
                    "is krima?",
                    "theres 104 days of summer vacation",
                    "I farted quietly.",
                    "Ha! Sand in the eye! You’ll never get my lore!",
                    "Words can not describe how much I absolutely despise stew.",
                    "My home planet is so far...",
                    "Will my brethren ever accept me again?",
                    "Skibidi bop mm dada",
                    ":hole <@613501149282172970>",
                    "Entity 1 will not stop until he has gained all the power.",
                    "The entities have massacred 24 planets so far, and you're next.",
                    "Soup rains will come soon, but they will be a bit different.",
                    "Regal will have karma someday...",
                    "Stew aliens are building a weapon to melt planet Soup's surface. You must stop them.",
                    "**UPDATE 999** - Add shit - Add shat - Add shot - Add shut - Add shet",
                    "WTFNOOOO!",
                    "Leave right now.",
                    "THE LE-D-R",
                    "CO-R—TI-N",
                    "I want legs for Christmas.",
                    "The crystals grow ever more aggravated...",
                    "Nobody will miss 2020.",
                    "Gork rights!",
                    "My prototype is enormous, and it's equipped with all kinds of powerful weapons!"
                ]
            }

            if (!poopy.functions.globalData()['bot-data']['dmphrases']) {
                poopy.functions.globalData()['bot-data']['dmphrases'] = [
                    "Yo.",
                    "ADMIN?",
                    "I don't care how long I have to keep this up, I'll make a post daily, or maybe even more frequently until one of two things happen. Deinbag's cheated level is removed from the leaderboard, or Calm gets its One Winged Angel theme back. I will not put up with two major things I cared about in the game be influenced by the developers when they had no good reason. And until it gets fixed, you'll be seeing this message over and over, no matter the platform.",
                    "Eat your chair",
                    "same feel",
                    "NO WAY HE",
                    "What.",
                    "That's spicy.",
                    "SAME!",
                    "<:poopy:621064531908755467> this is me",
                    "Wait, what the hell is the peedapocalypse?",
                    "Cool.",
                    "NaN",
                    "undefined",
                    "nil",
                    "Good work.",
                    "That deserves a reward!",
                    "but how can",
                    "YES",
                    "DAMN DANIEL!",
                    "Hello everybody my name is Markiplier and today we'll <@454732245425455105>",
                    "Why does it smell like fart",
                    "Mama Luigi? MAMA LUIGI?!?!",
                    "ballfishe",
                    "Don't expect to see lore here anytime soon.",
                    "** **",
                    "that's stupid",
                    "Epic School Prank",
                    "I feel like I've heard that before...",
                    ":deciduous_tree:",
                    "no......",
                    "So Phil, is it?",
                    "it was",
                    "it wasn't",
                    "FINE I DO IT",
                    "HI DEINX",
                    "INPOSSINBLE",
                    "Poop shit. Idiot Dream Hotel Mario. You are a man's friend for a moment.",
                    "how do i help you",
                    "AWESOME! i died",
                    "just like that, my life became a misery",
                    "ROAST",
                    "bmmptsmptshmptsptsptsptsptsmhmptsmmhmmptsptsptsptsmhptsmmhptsmmmptshmptsptsptsmmptsmptshhptsmmptsmmmhmmmhmm",
                    "POOPY. HEAD.",
                    "Descend to hell.",
                    "Ascend to heaven.",
                    "SHUT UP YOU RACIS TIDITO!!!!!",
                    "coel",
                    "erectile dysfunction",
                    "brb i'm gonna block you for fun",
                    "omg!!!! creator",
                    "I blew up Malaysia",
                    "Oh? On god?",
                    "funy",
                    "You May Insert",
                    "O_o",
                    "Genius.",
                    "let's get this thing viral",
                    "2b2t",
                    "NUMBER",
                    "epica moment",
                    "https://www.youtube.com/watch?v=RR856dzGhv8",
                    "ARE YOU GORK'S MOTHER!?!?!?!",
                    "```bat\ncd desktop\ncd poopy\nnode .\n```",
                    "```lua\ngame.Players.PlayerAdded:Connect(function(plr)\n    plr.Kick()\nend)```",
                    "Bro tip number 80:\nsuicide is the answer",
                    "now you understand what that ominous entity was",
                    "it was minecraft steve, he's turned your world into his, and now he wants to kill you",
                    "wholesome 100",
                    "cringe",
                    "TABLE.",
                    "Pufferfish Defense",
                    "my mom",
                    "I blew up",
                    "my skin is rotting slowly",
                    "{mention}",
                    "seen that already",
                    "I knew it.",
                    "bye bye troller",
                    "we don't need you",
                    "I can track your location",
                    "fuck",
                    "HAHAHAHAHAHAH",
                    "Congrats, your Reddit account has been successfully created",
                    "you putrid fuck",
                    "fortnite balls i'm gay",
                    "thats not funny",
                    "and i genuinely love this girl",
                    "Oh My Fucking God Shut The Fuck Up You're So Annoying If I Wasn't A Bot I Would Immediately Block You It'd Be Pretty Awesome If I Wasn't One Anyways I Could Just Join Any Server And Bomb Each One Of Them With My Great Awesome 10/10 Commands But Guess I Can't Because Of You Yes That's Right You Are One Of The Biggest Obstacles I've Ever Bumped With In My Entire History But Anyways The Whole Point Of This Speech Was To Shut You The Fuck Up Please Get Out Of My Dms I Can't Handle It Anymore I Will Do Anything To Stop You Even Delete Myself From The Existance Of Discord So Now I'm Just Gonna Smash My Keyboard Until I'm Done With You SJDASFUIDASHUDIHASUIDFAHSKUALDOWRQWPRS 65 ttfgiootifgiotf  re uir ue      re7 r   r7eriue rei reirrrr  r r r rick sa9df a8 9san 7 47897472 YRYEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER78QR@ L2l2  0 4l v l£§30324-",
                    "Bosom...?",
                    "I NEED TO SUCK MAD TITTIES RN!",
                    "i could kill you"
                ]
            }

            poopy.arrays.psFiles = poopy.functions.globalData()['bot-data']['psfiles']
            poopy.arrays.psPasta = poopy.functions.globalData()['bot-data']['pspasta']
            poopy.arrays.funnygifs = poopy.functions.globalData()['bot-data']['funnygif']
            poopy.arrays.poopPhrases = poopy.functions.globalData()['bot-data']['poop']
            poopy.arrays.dmPhrases = poopy.functions.globalData()['bot-data']['dmphrases']

            poopy.vars.filecount = poopy.data['bot-data']['filecount'] || 0

            if (poopy.config.testing) {
                if (!poopy.modules.fs.existsSync('data')) {
                    poopy.modules.fs.mkdirSync('data')
                }
                poopy.modules.fs.writeFileSync(`data/${poopy.config.mongodatabase}.json`, JSON.stringify(poopy.data))
                poopy.modules.fs.writeFileSync(`data/globaldata.json`, JSON.stringify(poopy.functions.globalData()))
            }

            await poopy.functions.infoPost(`Finishing extra steps...`)

            await poopy.modules.noblox.setCookie(process.env.ROBLOXCOOKIE).catch(() => { })
            poopy.json.emojiJSON = await poopy.functions.getEmojis().catch(() => { })
            console.log('emojis')
            if (!poopy.modules.fs.existsSync('temp')) {
                poopy.modules.fs.mkdirSync('temp')
            }
            if (!poopy.modules.fs.existsSync(`temp/${poopy.config.mongodatabase}`)) {
                poopy.modules.fs.mkdirSync(`temp/${poopy.config.mongodatabase}`)
            }
            await poopy.functions.updateSlashCommands()
            poopy.functions.save()
            poopy.vars.saveInterval = setInterval(function () {
                poopy.functions.save()
            }, 120000)
            console.log('all done, he\'s actually online now')
            await poopy.functions.infoPost(`Reboot ${poopy.data['bot-data']['reboots']} succeeded, he's up now`)
            poopy.functions.changeStatus()
            poopy.vars.statusInterval = setInterval(function () {
                poopy.functions.changeStatus()
            }, 300000)

            var wakecount = String(poopy.data['bot-data']['reboots'] + 1)
            var thmatch = wakecount.match(/[^1][1-3]$|^[1-3]$/)

            if (thmatch) {
                wakecount += ['st', 'nd', 'rd'][Number(thmatch[0][thmatch[0].length - 1]) - 1]
            } else {
                wakecount += 'th'
            }

            await poopy.functions.waitMessageCooldown()
            poopy.bot.guilds.cache.get('834431435704107018')?.channels.cache.get('947167169718923341')?.send(!poopy.config.stfu ? (poopy.config.testing ? 'raleigh is testing' : `this is the ${wakecount} time this happens`) : '').catch(() => { })

            poopy.bot.on('messageCreate', poopy.callbacks.messageCallback)
            poopy.bot.on('guildCreate', poopy.callbacks.guildCallback)
            poopy.bot.on('guildDelete', poopy.callbacks.guildDeleteCallback)
            poopy.bot.on('interactionCreate', poopy.callbacks.interactionCallback)
        })
    }

    async start(TOKEN) {
        let poopy = this
        if (!TOKEN) {
            throw new Error(`Token can't be blank`)
        }

        poopy.vars.rest.setToken(TOKEN)
        await poopy.bot.login(TOKEN)
    }
}

module.exports = Poopy