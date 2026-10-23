import moment from 'moment-timezone'
moment.locale('es')

let mutedUsers = new Set()

let handler = async (m, { conn, command, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`

    let mentionedJid = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false
    if (!mentionedJid) { await react('💀'); return m.reply(head+`\n💀 Menciona o responde a un usuario\nEj: *.mute @user*`, m) }

    if (participants.find(p=>p.id===mentionedJid)?.admin) { await react('💀'); return m.reply(head+`\n💀 No puedes exorcizar admins`, m) }
    if (mentionedJid===conn.user.jid) { await react('💀'); return m.reply(head+`\n💀 No puedo silenciarme`, m) }

    if (command==="mute") {
        if (mutedUsers.has(mentionedJid)) { await react('⚠️'); return m.reply(head+`\n⚠️ Ya está en el ataúd`, m) }
        mutedUsers.add(mentionedJid); await react('🔇')
        return conn.sendMessage(m.chat, { text: head+`\n🔇 Silenciado en la cripta: @${mentionedJid.split('@')[0]} 👻`, mentions:[mentionedJid] }, { quoted:m })
    } else {
        if (!mutedUsers.has(mentionedJid)) { await react('⚠️'); return m.reply(head+`\n⚠️ No está en la cripta`, m) }
        mutedUsers.delete(mentionedJid); await react('🔊')
        return conn.sendMessage(m.chat, { text: head+`\n🔊 Liberado del hechizo: @${mentionedJid.split('@')[0]} 🎀`, mentions:[mentionedJid] }, { quoted:m })
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender)) { try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {} }
}

handler.help = ['mute @user','unmute @user']
handler.tags = ['grupo']
handler.command = /^(mute|unmute)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler