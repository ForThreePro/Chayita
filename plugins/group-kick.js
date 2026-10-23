import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    let mentionedJid = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : null

    if (!mentionedJid) {
        await react('💀')
        let error = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐗𝐏𝐔𝐋𝐒𝐀𝐑 ﹒ USUARIO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 👢 —˙𖦹.꒷

── *📖 USO* ╏ 🎃
➛ Menciona a un usuario
➛ Responde al mensaje del usuario
👻 ➛ Chayita: apunta bien pe

── *📝 AVISO* ╏ 🎀
🔒 ➛ Solo admins

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        let ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        let user = participants.find(p => p.id === mentionedJid)
        let isAdmin = user?.admin

        if (mentionedJid === conn.user.jid) {
            await react('💀')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎃\n❌ ➛ No puedo exorcizarme a mí mismo\n👻 ➛ Chayita no se auto-banea\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭` }, { quoted: m })
        }
        if (mentionedJid === ownerGroup) {
            await react('💀')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎃\n❌ ➛ No puedo expulsar al propietario del grupo\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭` }, { quoted: m })
        }
        if (mentionedJid === ownerBot) {
            await react('💀')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎃\n❌ ➛ No puedo expulsar al dueño del bot\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭` }, { quoted: m })
        }
        if (isAdmin) {
            await react('💀')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎃\n❌ ➛ No puedo expulsar a un administrador\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭` }, { quoted: m })
        }

        await react('👢')
        await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove')

        let kickMsg = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐗𝐏𝐔𝐋𝐒𝐀𝐃𝐎 ﹒ USUARIO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 👢 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎃
👢 ➛ Usuario: @${mentionedJid.split('@')[0]}
👑 ➛ Por: @${m.sender.split('@')[0]}
👻 ➛ Chayita le dio su patada embrujada

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: kickMsg, mentions: [mentionedJid, m.sender] }, { quoted: m })
    } catch (e) {
        await react('💀')
        let error = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎃
❌ ➛ Se ha producido un problema
🔧 ➛ ${e.message}
👻 ➛ Chayita se asustó

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['kick @user']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler