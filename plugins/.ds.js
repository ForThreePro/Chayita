import { existsSync, promises as fs } from 'fs'
import path from 'path'
import moment from 'moment-timezone'
moment.locale('es')

var handler = async (m, { conn }) => {
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.reply(m.chat, '🎀 *Usa esto en el número principal preciosa* 💖', m)
    }

    let rutas = [`./Sesiones/Principal/`, `./sesiones/Principal/`, `./sessions/Principal/`]
    let sessionPath = rutas.find(r => existsSync(r))

    if (!sessionPath) return m.reply('🐭 *No encontré la carpetita de sesión* 🎀')

    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
    await m.reply(`‧˚꒰🎀🐭୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓 - 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝐂𝐎𝐐𝐔𝐄𝐓𝐓𝐄_*\n\n꒰🎃꒱ Ratoncita coquette limpiando... 🕸️💖`)

    let files = await fs.readdir(sessionPath)
    let filesDeleted = 0

    for (const file of files) {
        if (
            file.startsWith('pre-key-') ||
            file.startsWith('sender-key') ||
            file.startsWith('session-')
        ) {
            if (!file.startsWith('creds') && !file.startsWith('app-state')) {
                await fs.unlink(path.join(sessionPath, file))
                filesDeleted++;
            }
        }
    }

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = global.owner?.[0]?.[0] || '51927174369'

    let menu = `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹
🎃🐭 𝗛𝗔𝗟𝗟𝗢𝗪𝗘𝗘𝗡 𝗖𝗢𝗤𝗨𝗘𝗧𝗧𝗘 🐭🎃

⤷ ┇ 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 ﹒ 𝐅𝐈𝐗 𝐂𝐎𝐐𝐔𝐄𝐓𝐓𝐄 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🎀 ࣪ ꕀ.dsowner ˚. ᵎᵎ
> *"Limpiando hasta el último fantasmita de la sesión"*

.⃟𖥔 ݁. 𖦹˙— \`\`FIX DE SESIÓN HALLOWEEN\`\` [${filesDeleted}] 🕸️🎀 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🎃
🧹 ➛ Elimina archivos de caché basura embrujados
🔒 ➛ No borra \`creds\` ni \`app-state\` para que no se desconecte
🐭 ➛ Chayita coquette: *"Más rápido, que hay dulces rosas esperando"* 🍬💖

── *📖 USO* ╏ 🦇
👑 ➛ Usar solo en el número principal del bot
🔌 ➛ El bot sigue conectado, no necesita reinicio

── *📊 RESULTADO* ╏ 🕯️
✅ ➛ Archivos eliminados: *${filesDeleted}*
🎀 ➛ Estado: *${filesDeleted === 0 ? 'Todo limpio - Sin fantasmitas 🐭💖' : 'Exorcismo completado - Hora de pedir dulces 🎃🎀'}*

━━━━━━━━━━━
🎀🐭 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭🎀
*Owner*: @${ownerNum}
*Version*: 2.6 HALLOWEEN COQUETTE PRO

> "Odio el desorden, pero amo una sesión limpia y coquette" 💅🎃
━━━━━━━━━━━`

    await conn.sendMessage(m.chat, {
        text: menu,
        mentions: [m.sender, ownerNum + '@s.whatsapp.net']
    }, { quoted: m })
}
handler.help = ['dsowner']
handler.tags = ['fix', 'owner']
handler.command = ['dsowner','delai','clearcache']
handler.rowner = true
export default handler