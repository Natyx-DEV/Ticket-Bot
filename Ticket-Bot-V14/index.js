const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const colors = require("colors");

// Création d'une instance du client Discord
const client = new Client({
    intents: [ 
        // Intents pour recevoir différents événements
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildModeration, 
        GatewayIntentBits.GuildEmojisAndStickers, 
        GatewayIntentBits.GuildIntegrations, 
        GatewayIntentBits.GuildWebhooks, 
        GatewayIntentBits.GuildInvites, 
        GatewayIntentBits.GuildVoiceStates, 
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.GuildMessageTyping, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.DirectMessageReactions, 
        GatewayIntentBits.DirectMessageTyping, 
        GatewayIntentBits.GuildScheduledEvents, 
        GatewayIntentBits.GuildPresences, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ],
    partials: [ 
        // Partials pour traiter des événements sur des entités non entièrement disponibles
        Partials.Channel, 
        Partials.GuildMember, 
        Partials.GuildScheduledEvent, 
        Partials.Message, 
        Partials.Reaction, 
        Partials.ThreadMember, 
        Partials.User 
    ],
    restTimeOffset: 0, // Pas de délai pour les requêtes REST
    failIfNotExists: false, // Ne pas échouer si quelque chose n'existe pas
    presence: {
        // Présence du bot
        activities: [{
            name: `Regarde les tickets`, // Nouveau nom de l'activité
            type: ActivityType.Watching // Type d'activité changé à 'Watching'
        }],
        
        status: "en ligne" // Statut en ligne
    },
    allowedMentions: {
        // Configuration pour les mentions
        parse: ["roles", "users", "everyone"],
        repliedUser: false // Ne pas mentionner l'utilisateur ayant répondu
    }
});

// Chargement de la configuration (token du bot)
const config = require('./settings/config');
client.login(config.token); // Connexion du client avec le token

module.exports = client; // Exportation du client pour utilisation dans d'autres fichiers

client.slashCommands = new Collection(); // Collection pour stocker les commandes slash

client.on("ready", async () => {
    // Une fois le client prêt, charger les événements et les commandes
    require('./handler')(client);

    const readyEvent = require('./events/client/ready');
    await readyEvent.execute(client);
});

// Gestion des promesses non gérées
process.on("unhandledRejection", (error) => {
    if (error.code == 10062) return; // Ignorer les erreurs d'interaction inconnues

    console.log(`[ERREUR] ${error}`.red); // Afficher les autres erreurs en rouge
});
