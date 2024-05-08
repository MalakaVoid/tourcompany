const conn = require('./database');
const mysql = require('mysql2/promise');


module.exports.getTours = async function getTours(){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT * FROM travel`);
    
    let tours = [];

    for (let i = 0; i < results.length; i++) {
        let [saled] = await connection.query(`SELECT count(order_id) as count  FROM orders WHERE travel_id = '${results[i].travel_id}'`);

        let tour = {
            id: results[i].travel_id,
            name: results[i].name,
            startDate: results[i].start_date,
            endDate: results[i].end_date,
            city: results[i].city,
            services: results[i].services,
            price: results[i].price,
            amount: results[i].amount,
            saled: saled[0].count
        }

        tours.push(tour);
    }
    connection.release();
    return {
        code: 200,
        tours: tours
    };

}

module.exports.getTourById = async function getTourById(id){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT * FROM travel WHERE travel_id = '${id}'`);

    if(results.length === 0){
        connection.release();
        return {
            code: 404,
            tour: null
        };
    }

    let tour = {
        id: results[0].travel_id,
        name: results[0].name,
        startDate: results[0].start_date,
        endDate: results[0].end_date,
        city: results[0].city,
        services: results[0].services,
        price: results[0].price,
        amount: results[0].amount,
    }

    connection.release();
    return {
        code: 200,
        tour: tour
    };

}

module.exports.setTourAmount = async function setTourAmount(id, amount){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`
        UPDATE travel SET amount = '${amount}' WHERE travel_id = '${id}'
    `);

    connection.release();
    return {
        code: 200,
    };

}

module.exports.addTour = async function addTour(name, startDate, endDate, city, services, price, amount){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`INSERT INTO travel (travel_id, name, start_date, end_date, city, services, price, amount) VALUES (NULL, '${name}', '${new Date(startDate).toISOString().split('T')[0]}', '${new Date(endDate).toISOString().split('T')[0]}', '${city}', '${services}', '${price}', '${amount}');`);

    connection.release();
    return {
        code: 200,
        tourId: results.insertId
    };

}