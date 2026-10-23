import moment from 'moment-timezone'
moment.locale('es')

let vs = global.vsData = global.vsData || {}

const crear = async (m, { conn, args, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    if (args.length < 2) {
      let error = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ VS ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 USO* ╏ 🎃
➛${usedPrefix + command} 14 PE APOS
👻 ➛ Chayita dice: pon hora y país pe

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
      return conn.reply(m.chat, error, m);
    }

    let horaRaw = args[0];
    let hora, minutos;
    if(horaRaw.includes(':')){ [hora, minutos] = horaRaw.split(':').map(Number) } else { hora = Number(horaRaw); minutos = 0 }

    const pais = args[1].toUpperCase();
    const diferenciasHorarias = { CL: 2, AR: 2, PE: 0, BO: 2 };
    if (!(pais in diferenciasHorarias)) {
      let error = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ PAIS ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ⚠️ —˙𖦹.꒷

── *📝 AVISO* ╏ 🎃
⚠️ ➛ Usa PE, CL, AR o BO
💀 ➛ Chayita solo conoce esos países

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
      return conn.reply(m.chat, error, m);
    }

    const diferenciaHoraria = diferenciasHorarias[pais];
    const formatTime = (date) => date.toLocaleTimeString('es', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const horasEnPais = { PE: '', CL: '', AR: '', BO: '' };
    for (const key in diferenciasHorarias) {
        const horaActual = new Date(); horaActual.setHours(hora, minutos, 0, 0);
        const horaEnPais = new Date(horaActual.getTime() + (3600000 * (diferenciasHorarias[key] - diferenciaHoraria)));
        horasEnPais[key] = formatTime(horaEnPais);
    }

    const modalidad = args.slice(2).join(' ') || 'APOS';
    let groupName = 'VS TEAM'
    if(m.isGroup){
        let groupMeta = await conn.groupMetadata(m.chat)
        groupName = groupMeta.subject.toUpperCase()
    }

    let cantidad = command.includes('6')? 6 : 4
    let tipo = command.includes('fem')? 'FEM' : command.includes('masc')? 'MASC' : 'MIXTO'

    let diseño = {}
    if(tipo === 'FEM'){
        diseño = { header: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n👻⃟💜 ${groupName} 💜⃟👻\nㅤ ˗ˏˋ ꒰ 🎀 ꒱ ˎˊ˗`, icon: '🎀', suplente: '🕸️' }
    }
    if(tipo === 'MASC'){
        diseño = { header: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀˗ˏˋ ꒰ ${groupName} ꒱ ˎˊ˗💀\n✧･ﾟ: *✧･ﾟ:* 🎃 *:･ﾟ✧*:･ﾟ✧`, icon: '🎃', suplente: '👻' }
    }
    if(tipo === 'MIXTO'){
        diseño = { header: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n🕯️⃟✨ ${groupName} ✨⃟🕯️\n　★彡.　☆`, icon: '🕯️', suplente: '💀' }
    }

    vs[m.chat] = vs[m.chat] || { salas: [], tipo, diseño, groupName }
    if(vs[m.chat].tipo!== tipo) vs[m.chat] = { salas: [], tipo, diseño, groupName }

    vs[m.chat].salas.push({
        jugadores: [],
        suplentes: [],
        modalidad,
        horasEnPais,
        cantidad,
        icons1: Array(cantidad).fill(diseño.icon),
        icons2: [diseño.suplente, diseño.suplente]
    })

    await actualizarLista(m.chat, conn, usedPrefix)
    m.react(diseño.icon)
}

const anotar = async (m, { conn, args, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    if (!vs[m.chat] ||!vs[m.chat].salas.length) {
      return conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 ➛ No hay VS activa\n👻 ➛ Chayita dice: crea una primero\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)
    }
    let salaNum = parseInt(args[0]) - 1
    if(isNaN(salaNum)) salaNum = 0

    let sala = vs[m.chat].salas[salaNum]
    if(!sala) return conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 ➛ Sala ${args[0]} no existe\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)

    let users = m.mentionedJid || []
    if(users.length === 0) {
      return conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 ➛ Menciona a alguien\nEj:.anotar 1 @pepito @juana\n━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)
    }

    for(let user of users){
        sala.jugadores = sala.jugadores.filter(v => v!== user)
        sala.suplentes = sala.suplentes.filter(v => v!== user)

        if (command === 'anotar') {
            if (sala.jugadores.length >= sala.cantidad) return conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⚠️ ➛ Sala ${salaNum+1} llena\n🎃 Chayita: ya no entra nadie más\n━━━━━━━━━━━`, m)
            sala.jugadores.push(user)
        }
        if (command === 'suplente') {
            if (sala.suplentes.length >= 2) return conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⚠️ ➛ Suplentes sala ${salaNum+1} llenos\n━━━━━━━━━━━`, m)
            sala.suplentes.push(user)
        }
        if (command === 'salir') {
            await conn.reply(m.chat, `👻 ➛ @${user.split('@')[0]} salió de la sala ${salaNum+1} - Chayita lo sacó`, m, { mentions: [user] })
        }
    }
    await actualizarLista(m.chat, conn, usedPrefix)
}

const actualizarLista = async (chat, conn, usedPrefix) => {
    let data = vs[chat]
    let d = data.diseño
    const fecha = moment.tz('America/Lima').format('DD/MM HH:mm')
    let todasSalas = ''

    data.salas.forEach((sala) => {
        let listaJug = sala.jugadores.map((v) => `┆⋆${sala.icons1[0]} @${v.split('@')[0]}`).join('\n')
        let listaSup = sala.suplentes.map((v) => `┆ ⋆${sala.icons2[0]} @${v.split('@')[0]}`).join('\n')

        for(let j = sala.jugadores.length; j < sala.cantidad; j++){ listaJug += `\n┆⋆${sala.icons1[0]} ` }
        for(let j = sala.suplentes.length; j < 2; j++){ listaSup += `\n┆ ⋆${sala.icons2[0]} ` }

        todasSalas += `┆ *${sala.icons2[0]}MODO : ${sala.modalidad}${sala.icons2[0]}*\n`
        todasSalas += `┆⋆.˚ּ ֶָ ${sala.horasEnPais.PE} 🇵🇪 | ${sala.horasEnPais.CL}🇨🇱 | ${sala.horasEnPais.AR}🇦🇷\n`
        todasSalas += `┆⋆𝗝𝗨𝗚𝗔𝗗𝗢𝗥𝗘𝗦:\n${listaJug}\n`
        todasSalas += `┆ *SUPLENTES:*\n${listaSup}\n`
        todasSalas += `╰────────────⁀➴\n\n`
    })

    const message = `${d.header}
꒰ ◞⁺⊹ ．${fecha}

${todasSalas}
╭─「 COMO ANOTARSE 」
│ Admin: ${usedPrefix}anotar 1 @user1 @user2
│ Admin: ${usedPrefix}suplente 2 @user
│ Admin: ${usedPrefix}salir 1 @user
│
│ React:
│ ${d.icon} = Quiero JUGAR
│ ${d.suplente} = Quiero SUPLENTE
╰───────────────────
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`;

    let mentions = []
    data.salas.forEach(s => mentions.push(...s.jugadores,...s.suplentes))
    await conn.sendMessage(chat, { text: message, mentions })
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (/^v[46](fem|masc|mixto)$/i.test(command)) return crear(m, {conn, args, usedPrefix, command})
    if (['anotar','suplente','salir'].includes(command)) return anotar(m, {conn, args, usedPrefix, command})
}

handler.help = [
    'v4fem <hora> <pais> <modalidad>',
    'v4masc <hora> <pais> <modalidad>',
    'v4mixto <hora> <pais> <modalidad>',
    'v6fem <hora> <pais> <modalidad>',
    'v6masc <hora> <pais> <modalidad>',
    'v6mixto <hora> <pais> <modalidad>',
    'anotar <numSala> @user1 @user2',
    'suplente <numSala> @user',
    'salir <numSala> @user'
]
handler.tags = ['freefire']
handler.command = /^(v[46](fem|masc|mixto)|anotar|suplente|salir)$/i
handler.group = true
handler.admin = true

export default handler