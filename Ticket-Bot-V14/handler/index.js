const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const { readdirSync } = require('fs');
const colors = require('colors');

module.exports = (client) => {
    // # commandes slash
    const tableauDeCommandesSlash = []; // Tableau pour stocker les commandes slash

    // Fonction pour charger les commandes slash à partir d'un répertoire
    const chargerCommandesSlash = (dir = "./commands/") => {
        readdirSync(dir).forEach(dirs => {
            // Lire les fichiers dans chaque sous-répertoire
            const commandes = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const files of commandes) {
                // Charger chaque fichier de commande
                const obtenirNomFichier = require(`../${dir}/${dirs}/${files}`);
                client.slashCommands.set(obtenirNomFichier.name, obtenirNomFichier); // Ajouter la commande au client
                console.log(`[COMMANDES SLASH]`.bold.red + ` Chargement de la commande :`.bold.white + ` ${obtenirNomFichier.name}`.bold.red);
                tableauDeCommandesSlash.push(obtenirNomFichier); // Ajouter la commande au tableau
            }
        });

        setTimeout(async () => {
            console.log(`API >`.bold.white + ` Synchroniser toutes les commandes avec l'API Discord.`.bold.green);
            // Synchroniser les commandes avec l'API Discord
            await client.application.commands.set(tableauDeCommandesSlash);
        }, 5000);
    };
    chargerCommandesSlash(); // Appeler la fonction pour charger les commandes

    console.log(`•----------•`.bold.black); // Ligne de séparation

    // # événements
    const chargerÉvénements = (dir = "./events/") => {
        readdirSync(dir).forEach(dirs => {
            // Lire les fichiers d'événements dans le répertoire
            const événements = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));

            for(const files of événements) {
                // Charger chaque fichier d'événement
                const obtenirNomFichier = require(`../${dir}/${dirs}/${files}`);
                // Écouter l'événement et exécuter la fonction correspondante
                client.on(obtenirNomFichier.name, (...args) => obtenirNomFichier.execute(...args, client));
                console.log(`[ÉVÉNEMENTS]`.bold.red + ` Chargement de l'événement :`.bold.white + ` ${obtenirNomFichier.name}`.bold.red);
                if(!événements) return console.log(`[ÉVÉNEMENTS]`.bold.red + `Aucun événement dans : `.bold.yellow + `${files}`.bold.red);
            }
        });
    };
    chargerÉvénements(); // Appeler la fonction pour charger les événements
    console.log(`•----------•`.bold.black); // Ligne de séparation
}
