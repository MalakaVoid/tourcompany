const express = require('express');
const { getTours, getTourById, setTourAmount, addTour } = require('../database/toursOperations');
const { getAllClients, addClient, getClientById } = require('../database/clientOperations');
const { addOrder, getAllOrders, getOrderById, deleteOrder } = require('../database/orderOperations');
const { getAllUsers, addUser, deleteUser, getUserByLogin } = require('../database/usersOperations');
const { addApplication, getAllApplications, deleteApplication } = require('../database/applicationOperations');

const router = express.Router();


router.get('/tours/getalltours', async function(req, res){
    let getToursResponse = await getTours();

    if (getToursResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json(getToursResponse);

});

router.post('/tours/addtour', async function(req, res){
    let name = req.body.name;
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);
    let city = req.body.city;
    let services = req.body.services;
    let price = req.body.price;
    let amount = req.body.amount;

    let responseAddTour = await addTour(name, startDate, endDate, city, services, price, amount);

    if (responseAddTour.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
        tourId: responseAddTour.tourId
    });

});

router.get('/clients/getallclients', async function(req, res){
    let getClientsResponse = await getAllClients();

    if (getClientsResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json(getClientsResponse);

});

router.post('/clients/getclientdiscount', async function(req, res){
    let clientId = req.body.clientId;
    let getClientsResponse = await getClientById(clientId);

    if (getClientsResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
        discount: getClientsResponse.client.discount
    });

});

router.post('/clients/addclient', async function(req, res){
    let credentials = req.body.credentials;
    let phone = req.body.phone;
    let passport = req.body.passport;
    let discount = req.body.discount;

    let addClientResponse = await addClient(credentials, phone, passport, discount)

    if (addClientResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json(addClientResponse);

});

router.post('/orders/addorder', async function(req, res){
    let tourId = req.body.tourId;
    let employeeName = req.body.employeeName;
    let clientId = req.body.clientId;
    
    let tourResponse = await getTourById(tourId);
    if (tourResponse.tour.amount <= 0){
        res.status(200).json({code: 404, message: 'Данный тур закончился!'});
        return;
    }
    if (tourResponse.tour.startDate <= new Date()){
        res.status(200).json({code: 404, message: 'Данный тур закончился!'});
        return;
    }
    let price = tourResponse.tour.price;

    let clientResponse = await getClientById(clientId);
    let discount = clientResponse.client.discount;
    

    // let price = tourPirce * ((100 - discount) / 100);

    let date = new Date().toISOString().split('T')[0];

    let addOrderResponse = await addOrder(clientId, tourId, employeeName, price, date, discount);
    if (addOrderResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }
    let tourAmountResponse = await setTourAmount(tourResponse.tour.id, tourResponse.tour.amount <= 0?0:tourResponse.tour.amount - 1)
    if (tourAmountResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }
    res.status(200).json({
        code: 200,
    });

});

router.post('/orders/addorderuser', async function(req, res){
    let tourId = req.body.tourId;
    let employeeName = req.body.employeeName;
    let client = req.body.client;
    let discount = client.discount;

    let tourResponse = await getTourById(tourId);
    if (tourResponse.tour.amount <= 0){
        res.status(200).json({code: 404, message: 'Данный тур закончился!'});
        return;
    }
    let price = tourResponse.tour.price;

    let clientResponse = await addClient(client.credentials, client.phone, client.passport, client.discount);
    let clientId = clientResponse.client.clientId;
    
    let date = new Date().toISOString().split('T')[0];

    let addOrderResponse = await addOrder(clientId, tourId, employeeName, price, date, discount);
    if (addOrderResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }
    let tourAmountResponse = await setTourAmount(tourResponse.tour.id, tourResponse.tour.amount <= 0?0:tourResponse.tour.amount - 1)
    if (tourAmountResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }
    res.status(200).json({
        code: 200,
    });

});

router.get('/orders/getorders', async function(req, res){

    let getOrdersResponse = await getAllOrders();

    if (getOrdersResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
        orders: getOrdersResponse.orders
    });

});

router.post('/orders/discardorder', async function(req, res){
    let orderId = req.body.orderId;

    let getOrderResponse = await getOrderById(orderId);
    if (getOrderResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    let deleteOrderResponse = await deleteOrder(getOrderResponse.order);
    if (deleteOrderResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
    });

});

router.get('/users/getusers', async function(req, res){

    let getUsersResponse = await getAllUsers();
    if (getUsersResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
        users: getUsersResponse.users
    });

});

router.post('/users/adduser', async function(req, res){
    let login = req.body.login;
    let password = req.body.password;
    let name = req.body.name;

    let addUserResponse = await addUser(login, password, name)

    if (addUserResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
        users: addUserResponse.userId
    });

});

router.post('/users/deleteuser', async function(req, res){
    let id = req.body.id;

    let deleteUserResponse = await deleteUser(id);

    if (deleteUserResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
    });

});

router.post('/application/addapplication', async function(req, res){
    let tourId = req.body.tourId;
    let name = req.body.name;
    let phone = req.body.phone;

    let appResponse = await addApplication(tourId, name, phone);

    if (appResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
    });

});

router.get('/application/getapplications', async function(req, res){
    let appResponse = await getAllApplications();

    if (appResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
        applications: appResponse.applications
    });

});

router.post('/application/deleteapplication', async function(req, res){
    let id = req.body.id;

    let deleteAppResponse = await deleteApplication(id);
    if (deleteAppResponse.code != 200){
        res.status(501).json({code: 501});
        return;
    }

    res.status(200).json({
        code: 200,
    });

});

router.post('/authorization', async function(req, res){
    let login = req.body.login;
    let password = req.body.password;

    let loginResponse = await getUserByLogin(login);

    if (loginResponse.code === 404){
        res.status(200).json({
            code: 404,
            message: 'Пользователь не найден'
        });
        return;
    }

    if (loginResponse.user.password != password){
        res.status(200).json({
            code: 404,
            message: 'Неверный пароль'
        });
        return;
    }

    res.status(200).json({
        code: 200,
        userId: loginResponse.user.user_id
    });

});

module.exports = router;