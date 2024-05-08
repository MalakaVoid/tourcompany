const conn = require('./database');
const mysql = require('mysql2/promise');


module.exports.getAllUsers = async function getAllUsers(){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT * FROM users`);
    
    let users = [];

    for (let i = 0; i < results.length; i++) {

        let user = {
            id: results[i].user_id,
            login: results[i].login,
            password: results[i].password,
            name: results[i].name,
        }

        users.push(user);
    }
    connection.release();
    return {
        code: 200,
        users: users
    };
}

module.exports.addUser = async function addUser(login, password, name){
    const connection = await conn.getConnection();
    let [results] = await connection.query(
        `INSERT INTO users (user_id, login, password, name) VALUES (NULL, '${login}', '${password}', '${name}');`
    );

    connection.release();
    return {
        code: 200,
        userId: results.insertId
    };
}

module.exports.deleteUser = async function deleteUser(userId){
    const connection = await conn.getConnection();
    let [results] = await connection.query(
        `DELETE FROM users WHERE user_id = '${userId}'`
    );

    connection.release();
    return {
        code: 200,
    };
}

module.exports.getUserByLogin = async function getUserByLogin(login){
    const connection = await conn.getConnection();
    let [results] = await connection.query(
        `SELECT * FROM users WHERE login = '${login}'`
    );
    connection.release();

    if (results.length <= 0)
    {
        return {
            code: 404,
            user: null
        };
    }
    return {
        code: 200,
        user: results[0]
    };
}