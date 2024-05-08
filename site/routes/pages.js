const express = require('express');
const { getTourById, getTours } = require('../database/toursOperations');
const { getAllClients } = require('../database/clientOperations');
const { getToursBySaled, getAllOrders } = require('../database/orderOperations');

const router = express.Router();


router.get('/', async function(req, res){
    let toursResponse = await getTours();
    let tours = toursResponse.tours;

    let resTours = tours.filter((item)=>{
        let amountBool = item.amount <= 0;
        let dateBool = new Date() > new Date(item.startDate);
        return !amountBool && !dateBool;
    })

    res.status(200).render('pages/index', {
        tours: resTours
    });
});

router.get('/tours', async function(req, res){
    res.status(200).render('pages/admin/tours.ejs');

});

router.get('/applications', async function(req, res){
    res.status(200).render('pages/admin/applications.ejs');

});

router.get('/authorization', async function(req, res){
    res.status(200).render('pages/authorization.ejs');

});

router.get('/clients', async function(req, res){
    res.status(200).render('pages/admin/clients.ejs');

});

router.get('/orders', async function(req, res){

    let clientsResponse = await getAllClients();
    let toursResponse = await getTours();

    res.status(200).render('pages/admin/orders.ejs', {
        clients: clientsResponse.clients,
        tours: toursResponse.tours
    });

});

router.get('/tour/:id', async function(req, res){
    let tourId = req.params.id;
    let tourResponse = await getTourById(tourId);
    if (tourResponse.code === 404){
        res.status(404).render('pages/404');
        return;
    }
    let clients = await getAllClients();
    if (clients.code === 404){
        res.status(404).render('pages/404');
        return;
    }
    res.status(200).render('pages/admin/tour.ejs', {
        tour: tourResponse.tour,
        clients: clients.clients
    });
});
router.get('/statistics', async function(req, res){
    let toursResponse = await getTours();
    let tours = toursResponse.tours;
    let getOrdersResponse = await getAllOrders();
    let orders = getOrdersResponse.orders;
    let _, lostMoney = orders.reduce((acc, item) => {
        let discountMoney = item.price * (item.discount / 100);
        console.log(discountMoney);
        return acc + discountMoney;
    }, 0)

    let saledTours = [...tours.sort((a, b) => b.saled - a.saled)];
    let amountTours = [...tours.sort((a, b) => b.amount - a.amount)];

    res.status(200).render('pages/admin/statistics.ejs',{
        saledTours: saledTours,
        amountTours: amountTours,
        lostMoney: Math.round(lostMoney)
    });
});

router.get('/users', async function(req, res){
    res.status(200).render('pages/admin/users.ejs');

});

module.exports = router;