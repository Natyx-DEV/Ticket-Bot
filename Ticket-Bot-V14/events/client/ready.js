const colors = require('colors');
const config = require('../../settings/config');
const { ActionRowBuilder, Colors, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ready',
    once: false,
    execute: async (client) => {
        console.log(`[PRÊT] ${client.user.tag} (${client.user.id}) est prêt !`.green);

        let channelTicket = client.channels.cache.get(config.ticket_channel);
        await channelTicket.send({ content: "." })
        await channelTicket.bulkDelete(2);

        await channelTicket.send({
            embeds: [{
                title: "Système de Ticket",
                description: "Si vous souhaitez ouvrir un ticket pour contacter le personnel, cliquez sur le bouton ci-dessous !",
                color: Colors.Blurple,
                footer: {
                    name: "Système de Ticket",
                },
                timestamp: new Date(),
            }],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('ticket').setLabel('Ouvrir un ticket').setStyle(ButtonStyle.Secondary)
                )
            ]
        })
    }
}
