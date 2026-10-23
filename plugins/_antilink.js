const linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
const channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,30})/i

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!isAdmin &&!isOwner) throw "‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓_*\n\n꒰👻꒱ Solo los admins pueden usar este hechizo"

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (/on/i.test(args[0])) {
        chat.antiLink = true
        await conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐀𝐍𝐓𝐈-𝐋𝐈𝐍𝐊 ﹒ 𝐎𝐍 ：✿ 。
꒰ ◞⁺⊹ ．Activado

.⃟𖥔 ݁. 𖦹˙— \`\`PROTECCIÓN\`\` 🕸️ —˙𖦹.꒷

── *📊 ESTADO* ╏ 🎃
✅ ➛ Anti-Link: *Activado*
👻 ➛ Los enlaces serán exorcizados

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)
    } else if (/off/i.test(args[0])) {
        chat.antiLink = false
        await conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐀𝐍𝐓𝐈-𝐋𝐈𝐍𝐊 ﹒ 𝐎𝐅𝐅 ：✿ 。
꒰ ◞⁺⊹ ．Desactivado

.⃟𖥔 ݁. 𖦹˙— \`\`PROTECCIÓN\`\` 💀 —˙𖦹.꒷

── *📊 ESTADO* ╏ 🎃
❌ ➛ Anti-Link: *Desactivado*
🦇 ➛ Los enlaces están permitidos

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)
    } else {
        await conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐀𝐍𝐓𝐈-𝐋𝐈𝐍𝐊 ﹒ 𝐔𝐒𝐎 ：✿ 。

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🎀 ࣪ ꕀ.antilink on/off ˚. ᵎᵎ

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` 🕯️ —˙𖦹.꒷

── *📖 EJEMPLO* ╏ 🎃
👻 ➛.antilink on
👻 ➛.antilink off

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)
    }
}

handler.help = ['antilink <on/off>']
handler.tags = ['config']
handler.command = /^(antilink|antilinks)$/i

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return!0
    const botNumber = conn.user.jid
    if (m.sender === botNumber || m.fromMe || m.isBaileys) return!0

    const chat = global.db.data.chats[m.chat]
    if (!chat?.antiLink) return!0

    const isGroupLink = linkRegex.exec(m.text)
    const isChannelLink = channelLinkRegex.exec(m.text)

    if ((isGroupLink || isChannelLink) &&!isAdmin) {
        if (!isBotAdmin) return!0

        if (isGroupLink) {
            const groupCode = await conn.groupInviteCode(m.chat).catch(() => null)
            if (groupCode && m.text.includes(groupCode)) return!0
        }

        await conn.sendMessage(m.chat, { delete: m.key })
        await conn.reply(
            m.chat,
            `‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓 - 𝐀𝐍𝐓𝐈𝐋𝐈𝐍𝐊_*

꒰💀꒱ *Enlace prohibido detectado*
꒰👻꒱ @${m.sender.split('@')[0]} intentó invocar un portal prohibido

꒰🦇꒱ *Acción: Exorcismo del grupo*
꒰🕸️꒱ No se permiten enlaces en Halloween

> Trick or... ¡BAN! 🎃`,
            m,
            { mentions: [m.sender] }
        )
        return await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }
    return!0
}

export default handler