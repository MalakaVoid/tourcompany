const conn = require('./database');
const mysql = require('mysql2/promise');


module.exports.getAllClients = async function getAllClients(){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT * FROM clients`);
    
    let clients = [];

    for (let i = 0; i < results.length; i++) {

        let client = {
            id: results[i].client_id,
            credentials: results[i].credentials,
            phone: results[i].phone,
            passport: results[i].passport,
            discount: results[i].discount
        }

        clients.push(client);
    }
    connection.release();
    return {
        code: 200,
        clients: clients
    };
}

module.exports.getClientById = async function getClientById(client_id){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT * FROM clients WHERE client_id = '${client_id}'`);
    
    if (results.length === 0) {
        connection.release();
        return {
            code: 404,
            client: null
        };
    }

    let client = {
        id: results[0].client_id,
        credentials: results[0].credentials,
        phone: results[0].phone,
        passport: results[0].passport,
        discount: results[0].discount
    }

    connection.release();
    return {
        code: 200,
        client: client
    };
}

module.exports.addClient = async function addClient(credentials, phone, passport, discount){
    const connection = await conn.getConnection();
    let [results] = await connection.query(
        `INSERT INTO clients (client_id, credentials, phone, passport, discount) VALUES (NULL, '${credentials}', '${phone}', '${passport}', '${discount}');`
    );

    connection.release();
    return {
        code: 200,
        client: {
            clientId: results.insertId
        }
    };
}