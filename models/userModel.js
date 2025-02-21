const fs = require('fs');
const path = './data/users.json';

// Obtener todos los usuarios
const getAllUsers = () => {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
};

// Guardar todos los usuarios
const saveUsers = (users) => {
    fs.writeFileSync(path, JSON.stringify(users, null, 2));
};

// Buscar un usuario por su nombre
const findUserByName = (name) => {
    const users = getAllUsers();
    return users.find(user => user.name === name);
};

// Buscar un usuario por su ID
const findUserById = (id) => {
    const users = getAllUsers();
    return users.find(c => c.id === id);
};

// Cambiar estado de conexión de usuario
const userOnline = (name, isOnline) => {
    let users = getAllUsers();
    const userIndex = users.findIndex(user => user.name === name);
    if (userIndex >= 0) {
        users[userIndex].isOnline = isOnline;
        saveUsers(users);
    }
}

module.exports = { getAllUsers, saveUsers, findUserByName, findUserById, userOnline };
