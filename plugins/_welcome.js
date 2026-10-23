import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  if (!isAdmin &&!isOwner) return

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n🟢 Bienvenida activada - Chayita despertó\n꒰ ◞⁺⊹ ．${fecha}` }, { quoted: m })
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n🔴 Bienvenida desactivada - Chayita a dormir\n꒰ ◞⁺⊹ ．${fecha}` }, { quoted: m })
  }
}

handler.help = ['bienvenida <on/off>']
handler.tags = ['configuración']
handler.command = /^(bienvenida|welcome|bye)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType ||!m.isGroup) return!0
  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat ||!chat.bienvenida) return!0

  const userJid = m.messageStubParameters?.[0] || m.participant
  if (!userJid) return!0

  const DEFAULT_IMG = 'https://files.evogb.win/MklTGD.jpg'
  let imgBuffer = null
  try {
    let userPP = await conn.profilePictureUrl(userJid, 'image')
    let res = await fetch(userPP)
    imgBuffer = await res.buffer()
  } catch {
    try {
      let res = await fetch(DEFAULT_IMG)
      imgBuffer = await res.buffer()
    } catch {}
  }

  const userTag = `@${userJid.split('@')[0]}`
  const groupName = groupMetadata.subject
  const groupDesc = groupMetadata.desc || 'Sin descripción'
  const membersCount = groupMetadata.participants.length

  let txt = '', audio = null

  switch (m.messageStubType) {
    case WAMessageStubType.GROUP_PARTICIPANT_ADD:
      audio = chat.audiowelcome
      txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐎 ﹒ WELCOME ：✿ 。

👻 ➛ ${userTag} apareció en *${groupName}*
👥 ➛ Alma N°: *${membersCount}*
🎃 ➛ Chayita dice: trae dulces

🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`
      break
    case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
      audio = chat.audiobye
      txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 ﹒ BYE ：✿ 。

💨 ➛ ${userTag} desapareció de *${groupName}*
💀 ➛ Chayita: "Uno menos que pide dulces"

🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`
      break
    case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
      audio = chat.audiokick
      txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐗𝐏𝐔𝐋𝐒𝐀𝐃𝐎 ﹒ KICK ：✿ 。

🥊 ➛ ${userTag} fue exorcizado de *${groupName}*
👻 ➛ Chayita: "Se robó mis dulces"

🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`
      break
  }

  if (txt) {
    if (imgBuffer) {
      await conn.sendMessage(m.chat, { image: imgBuffer, caption: txt, mentions: [userJid] })
    } else {
      await conn.sendMessage(m.chat, { text: txt, mentions: [userJid] })
    }

    if (audio) {
      try {
        let audioBuffer = typeof audio === 'string'? Buffer.from(audio, 'base64') : audio
        await conn.sendMessage(m.chat, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false
        })
      } catch (e) {
        console.log('Error audio:', e)
      }
    }
  }
  return!0
}

export default handler