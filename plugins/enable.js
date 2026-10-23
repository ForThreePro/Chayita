import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command, args, isOwner, isAdmin, isROwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  let isEnable = /true|enable|(turn)?on|1/i.test(args[0])
  let chat = global.db.data.chats[m.chat]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()

  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  if (!args[0]) {
    await react('💀')
    let error = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐀𝐂𝐈𝐎𝐍 ﹒ ON/OFF ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎃
❌ ➛ Falta activar o desactivar
👻 ➛ Chayita dice: pon on o off pe

── *💡 USO* ╏ 🎀
➛.welcome on / off
➛.antilink on / off
➛.nsfw on / off
➛.detect on / off

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: error }, { quoted: m })
  }

  let fail = false
  switch (type) {
    case 'welcome': case 'bienvenida':
      if (m.isGroup &&!isAdmin) { await react('🔒'); fail = true; break }
      chat.bienvenida = isEnable
      break
    case 'subbots': case 'serbot':
      if (!isROwner) { await react('🔒'); fail = true; break }
      bot.jadibotmd = isEnable
      break
    case 'antispam':
      if (!isOwner) { await react('🔒'); fail = true; break }
      bot.antiSpam = isEnable
      break
    case 'antilink':
      if (m.isGroup &&!isAdmin) { await react('🔒'); fail = true; break }
      chat.antiLink = isEnable
      break
    case 'antibot':
      if (m.isGroup &&!isAdmin) { await react('🔒'); fail = true; break }
      chat.antiBot = isEnable
      break
    case 'modoadmin':
      if (m.isGroup &&!isAdmin) { await react('🔒'); fail = true; break }
      chat.modoadmin = isEnable
      break
    case 'nsfw': case 'antinopor':
      if (m.isGroup &&!isAdmin) { await react('🔒'); fail = true; break }
      chat.nsfw = isEnable
      break
    case 'audios':
      chat.audios = isEnable
      break
    case 'autoread': case 'autoleer':
      if (!isROwner) { await react('🔒'); fail = true; break }
      global.opts['autoread'] = isEnable
      break
    case 'antiprivado':
      if (!isOwner) { await react('🔒'); fail = true; break }
      bot.antiPrivate = isEnable
      break
    case 'detect': case 'detector': case 'avisos':
      if (m.isGroup &&!isAdmin) { await react('🔒'); fail = true; break }
      chat.detect = isEnable
      break
    default:
      return
  }

  if (fail) {
    let lock = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐀𝐂𝐄𝐒𝐎 𝐃𝐄𝐍𝐄𝐆𝐀𝐃𝐎 ﹒ ${type.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 🔒 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎃
🔒 ➛ No tienes permisos para esto
👻 ➛ Chayita: solo admins pueden tocar esto

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: lock }, { quoted: m })
  }

  await react(isEnable? '🎀' : '💀')

  let estadoTexto = isEnable? 'Activado' : 'Desactivado'
  let estadoEmoji = isEnable? '🎀' : '💀'

  let statusTxt = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐀𝐂𝐈𝐎𝐍 ﹒ ${type.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ACTUALIZADO\`\` ⚙️ —˙𖦹.꒷

── *📊 ESTADO* ╏ 🎃
⚙️ ➛ Función: *${type}*
${estadoEmoji} ➛ Estado: *${estadoTexto}*
👑 ➛ Por: @${m.sender.split('@')[0]}
👻 ➛ Chayita ${isEnable? 'aprobó 🎀' : 'se fue a la tumba 💀'}

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`

  await conn.sendMessage(m.chat, {
    text: statusTxt,
    mentions: [m.sender]
  }, { quoted: m })
}

handler.help = ['welcome','antilink', 'antibot', 'modoadmin', 'subbots', 'nsfw', 'audios', 'antiprivado', 'antispam', 'autoread', 'detect'].map(v => v + ' on/off')
handler.tags = ['configuración']
handler.command = ['welcome', 'bienvenida', 'subbots', 'serbot', 'antispam', 'antilink', 'antibot', 'modoadmin', 'nsfw', 'antinopor', 'audios', 'autoleer', 'autoread', 'antiprivado', 'detect', 'detector', 'avisos']

export default handler