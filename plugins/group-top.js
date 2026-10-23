import moment from 'moment-timezone'
moment.locale('es')

let user = a => '@' + a.split('@')[0]
const pickRandom = (l) => l[Math.floor(Math.random()*l.length)]
Array.prototype.getRandom = function(){ return this[Math.floor(Math.random()*this.length)] }

let handler = async (m, { groupMetadata, command, conn, text }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`

    if (!groupMetadata) return m.reply(head+`\n💀 Solo en grupos embrujados`, m)
    if (!text) { await react('💀'); return m.reply(head+`\n🎀 Usa: *.top <motivo>*\nEj: *.top Más activos*`, m) }

    let ps = groupMetadata.participants.map(v=>v.id)
    if (ps.length < 10) { await react('⚠️'); return m.reply(head+`\n⚠️ Mínimo 10 almas`, m) }

    let picks = Array.from({length:10},()=>ps.getRandom())
    let x = pickRandom(['🎀','🐭','💀','👻','🕷️','🕯️','😈','🍬','🔮','⚰️'])

    let top = head + `\n🏆 *TOP 10 ${text.toUpperCase()}* ${x}\n\n` +
      picks.map((p,i)=>`${x} *${i+1}.* ${user(p)}`).join('\n') +
      `\n\n🎲 Aleatorio de la cripta`

    await react(x)
    return m.reply(top, null, { mentions: picks })
}

handler.help = ['top <texto>']
handler.tags = ['fun']
handler.command = /^(top)$/i
handler.group = true
export default handler