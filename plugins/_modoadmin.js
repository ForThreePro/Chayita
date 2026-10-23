import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    // Validación de permisos para el comando
    if (!isAdmin &&!isOwner) throw `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 Solo los admins pueden usar este comando en la noche de brujas.`

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (/on/i.test(args[0])) {
        chat.modoadmin = true
        await conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐌𝐎𝐃𝐎 𝐀𝐃𝐌𝐈𝐍 ﹒ ON ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTIVADO\`\` ✅ —˙𖦹.꒷

── *📝 ESTADO* ╏ 🎃
✅ ➛ *Modo Administrador activado*
👻 ➛ Ahora solo los admins pueden usar el bot
🎀 ➛ Modo maldito activo

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`, m)
    } else if (/off/i.test(args[0])) {
        chat.modoadmin = false
        await conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐌𝐎𝐃𝐎 𝐀𝐃𝐌𝐈𝐍 ﹒ OFF ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`DESACTIVADO\`\` ❌ —˙𖦹.꒷

── *📝 ESTADO* ╏ 🎃
❌ ➛ *Modo Administrador desactivado*
👻 ➛ Todos pueden usar el bot de nuevo

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`, m)
    } else {
        await conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐌𝐎𝐃𝐎 𝐀𝐃𝐌𝐈𝐍 ﹒ HELP ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`USO\`\` 📖 —˙𖦹.꒷

── *📖 COMANDOS* ╏ 🎃
➛ *.modoadmin on* - Activa modo solo admins
➛ *.modoadmin off* - Desactiva modo

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`, m)
    }
}

handler.help = ['modoadmin <on/off>']
handler.tags = ['config']
handler.command = /^(modoadmin|adminmode)$/i

handler.before = async function (m, { conn, isAdmin, isOwner, isROwner, isPrems }) {
    if (m.isBaileys || m.fromMe) return!0

    let chat = global.db.data.chats[m.chat]
    if (!chat) return!0

    if (m.isGroup) {
        if (chat.modoadmin &&!isAdmin &&!isOwner &&!isROwner &&!isPrems) {
            if (m.text.startsWith('.') || m.text.startsWith('/') || m.text.startsWith('#')) {
                return false
            }
        }
    } else {
        if (!isOwner &&!isROwner &&!isPrems) {
            // return false
        }
    }

    return!0
}

export default handler