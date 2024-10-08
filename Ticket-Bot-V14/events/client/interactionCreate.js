module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        await slashCommands();

        async function slashCommands() {
            if(interaction.isChatInputCommand()) {

                const cmd = client.slashCommands.get(interaction.commandName);
                if(!cmd) {
                    return interaction.channel.send({ content: `\`[⌛]\` ${interaction.member}, une erreur s'est produite.` })
                }

                const args = [];

                for (let option of interaction.options.data) {
                    if (option.type === "SUB_COMMAND") {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);

                console.log(`[COMMANDES SLASH] `.bold.red + `/${cmd.name}`.bold.blue + ` a été exécuté`.bold.white)
                cmd.execute(client, interaction);
            }
        }

    }
}
