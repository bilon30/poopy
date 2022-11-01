let modules = {}
let activeBots = require('./dataValues').activeBots

modules.Discord = [require('discord.js'), require('discord.js-selfbot-v14')]
modules.fs = require('fs-extra')
modules.nodefs = require('fs')
modules.archiver = require('archiver')
modules.fileType = require('file-type')
modules.axios = require('axios')
modules.request = require('request')
modules.FormData = require('form-data')
modules.cheerio = require('cheerio')
modules.xml2json = require('xml2js').parseStringPromise
modules.util = require('util')
modules.CryptoJS = require('crypto-js')
if (modules.fs.existsSync('node_modules/@jimp/plugin-print'))
    modules.fs.rmSync('node_modules/@jimp/plugin-print', {
        force: true, recursive: true
    })
if (!modules.fs.existsSync('node_modules/@jimp/plugin-print'))
    modules.fs.copySync('lib/plugin-print', 'node_modules/@jimp/plugin-print', {
        recursive: true
    })
modules.Jimp = require('jimp')
modules.whatwg = require('whatwg-url')
modules.catbox = require('catbox.moe')
modules.gis = require('g-i-s')
modules.mathjs = require('mathjs')
modules.prettyBytes = require('pretty-bytes')
modules.pluralize = require('pluralize')
modules.itob = require('istextorbinary')
modules.os = require('os')
modules.Collection = require('@discordjs/collection').Collection
modules.Rainmaze = require('../lib/rainmaze/Rainmaze')
modules.DMGuild = class DMGuild {
    constructor(msg) {
        let members = new modules.Collection([[msg.client.database, msg.client.user]].concat(
            msg.channel.recipients ?
                [...msg.channel.recipients] :
                [[msg.channel.recipient.id, msg.channel.recipient]]
        ))

        this.ownerId = msg.channel.ownerId || msg.channel.recipient.id
        this.id = msg.channel.id
        this.name = msg.channel.name || `${(msg.user || msg.author).username}'s DMs`
        this.fetchAuditLogs = async () => {
            return {
                entries: new modules.Collection()
            }
        }
        this.emojis = {
            cache: new modules.Collection()
        }
        this.channels = {
            cache: new modules.Collection([[msg.channel.id, msg.channel]])
        }
        this.members = {
            fetch: async (id) => members.get(id),
            resolve: (id) => members.get(id),
            cache: members
        }
    }
}

for (var Discord of modules.Discord) {
    const Guild = Discord.Guild
    const guildLeave = Guild.prototype.leave

    Guild.prototype.leave = async function leave() {
        let guild = this
        let client = guild.client
        let poopy = activeBots[client.database]
        let config = poopy.config

        if (config.public) return 'nvm'

        return guildLeave.call(guild)
    }

    const Channel = Discord.BaseGuildTextChannel
    const channelSend = Channel.prototype.send

    Channel.prototype.send = async function send(payload) {
        var channel = this
        let client = channel.client
        let poopy = activeBots[client.database]
        let tempdata = poopy.tempdata
        let {
            waitMessageCooldown,
            setMessageCooldown,
            getKeywordsFor
        } = poopy.functions

        await waitMessageCooldown()

        const channelData = tempdata[channel.guild?.id]?.[channel.id]

        if (channelData?.['shut']) return
        if (channelData?.['forceres'] && (typeof payload == 'object' ? (
            payload.content ||
            payload.files || payload.embeds ||
            payload.stickers
        ) : payload)) {
            var content = typeof payload == 'object' ? (payload.content ?? '') : payload
            var msg = channelData['forceres'].msg
            var res = await getKeywordsFor(channelData['forceres'].res, msg, true, {
                extrakeys: {
                    _msg: {
                        func: async () => {
                            return content
                        }
                    }
                }
            }).catch(() => { }) ?? channelData['forceres'].res

            switch (typeof payload) {
                case 'string':
                    payload = {
                        content: res,
                        allowedMentions: {
                            parse: ['users']
                        }
                    }
                    break;
                case 'object':
                    payload.content = res
                    break;
            }

            delete channelData['forceres']
        }

        return channelSend.call(channel, payload).then(setMessageCooldown)
    }

    const Message = Discord.Message
    const messageReply = Message.prototype.reply

    Message.prototype.reply = async function reply(payload) {
        var message = this
        let client = message.client
        let poopy = activeBots[client.database]
        let config = poopy.config
        let tempdata = poopy.tempdata
        let {
            waitMessageCooldown,
            setMessageCooldown,
            getKeywordsFor
        } = poopy.functions

        await waitMessageCooldown()

        const channelData = tempdata[message.guild?.id]?.[message.channel.id]

        if (channelData?.['shut']) return
        if (channelData?.['forceres'] && (typeof payload == 'object' ? (
            payload.content ||
            payload.files || payload.embeds ||
            payload.stickers
        ) : payload)) {
            var content = typeof payload == 'object' ? (payload.content ?? '') : payload
            var msg = channelData['forceres'].msg
            var res = await getKeywordsFor(channelData['forceres'].res, msg, true, {
                extrakeys: {
                    _msg: {
                        func: async () => {
                            return content
                        }
                    }
                }
            }).catch(() => { }) ?? channelData['forceres'].res

            switch (typeof payload) {
                case 'string':
                    payload = {
                        content: res,
                        allowedMentions: {
                            parse: ['users']
                        }
                    }
                    break;
                case 'object':
                    payload.content = res
                    break;
            }

            delete channelData['forceres']
        }

        if (config.allowbotusage || message.replied) return message.channel.send(payload).then(setMessageCooldown)
        else return message.replied = messageReply.call(message, payload).then(setMessageCooldown)
    }

    const Interaction = Discord.CommandInteraction
    const interactionReply = Interaction.prototype.reply

    Interaction.prototype.reply = async function reply(payload) {
        var interaction = this
        let client = interaction.client
        let poopy = activeBots[client.database]
        let config = poopy.config
        let tempdata = poopy.tempdata
        let {
            waitMessageCooldown,
            setMessageCooldown,
            getKeywordsFor
        } = poopy.functions

        await waitMessageCooldown()

        const channelData = tempdata[interaction.guild?.id]?.[interaction.channel.id]

        if (channelData?.['shut']) return
        if (channelData?.['forceres'] && (typeof payload == 'object' ? (
            payload.content ||
            payload.files || payload.embeds ||
            payload.stickers
        ) : payload)) {
            var content = typeof payload == 'object' ? (payload.content ?? '') : payload
            var msg = channelData['forceres'].msg
            var res = await getKeywordsFor(channelData['forceres'].res, msg, true, {
                extrakeys: {
                    _msg: {
                        func: async () => {
                            return content
                        }
                    }
                }
            }).catch(() => { }) ?? channelData['forceres'].res

            switch (typeof payload) {
                case 'string':
                    payload = {
                        content: res,
                        allowedMentions: {
                            parse: ['users']
                        }
                    }
                    break;
                case 'object':
                    payload.content = res
                    break;
            }

            delete channelData['forceres']
        }

        if (config.allowbotusage || interaction.replied) return interaction.channel.send(payload).then(setMessageCooldown)
        else return interaction.replied = (!interaction.replied && interaction.deferred ?
            interaction.editReply(payload) :
            interactionReply.call(interaction, payload)).then(setMessageCooldown)
    }
}

if (process.env.DEEPAI_KEY) {
    modules.deepai = require('deepai')
    modules.deepai.setApiKey(process.env.DEEPAI_KEY)
}

if (process.env.GOOGLE_KEY) modules.google = require('googleapis').google
//if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET && process.env.TWITTER_ACCESSTOKEN_KEY && process.env.TWITTER_ACCESSTOKEN_SECRET) modules.Twitter = require('twitter')

module.exports = modules