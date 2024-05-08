const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser')

const pagesRouter = require('./routes/pages');
const apiRouter = require('./routes/api');


const app = express();
app.set('view engine', 'ejs')
// app.set('views', __dirname + '\views');
app.use('/', express.static(path.join(__dirname, 'public')));

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.use('/', pagesRouter);
app.use('/api', apiRouter);


app.use(function(req, res, next){
    console.log(req.originalUrl);
    next();
});


app.all('*', (req, res) => {
    res.status(404).render('pages/404');
}); 


// START SERVER
app.listen(3000, function(){
    console.log(`[x] SITE IS RUNNING [x]`);
});