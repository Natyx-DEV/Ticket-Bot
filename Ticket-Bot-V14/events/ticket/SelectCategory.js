const { ActionRowBuilder, ChannelType, Colors, PermissionFlagsBits, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../settings/config');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        // Vérifie si l'interaction est un bouton
        if(!interaction.isButton()) return;

        // Vérifie si le bouton cliqué est celui pour créer un ticket
        if(interaction.customId === 'ticket') {
            
            // Crée un nouveau canal pour le ticket
            let ticket = interaction.guild.channels.create({
                name: `Select a category`, // Nom du canal
                type: ChannelType.GuildText, // Type de canal (texte)
                parent: config.ticket_category, // Catégorie parent
                permissionOverwrites: [ // Permissions du canal
                    {
                        id: interaction.user.id, // ID de l'utilisateur qui a créé le ticket
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages], // Permissions accordées
                        deny: [PermissionFlagsBits.MentionEveryone] // Interdit de mentionner tout le monde
                    },
                    {
                        id: interaction.guild.id, // ID de la guilde
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone] // Interdit l'accès à tout le monde
                    }
                ]
            }).then((c) => {
                // Envoie un message dans le canal de ticket
                c.send({
                    embeds: [{
                        title: "Système de Ticket",
                        description: "Veuillez sélectionner une catégorie pour votre ticket !",
                        color: Colors.Blurple, // Couleur de l'embed
                    }],
                    components: [ // Ajoute un menu de sélection de catégorie
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('category') // ID du menu de sélection
                            .setPlaceholder('Sélectionnez une catégorie') // Texte de l'espace réservé
                            .addOptions([ // Options du menu de sélection
                                {
                                    label: 'Report',
                                    description: 'Signaler un utilisateur',
                                    value: 'report',
                                    emoji: '🐛'
                                },
                                {
                                    label: 'Question',
                                    description: 'Toute question',
                                    value: 'question',
                                    emoji: '📝'
                                },
                                {
                                    label: 'Other',
                                    description: 'Autre',
                                    value: 'other',
                                    emoji: '📁'
                                }
                            ])
                        )
                    ]
                });

                // Envoie un message pour notifier l'utilisateur que le ticket a été créé
                c.send({
                    content: `${interaction.user}`
                }).then(msg => {
                    // Supprime le message après 1 seconde
                    setTimeout(() => {
                        msg.delete();
                    }, 1000);
                });
            });

            // Envoie une réponse éphémère à l'utilisateur pour confirmer la création du ticket
            interaction.reply({
                content: `:white_check_mark: | Votre ticket a été créé !`,
                ephemeral: true
            });
        }
    }
}
