import fs from 'fs'
import moment from 'moment-timezone'
moment.locale('es')

const filePath = './temp_groups.json'
const OWNER_NUMBERS = ['541128198851']
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]')
global.tempGroups = JSON.parse(fs.readFileSync(filePath))
const save = () => fs.writeFileSync(filePath, JSON.stringify(global.tempGroups, null, 2))
const isOwner = (m) => OWNER_NUMBERS.includes(m.sender.replace('@s.whatsapp.net',''))
const react = async (conn,m,t) => { try{ await conn.sendMessage(m.chat,{react:{text:t,key:m.key}}) }catch{} }
const msToTime = (ms) => {
  let d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000)
  return `${d?d+'d ':''}${h?h+'h ':''}${m?m+'m':''}`.trim()||'0m'
}

setInterval(async () => {
  if (!global.conn) return
  const now = Date.now()
  let toRemove = []
  for (let i of global.tempGroups) {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    if (i.exitTime - now <= 300000 && i.exitTime - now > 0 && !i.warned) {
      try { await global.conn.sendMessage(i.id, { text: head + `\n⏰ El bot se esfumará en 5 minutos 👻` }); i.warned = true; save() } catch {}
    }
    if (now >= i.exitTime) {
      try {
        await global.conn.sendMessage(i.id, { text: head + `\n👋 Tiempo embrujado terminado, desapareciendo... 🎀` })
        await new Promise(r=>setTimeout(r,1200))
        await global.conn.groupLeave(i.id)
      } catch {}
      toRemove.push(i.id)
    }
  }
  if (toRemove.length) { global.tempGroups = global.tempGroups.filter(v=>!toRemove.includes(v.id)); save() }
}, 30000)

let handler = async (m, { conn, args, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`

  if (!isOwner(m)) { await react(conn,m,"💀"); return m.reply(head+`\n💀 Solo dueña de la cripta`) }
  if (command === 'templist') {
    if (!global.tempGroups.length) { await react(conn,m,"⚠️"); return m.reply(head+`\n⚠️ Sin almas temporizadas`) }
    let list = global.tempGroups.map((v,i)=>`${i+1}. *${v.name}* - ${msToTime(v.exitTime-Date.now())}`).join('\n')
    await react(conn,m,"📋"); return m.reply(head+`\n📋 *Grupos embrujados:*\n${list}`)
  }
  if (command === 'tempcancel') {
    let idx = global.tempGroups.findIndex(v=>v.id===m.chat)
    if (idx===-1) { await react(conn,m,"⚠️"); return m.reply(head+`\n⚠️ Sin temporizador embrujado`) }
    global.tempGroups.splice(idx,1); save()
    await react(conn,m,"🎀"); return m.reply(head+`\n🎀 Hechizo cancelado`)
  }
  // temporizador / temp
  if (!m.isGroup) { await react(conn,m,"💀"); return m.reply(head+`\n💀 Solo en grupos embrujados`) }
  if (!args[0]) { await react(conn,m,"💀"); return m.reply(head+`\n⏰ Usa: *.temp 1h* / *.temp 30m* / *.temp 1d*`) }
  let ms=0, rx=/(\d+)([dhm])/g, mt
  while((mt=rx.exec(args[0].toLowerCase()))!==null){ let v=parseInt(mt[1]); if(mt[2]==='d')ms+=v*86400000; if(mt[2]==='h')ms+=v*3600000; if(mt[2]==='m')ms+=v*60000 }
  if (ms<60000) { await react(conn,m,"💀"); return m.reply(head+`\n💀 Mínimo 1m`) }

  let idx = global.tempGroups.findIndex(v=>v.id===m.chat)
  if(idx!==-1) global.tempGroups.splice(idx,1)
  global.tempGroups.push({ id:m.chat, name: await conn.getName(m.chat), exitTime: Date.now()+ms, warned:false })
  save()
  await react(conn,m,"🎀")
  return m.reply(head+`\n🎀 Temporizador embrujado activado: *${msToTime(ms)}*`)
}

handler.help = ['temporizador 30d','tempcancel','templist']
handler.tags = ['grupos']
handler.command = ['temporizador','temp','tempcancel','templist']
export default handler