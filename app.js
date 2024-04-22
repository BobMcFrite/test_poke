const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')

// Configuration de GET pour récupérer les informations sur l'API
app.get('/pokemon', (req, res) => {
    try {
        const pokemonName = req.query.name;
        if (!pokemonName) {
            return res.status(400).send('Le paramètre "name" est requis.');
        }

        const pokemonInfo = getPokemonInfo(pokemonName);
        res.json(pokemonInfo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

async function getPokemonInfo(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const { name, id, types, abilities } = response.data;
        const pokemonInfo = {
            name,
            id,
            types,
            abilities
        };
        return pokemonInfo;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error(`Le Pokémon "${pokemonName}" n'existe pas.`);
        } else {
            throw new Error('Une erreur s\'est produite lors de la requête à l\'API PokeAPI.');
        }
    }
}

// server start
app.listen(port, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});