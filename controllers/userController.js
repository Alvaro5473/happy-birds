const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.index = (req, res) => {
    const users = userModel.getAllUsers();
    res.render('users/index', { users });
};

exports.admin = (req, res) => {
    const users = userModel.getAllUsers();
    res.render('users/admin', { users })
};

exports.login = (req, res) => {
    res.render('users/login');
};

exports.logUser = async (req, res) => {
    const { name, password } = req.body;
    const user = userModel.findUserByName(name);

    if (!user) {
        res.redirect('/login');
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.redirect('/login');
        return;
    }

    userModel.userOnline(name, true);
    req.session.username = name;
    res.redirect('/game');
};

exports.logout = (req, res) => {
    const name = req.session.username;
    userModel.userOnline(name, false);
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error al cerrar la sesión');
        }
        res.redirect('/login');
    });
}

exports.create = (req, res) => {
    res.render('users/register');
};

exports.store = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = userModel.getAllUsers();
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        password: hashedPassword,
        isOnline: false
    };
    users.push(newUser);
    userModel.saveUsers(users);
    res.redirect('/login');
};

exports.edit = (req, res) => {
    const user = userModel.findUserById(parseInt(req.params.id));
    res.render('users/edit', { user });
};

exports.update = (req, res) => {
    let users = userModel.getAllUsers();
    const userIndex = users.findIndex(c => c.id === parseInt(req.params.id));
    if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        userModel.saveUsers(users);
    }
    res.redirect('/admin');
};

exports.delete = (req, res) => {
    let users = userModel.getAllUsers();
    users = users.filter(user => user.id !== parseInt(req.params.id));
    userModel.saveUsers(users);
    res.redirect('/admin');
};