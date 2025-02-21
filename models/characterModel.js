const fs = require('fs');
const path = './data/characters.json';

// Obtener todos los personajes
const getAllCharacters = () => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
};

// Guardar todos los personajes
const saveCharacters = (characters) => {
    fs.writeFileSync(path, JSON.stringify(characters, null, 2));
};

// Buscar un personaje por su ID
const findCharacterById = (id) => {
    const characters = getAllCharacters();
    return characters.find(c => c.id === id);
};

module.exports = { getAllCharacters, saveCharacters, findCharacterById };
