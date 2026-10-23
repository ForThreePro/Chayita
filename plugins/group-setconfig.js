import moment from 'moment-timezone'
import crypto from 'crypto'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`

    if (command==='setabrir' || command==='setcerrar') {
        if (!m.quoted) { await react('💀'); return m.reply(head+`\n💀 Responde a un sticker con *.${command}*`) }
        try {
            let q = m.quoted
            let fileSha256 = q.msg?.fileSha256 || q.message?.stickerMessage?.fileSha256
            if (!fileSha256) fileSha256 = crypto.createHash('sha256').update(await q.download()).digest()
            let hash = Buffer.from(fileSha256).toString('base64')
            if (command==='setabrir') chat.stickerAbrir = hash; else chat.stickerCerrar = hash
            await react('🎀')
            return m.reply(head+`\n🎀 Sticker *${command==='setabrir'?'ABRIR 🟢':'CERRAR 🔴'}* guardado en la cripta`)
        } catch { await react('💀'); return m.reply(head+`\n💀 Error en el hechizo`) }
    }

    if (['resetsticker','delsticker','clearsticker','delabrir','delcerrar'].includes(command)) {
        let b=[]
        if (['resetsticker','delsticker','clearsticker','delabrir'].includes(command) && chat.stickerAbrir) { delete chat.stickerAbrir; b.push('ABRIR') }
        if (['resetsticker','delsticker','clearsticker','delcerrar'].includes(command) && chat.stickerCerrar) { delete chat.stickerCerrar; b.push('CERRAR') }
        if (!b.length) { await react('💀'); return m.reply(head+`\n⚠️ No hay stickers embrujados`) }
        await react('🗑️'); return m.reply(head+`\n🗑️ Exorcizado: ${b.join(', ')}`)
    }
}

handler.before = async function(m, { conn }) {
    if (m.mtype!=='stickerMessage' || !m.isGroup) return
    let chat = global.db.data.chats[m.chat]; if (!chat) return
    if (!chat.stickerAbrir && !chat.stickerCerrar) return
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    try {
        let fileSha256 = m.msg?.fileSha256; if (!fileSha256) return
        let hash = Buffer.from(fileSha256).toString('base64')
        let isClose, estado
        if (hash===chat.stickerAbrir) { isClose='not_announcement'; estado='ABIERTO 🟢🎀' }
        else if (hash===chat.stickerCerrar) { isClose='announcement'; estado='CERRADO 🔴💀' }
        else return
        await conn.groupSettingUpdate(m.chat, isClose)
        await conn.sendMessage(m.chat, { text: head+`\n${estado}\n👑 Por: @${m.sender.split('@')[0]} 👻`, mentions:[m.sender] }, { quoted:m })
    } catch {}
}

handler.help = ['setabrir','setcerrar','resetsticker']
handler.tags = ['grupo']
handler.command = ['setabrir','setcerrar','resetsticker','delsticker','clearsticker','delabrir','delcerrar']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler