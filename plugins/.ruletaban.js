let handler = async (m, { conn }) => {
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let botNumber = conn.user.jid

    let candidates = participants.filter(p => !p.admin && p.id !== botNumber)
    if (!candidates.length) return m.reply(`‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹\n\n꒰👻꒱ No hay víctimas, todos son admins... se salvaron del exorcismo coquette 😿🎀`)

    let victim = candidates[Math.floor(Math.random() * candidates.length)]

    await conn.sendMessage(m.chat, { 
        text: 
`‧˚₊꒰🎀💖 𓆩 *𝗥 𝗨 𝗟 𝗘 𝗧 𝗔  𝗕 𝗔 𝗡* 𓆪 💖🎀꒱₊˚⊹
*🎀🐭 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 - 𝗛𝗔𝗟𝗟𝗢𝗪𝗘𝗘𝗡 𝗖𝗢𝗤𝗨𝗘𝗧𝗧𝗘 🎃🐭*

╭───GIRANDO ꒰🎰꒱────╮
‧˚꒰🕸️୭ Invocando espíritus coquettes...
‧˚꒰👻୭ Participantes: ${candidates.length}
╰─────── ݁ ˖Ი𐑼⋆────╯

꒰🎀꒱ La ouija coquette eligió a @${victim.id.split('@')[0]} 💥

*¡EL FANTASMA COQUETTE SE LO LLEVÓ!* 💀🍬🎀`,
        mentions: [victim.id]
    })

    await new Promise(r => setTimeout(r, 1500))

    try {
        await conn.groupParticipantsUpdate(m.chat, [victim.id], 'remove')
        await conn.sendMessage(m.chat, { text: `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹\n\n꒰💀꒱ @${victim.id.split('@')[0]} fue exorcizado del grupo\n꒰🕯️꒱ Trick or... ¡BAN! 🎃🎀`, mentions: [victim.id] })
        await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
    } catch (e) {
        m.reply(`‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹\n\n꒰😿꒱ No pude exorcizar a @${victim.id.split('@')[0]} - tiene protección fantasmal 🎀`, null, { mentions: [victim.id] })
    }
}

handler.help = ['ruletaban']
handler.tags = ['group']
handler.command = /^(ruletaban|ruletab|ruletaban-halloween)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler