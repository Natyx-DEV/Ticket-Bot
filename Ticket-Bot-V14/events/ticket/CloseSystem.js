const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js')
const config = require('../../settings/config');
const transcript = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if(!interaction.isButton()) return;

        if(interaction.customId === "close") {
            interaction.reply({
                content: `Êtes-vous sûr de vouloir supprimer le ticket ?`,
                ephemeral: true,
            });

            interaction.channel.send({
                embeds: [{
                    title: "Système de Ticket",
                    description: "Le ticket sera fermé, souhaitez-vous en avoir une transcription ?",
                    color: Colors.Blurple,
                    footer: {
                        text: "Système de Ticket"
                    },
                    timestamp: new Date()
                }],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('yes').setLabel('Oui').setStyle(ButtonStyle.Success),
                        new ButtonBuilder().setCustomId('no').setLabel('Non').setStyle(ButtonStyle.Danger)    
                    )
                ]
            });
        }
        else if (interaction.customId === "yes") {
            let ticket_logs = client.channels.cache.get(config.ticket_logs);

            await ticket_logs.send({
                embeds: [{
                    title: "Système de Ticket",
                    description: `Nouveau ticket fermé (${interaction.channel.name}) par ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Système de Ticket"
                    },
                    timestamp: new Date()
                }],
                files: [await transcript.createTranscript(interaction.channel)]
            });

            await interaction.channel.send({
                embeds: [{
                    title: "Système de Ticket",
                    description: `Ticket fermé par ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Système de Ticket"
                    },
                    timestamp: new Date()
                }]
            });

            await interaction.channel.delete();
        }
        else if (interaction.customId === "no") {
            interaction.channel.send({
                embeds: [{
                    title: "Système de Ticket",
                    description: `Ticket fermé par ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Système de Ticket"
                    },
                    timestamp: new Date()
                }]
            });

            await interaction.channel.delete();
        }
    }
}
