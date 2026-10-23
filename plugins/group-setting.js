import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`

    let isClose = command === 'abrir' ? 'not_announcement' : 'announcement'
    let estado = command === 'abrir' ? 'ABIERTO 🟢🎀' : 'CERRADO 🔴💀'

    try {
        await conn.groupSettingUpdate(m.chat, isClose)
        await react(command === 'abrir' ? '🎀' : '💀')
        await conn.sendMessage(m.chat, { text: head + `\n${estado}\n👑 Por: @${m.sender.split('@')[0]} 👻`, mentions: [m.sender] }, { quoted: m })
    } catch {
        await react('💀')
        await m.reply(head + `\n💀 No se pudo cambiar. ¿Soy admin?`, m)
    }
}

handler.help = ['abrir','cerrar']
handler.tags = ['grupo']
handler.command = ['abrir','cerrar']
handler.admin = true
handler.botAdmin = true
handler.group = true
export default handler