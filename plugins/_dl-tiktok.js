import fetch from 'node-fetch'
import { generateWAMessageFromContent, generateWAMessageContent, proto } from '@whiskeysockets/baileys'
import moment from 'moment-timezone'
moment.locale('es')

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

var handler = async (m, { conn, args }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const ownerNum = global.owner?.[0]?.[0] || '51927174369'

  if (!args[0]) {
    let menuUso = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒 ﹒ TIKTOK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
📱 ࣪ ꕀ.tiktok ˚. ᵎᵎ
> *"Bajando videos como fantasma roba dulces"*

.⃟𖥔 ݁. 𖦹˙— \`\`DESCARGAS\`\` 📥 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🎃
📱 ➛ Descarga videos de TikTok sin marca de agua
📱 ➛ Con botones interactivos
👻 ➛ Chayita viendo TikTok en Halloween

── *📖 USO* ╏ 🎀
➛.*tiktok* <link de tiktok>
➛.*tt* <link de tiktok>

── *💡 EJEMPLO* ╏ 🕯️
➛ https://vm.tiktok.com/ZMkcmTCa6/

── *🔗 SOPORTE* ╏ 🎃
📱 ➛ vm.tiktok.com
📱 ➛ vt.tiktok.com
📱 ➛ www.tiktok.com

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
*Owner*: @${ownerNum}
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
  }

  const url = args[0]
  if (!url.match(/(https?:\/\/)?(www\.)?(vm\.|vt\.|www\.)?tiktok\.com\//)) {
    await react(conn, m, '💀')
    let menuError = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ TIKTOK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🎃
❌ ➛ El enlace no es válido
👻 ➛ Chayita: "Eso no es TikTok, es trampa"

── *📖 USO* ╏ 🎀
➛ Solo links de: *tiktok.com*

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: menuError }, { quoted: m })
  }

  try {
    await react(conn, m, "🎀")
    await m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎 ﹒ TIKTOK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` ⚙️ —˙𖦹.꒷

── *📊 ESTADO* ╏ 🎃
🔍 ➛ Analizando link embrujado...
📥 ➛ Obteniendo video HD maldito...
⬇️ ➛ Preparando descarga sin marca...
👻 ➛ Chayita buscando el botón...

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`)

    const tiktokData = await tiktokdl(url)
    if (!tiktokData?.data) throw new Error('No se pudo obtener el video.')

    const videoURL = tiktokData.data.play
    const title = tiktokData.data.title || 'Sin título'
    const author = tiktokData.data.author?.nickname || 'Desconocido'
    const likes = formatNum(tiktokData.data.digg_count)
    const comments = formatNum(tiktokData.data.comment_count)

    const businessHeader = {
      key: { remoteJid: m.chat, participant: '0@s.whatsapp.net', fromMe: false },
      message: {
        locationMessage: {
          name: `🎀 CHAYITA BOT - HALLOWEEN COQUETTE 🐭`,
          jpegThumbnail: Buffer.from(await (await fetch('https://files.catbox.moe/dsgmid.jpg')).arrayBuffer())
        }
      }
    }

    const media = await generateWAMessageContent({ video: { url: videoURL } }, { upload: conn.waUploadToServer, jid: m.chat })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: {
              text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐃𝐎 ﹒ TIKTOK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 📥 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎃
📌 ➛ Título: *${title}*
👤 ➛ Autor: *@${author}*
❤️ ➛ Likes: *${likes}*
💬 ➛ Comentarios: *${comments}*
👻 ➛ Chayita le dio like

── *📥 DESCARGA* ╏ 🎀
⬇️ ➛ Video sin marca de agua
🍬 ➛ Listo para ver en noche de brujas`
            },
            footer: { text: 'Sin marca de agua ✨ | CHAYITA BOT - HALLOWEEN COQUETTE 🎀' },
            header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copiar texto', copy_code: title }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📱 Ver en TikTok', url: url }) }
              ]
            })
          })
        }
      }
    }, { quoted: businessHeader })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await react(conn, m, "🎀")

  } catch (error) {
    await react(conn, m, "💀")
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let menuErr = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ TIKTOK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🎃
❌ ➛ ${error.message}
💀 ➛ El fantasma se asustó

── *💡 SOLUCIÓN* ╏ 🕯️
🔧 ➛ Verifica que el video sea público
🔧 ➛ Intenta con otro link
🎃 ➛ Chayita dice: prueba otra vez

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: menuErr }, { quoted: m })
  }
}

async function tiktokdl(url) {
  const tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
  return await (await fetch(tikwm, { signal: AbortSignal.timeout(20000) })).json()
}

const formatNum = (n) => {
  n = Number(n)
  if (!n) return "0"
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

handler.help = ['tiktok <link>']
handler.tags = ['descargas']
handler.command = ['tt', 'tiktok']
handler.limit = true
export default handler