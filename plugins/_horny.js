import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let defaultImg = 'https://files.evogb.win/n4InsB.jpg'
    let defaultBg = 'https://files.evogb.win/7BY3Yv.jpg'
    let key = 'proyectsV2'

    const toJid = (jid) => {
        if (!jid) return m.sender
        if (typeof jid === 'string') return jid
        if (typeof jid === 'object') return jid.sender || jid.id || jid.jid || m.sender
        return m.sender
    }

    const getAvatar = async (jid) => {
        jid = toJid(jid)
        try {
            let url = await conn.profilePictureUrl(jid, 'image')
            if(url && url.startsWith('https')) return url
        } catch {}
        return defaultImg
    }

    const getName = async (jid) => {
        jid = toJid(jid)
        let name = jid.split('@')[0]
        try {
            let n = await conn.getName(jid)
            if(n && n!== 'undefined') name = n
        } catch {}
        return name
    }

    const getMention = (jid) => toJid(jid).split('@')[0]

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    const stellarFetch = async (url) => {
        return await fetch(url, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/*'
            }
        })
    }

    // ===== HORNY =====
    if (m.text?.includes('horny')) {
        let who = toJid(m.mentionedJid[0] || m.quoted?.sender || m.sender)
        let pp = await getAvatar(who)
        let apiUrl = `https://api.stellarwa.xyz/generate/horny?avatar=${encodeURIComponent(pp)}&key=${key}`
        try {
            await react('🎀')
            await conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐇𝐎𝐑𝐍𝐘 ﹒ HORNY ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n.⃟𖥔 ݁. 𖦹˙— \`\`GENERANDO\`\` 😏 —˙𖦹.꒷\n\n👻 ➛ Generando... Fantasma mirando 👀`, mentions: [who] })
            let res = await stellarFetch(apiUrl)
            if(!res.ok) throw new Error("Status: " + res.status)
            let buffer = await res.buffer()
            await conn.sendMessage(m.chat, { image: buffer, caption: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n🔥 @${getMention(who)}\n\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, mentions: [who] })
        } catch (e) {
            await react('💀')
            m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 Error 500: La API se fue a pedir dulces. Intenta de nuevo`)
        }
    }

    // ===== SHIP =====
    if (m.text?.includes('ship')) {
        if (!m.isGroup) return m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 Solo grupos pe, como fantasmas solo en grupo`)
        let members = participants.map(u => toJid(u.id))
        let user1, user2
        if (m.mentionedJid.length >= 2) { user1 = toJid(m.mentionedJid[0]); user2 = toJid(m.mentionedJid[1]) }
        else { user1 = members[Math.floor(Math.random() * members.length)]; user2 = members[Math.floor(Math.random() * members.length)]; while(user1 === user2) user2 = members[Math.floor(Math.random() * members.length)] }

        await react('💘')
        await conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐒𝐇𝐈𝐏 ﹒ SHIP ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n.⃟𖥔 ݁. 𖦹˙— \`\`CALCULANDO\`\` 💘 —˙𖦹.꒷\n\n👻 ➛ Calculando amor... Chayita shippea 🕸️`, mentions: [user1, user2] })
        try {
            let avatar1 = await getAvatar(user1); let avatar2 = await getAvatar(user2)
            let apiUrl = `https://api.stellarwa.xyz/generate/ship?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}&background=${encodeURIComponent(defaultBg)}&key=${key}`
            let res = await stellarFetch(apiUrl)
            if(!res.ok) throw new Error("Status: " + res.status)
            let buffer = await res.buffer()
            let porcentaje = Math.floor(Math.random() * 101)
            await conn.sendMessage(m.chat, { image: buffer, caption: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💘 ${porcentaje}% - Chayita dice: ${porcentaje > 70? 'almas gemelas malditas' : 'mejor amigos embrujados'}\n\n🎀 *HALLOWEEN COQUETTE* 🐭`, mentions: [user1, user2] })
        } catch (e) {
            await react('💀')
            m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 Error 500: La API se asustó`)
        }
    }

    // ===== SECURITY =====
    if (m.text?.includes('security')) {
        let who = toJid(m.mentionedJid[0] || m.quoted?.sender || m.sender)
        let pp = await getAvatar(who)
        let createdTimestamp = Math.floor(Date.now() / 1000)
        let apiUrl = `https://api.stellarwa.xyz/generate/security?avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent(defaultBg)}&createdTimestamp=${createdTimestamp}&key=${key}`

        await react('🔍')
        await conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐒𝐄 𝐁𝐔𝐒𝐂𝐀 ﹒ SECURITY ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n.⃟𖥔 ݁. 𖦹˙— \`\`BUSCANDO\`\` 🚨 —˙𖦹.꒷\n\n👻 ➛ Generando... Se robó los dulces 🚨`, mentions: [who] })
        try {
            let res = await stellarFetch(apiUrl)
            if(!res.ok) throw new Error("Status: " + res.status)
            let buffer = await res.buffer()
            await conn.sendMessage(m.chat, { image: buffer, caption: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n🚨 @${getMention(who)} - Buscado por robar dulces de Halloween\n\n🎀 *HALLOWEEN COQUETTE* 🐭`, mentions: [who] })
        } catch (e) {
            await react('💀')
            m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 Error 500: ${e.message}`)
        }
    }

    // ===== RANK =====
    if (m.text?.includes('rank')) {
        let who = toJid(m.mentionedJid[0] || m.quoted?.sender || m.sender)
        let name = await getName(who)
        let pp = await getAvatar(who)
        let level = Math.floor(Math.random() * 100) + 1
        let rank = Math.floor(Math.random() * 500) + 1
        let currxp = Math.floor(Math.random() * 5000)
        let needxp = currxp + Math.floor(Math.random() * 2000) + 1000
        let apiUrl = `https://api.stellarwa.xyz/generate/rank2?username=${encodeURIComponent(name)}&avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent(defaultBg)}&level=${level}&rank=${rank}&currxp=${currxp}&needxp=${needxp}&key=${key}`

        await react('📊')
        await conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐑𝐀𝐍𝐊 ﹒ TARJETA ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n.⃟𖥔 ݁. 𖦹˙— \`\`GENERANDO\`\` 📊 —˙𖦹.꒷\n\n👻 ➛ Generando nivel... Nivel fantasma 🎃`, mentions: [who] })
        try {
            let res = await stellarFetch(apiUrl)
            if(!res.ok) throw new Error("Status: " + res.status)
            let buffer = await res.buffer()
            await conn.sendMessage(m.chat, { image: buffer, caption: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n📊 Nivel: ${level} - Nivel Fantasma: Pro en sustos\n\n🎀 *HALLOWEEN COQUETTE* 🐭`, mentions: [who] })
        } catch (e) {
            await react('💀')
            m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 Error 500: ${e.message}`)
        }
    }
}

handler.help = ['horny @tag', 'ship @tag1 @tag2', 'security @tag', 'rank @tag']
handler.tags = ['diversión']
handler.command = ['horny', 'ship', 'security', 'rank']
export default handler