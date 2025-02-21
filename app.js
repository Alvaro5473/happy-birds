const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const characterController = require('./controllers/characterController');
const gameController = require('./controllers/gameController');
const userController = require('./controllers/userController'); 
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Permitir JSON en el cuerpo de las solicitudes
app.use(express.static('public'));

app.use(session({
    secret: 'miSecretoSuperSecreto',  // Se usa para firmar el ID de la sesión (importante que sea secreto)
    resave: false,                    // No guardar sesión si no se ha modificado
    saveUninitialized: true,          // Guarda una sesión nueva aunque no se haya inicializado
    cookie: { secure: false }         // Configuración de las cookies de sesión (secure: true solo en HTTPS)
}));

// Variables de sesión
app.use((req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.characterId = req.session.characterId;
    next();
});

// Root route
app.get('/', (req, res) => {
    res.redirect('/game');
});

// CRUD routes for characters
app.get('/characters', gameController.isAuthenticated, characterController.index);
app.post('/characters', gameController.isAuthenticated, characterController.store);
app.get('/characters/new', gameController.isAuthenticated, characterController.create);
app.get('/characters/:id/edit', gameController.isAuthenticated, characterController.edit);
app.post('/characters/:id/update', gameController.isAuthenticated, characterController.update);
app.post('/characters/:id/delete', gameController.isAuthenticated, characterController.delete);

// Game routes
app.get('/game', gameController.isAuthenticated, gameController.view);
app.post('/game/select', gameController.isAuthenticated, gameController.chooseCharacter);

// Users routes
app.get('/register', userController.create);
app.post('/register', userController.store);
app.get('/login', userController.login);
app.post('/login', userController.logUser);
app.get('/admin', gameController.isAdmin, userController.admin);
app.get('/users/:id/edit', gameController.isAdmin, userController.edit);
app.post('/users/:id/update', gameController.isAdmin, userController.update);
app.post('/users/:id/delete', gameController.isAdmin, userController.delete);
app.get('/logout', gameController.isAuthenticated, userController.logout);
app.get('/users', gameController.isAuthenticated, userController.index);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
