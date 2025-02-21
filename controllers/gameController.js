const characterModel = require('../models/characterModel');

// Middleware para verificar si el usuario está logueado
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.username) {
        return next();
    } else {
        res.redirect('/login');
    }
};

// Middleware para verificar si el usuario es el admin
exports.isAdmin = (req, res, next) => {
    if (req.session.username === 'admin') {
        return next();
    } else {
        res.redirect('/game');
    }
};

// Manejar la selección de un personaje para el juego
exports.chooseCharacter = (req, res) => {
    req.session.characterId = parseInt(req.body.characterId);
    res.redirect('/game');
};

// Mostrar la vista del juego
exports.view = (req, res) => {
    const character = characterModel.findCharacterById(req.session.characterId);
    res.render('game', { character });
};