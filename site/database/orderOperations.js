const conn = require('./database');
const mysql = require('mysql2/promise');


module.exports.addOrder = async function addOrder( clientId, tourId, emplyeeName, price, date, discount){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`
        INSERT INTO orders (order_id, client_id, travel_id, employee_name, price, date, discount) VALUES (NULL, '${clientId}', '${tourId}', '${emplyeeName}', '${price}', '${date}', '${discount}');
    `);
    connection.release();
    
    return {
        code: 200,
        orderId: results.insertId
    }

}

module.exports.getAllOrders = async function getAllOrders(){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT * FROM orders`);
    
    let orders = [];

    for (let i = 0; i < results.length; i++) {

        let [resultClient] = await connection.query(`SELECT * FROM clients WHERE client_id = '${results[i].client_id}'`);
        let [resultTours] = await connection.query(`SELECT * FROM travel WHERE travel_id = '${results[i].travel_id}'`);

        let order = {
            id: results[i].order_id,
            employeeCredentials: results[i].employee_name,
            clientCredentials: resultClient[0].credentials,
            clientId: resultClient[0].client_id,
            city: resultTours[0].city,
            phone: resultClient[0].phone,
            passport: resultClient[0].passport,
            discount: results[i].discount,
            price: results[i].price,
            date: results[i].date,
            tourName: resultTours[0].name,
            tourId: resultTours[0].travel_id
        }

        orders.push(order);
    }
    connection.release();
    return {
        code: 200,
        orders: orders
    };
}

module.exports.getOrderById = async function getOrderById(orderId){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT * FROM orders WHERE order_id = '${orderId}'`);
    
    let [resultClient] = await connection.query(`SELECT * FROM clients WHERE client_id = '${results[0].client_id}'`);
    let [resultTours] = await connection.query(`SELECT * FROM travel WHERE travel_id = '${results[0].travel_id}'`);

    let order = {
        id: results[0].order_id,
        clientId: resultClient[0].client_id,
        tourId: resultTours[0].travel_id
    }

    connection.release();
    return {
        code: 200,
        order: order
    };
}

module.exports.deleteOrder = async function deleteOrder(order){
    const connection = await conn.getConnection();

    try {
        await connection.beginTransaction()
        
        let results = [];
        [results] = await connection.query(`DELETE FROM orders WHERE order_id = '${order.id}'`);
        [travelResults] = await connection.query(`SELECT amount FROM travel WHERE travel_id = '${order.tourId}'`);
        [updateTravel] = await connection.query(`UPDATE travel SET amount = ${travelResults[0].amount + 1} WHERE travel_id = '${order.tourId}'`);

        await connection.commit()
        connection.release();
        return {
            code: 200
        }
    } catch (err) {
        await connection.rollback()
        console.log(err);
        connection.release();
        return {
            code: 501,
            error: err.message
        }
    }
}

module.exports.getToursBySaled = async function getToursBySaled(){
    const connection = await conn.getConnection();
    let [results] = await connection.query(`SELECT travel_id, COUNT(travel_id) as count FROM orders GROUP BY travel_id`);
    let [travelResults] =await connection.query(`SELECT travel_id, name FROM travel`);

    let saledTravel = [];

    for (let i = 0; i < results.length; i++){
        saledTravel.push({
            id: results[i].travel_id,
            saled: results[i].count,
            name: travelResults.filter(item => item.travel_id === results[i].travel_id)[0].name
        });
    }
    connection.release();
    return {
        code: 200,
        saledTours: saledTravel
    };
}