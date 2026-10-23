import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, usedPrefix, text, command, isAdmin, isOwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const reply = (txt) => conn.sendMessage(m.chat, { text: head + `\n${txt}` + footer }, { quoted: m })

  if (!isAdmin && !isOwner) { await react('💀'); return reply(`💀 Solo admins embrujados`) }

  if (['resetlink','revokelink'].includes(command)) {
    try {
      await react('🔗')
      await conn.groupRevokeInvite(m.chat)
      let code = await conn.groupInviteCode(m.chat)
      await react('🎀')
      return reply(`🔗 Nuevo link de la cripta:\nhttps://chat.whatsapp.com/${code}`)
    } catch { await react('💀'); return reply(`💀 Necesito ser admin`) }
  }

  if (['setname','setgroupname'].includes(command)) {
    if (!text) { await react('💀'); return reply(`💀 Usa: *${usedPrefix}setname Nuevo nombre*`) }
    try { await react('⏳'); await conn.groupUpdateSubject(m.chat, text); await react('🎀'); return reply(`🎀 Nombre cambiado a: *${text}*`) }
    catch { await react('💀'); return reply(`💀 Error al cambiar nombre`) }
  }

  if (['setdesc','setgroupdesc'].includes(command)) {
    if (!text) { await react('💀'); return reply(`💀 Usa: *${usedPrefix}setdesc Nueva descripción*`) }
    try { await react('⏳'); await conn.groupUpdateDescription(m.chat, text); await react('🎀'); return reply(`🎀 Descripción embrujada actualizada`) }
    catch { await react('💀'); return reply(`💀 Error al cambiar descripción`) }
  }

  if (['setfoto','setppgroup','setppgc'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    try {
      await react('⏳')
      if (text && /https?:\/\//.test(text)) {
        await conn.updateProfilePicture(m.chat, { url: text })
      } else if (/image/.test(mime)) {
        let img = await q.download()
        await conn.updateProfilePicture(m.chat, img)
      } else { await react('💀'); return reply(`💀 Responde a una imagen o pasa un link`) }
      await react('🎀')
      return reply(`🎀 Foto de la cripta actualizada`)
    } catch { await react('💀'); return reply(`💀 Error al actualizar foto`) }
  }
}

handler.help = ['resetlink','setname','setdesc','setfoto']
handler.tags = ['grupos']
handler.command = ['resetlink','revokelink','setname','setgroupname','setdesc','setgroupdesc','setfoto','setppgroup','setppgc']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler