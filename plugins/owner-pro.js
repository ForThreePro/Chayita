import { exec } from "child_process"
import moment from 'moment-timezone'
moment.locale('es')

const OWNER_NUMBER = "541128198851@s.whatsapp.net"

let handler = async (m, { conn, command }) => {
    if (m.sender !== OWNER_NUMBER) return

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const reply = (txt) => conn.sendMessage(m.chat, { text: head + `\n${txt}` + footer }, { quoted: m })

    if (command === 'reset') {
        await react('🔄')
        await reply(`🔄 Reiniciando la cripta... 🎀`)
        try { process.send('reset') } catch { process.exit(0) }
    }

    if (command === 'autoadmin') {
        try {
            await react('👑')
            await conn.groupParticipantsUpdate(m.chat, [OWNER_NUMBER], 'promote')
            await react('🎀')
            await conn.sendMessage(m.chat, { text: head + `\n👑 Admin embrujado asignado 🎀` + footer, mentions: [OWNER_NUMBER] }, { quoted: m })
        } catch {
            await react('💀')
            await reply(`💀 No se pudo dar admin. Hazme admin primero 👻`)
        }
    }

    if (['update','actualizar','fix'].includes(command)) {
        await react('🌀')
        await reply(`🌀 Invocando actualización... 🐭`)
        exec('git pull', async (err, stdout, stderr) => {
            if (err) { await react('💀'); return reply(`💀 Error en el hechizo`) }
            await react('🎀')
            let out = (stdout || '').trim()
            if (out.includes('Already up to date')) return reply(`🎀 Ya está embrujado al máximo`)
            return reply(`🎀 Actualizado:\n\`\`\`${out.slice(0, 800)}\`\`\``)
        })
    }
}

handler.help = ['reset','autoadmin','update']
handler.tags = ['owner']
handler.command = ['reset','autoadmin','update','actualizar','fix']
handler.rowner = true
export default handler