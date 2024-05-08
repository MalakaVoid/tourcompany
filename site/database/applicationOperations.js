const conn = require('./database');
const mysql = require('mysql2/promise');
const { getTourById } = require('./toursOperations');

module.exports.addApplication = async function addApplication(tourId, name, phone){
    const connection = await conn.getConnection();
    let [results] = await connection.query(
        `INSERT INTO application (application_id, travel_id, name, phone) VALUES (NULL, '${tourId}', '${name}', '${phone}');`
    );

    connection.release();
    return {
        code: 200,
        applicationId: results.insertId
    };
}

module.exports.getAllApplications = async function getAllApplications(tourId, name, phone){
    const connection = await conn.getConnection();
    let [results] = await connection.query(
        `SELECT * FROM application`
    );

    let apps = [];

    for (let i = 0; i < results.length; i++) {
        let tour = await getTourById(results[i].travel_id);
        let app = {
            id: results[i].application_id,
            tourId: results[i].travel_id,
            tourName: tour.tour.name,
            name: results[i].name,
            phone: results[i].phone
        }
        apps.push(app);
    }

    connection.release();
    return {
        code: 200,
        applications: apps
    };
}

module.exports.deleteApplication = async function deleteApplication(id){
    const connection = await conn.getConnection();
    let [results] = await connection.query(
        `DELETE FROM application WHERE application_id = ${id}`
    );

    connection.release();
    return {
        code: 200,
    };
}