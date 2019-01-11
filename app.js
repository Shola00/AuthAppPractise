import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import mongoose from 'mongoose';
import config from './config/database';
import routes  from './routes';
//import userRoutes from './routes/users';
//const users = require('./routes/users');

//Connect to Database
mongoose.connect('mongodb://localhost:27017/meanauth', { useMongoClient: true });

//on Connection
mongoose.connection.on('connected', () => {
	console.log('connected to database' + config.database)
});

//on Error
mongoose.connection.on('error', (err) => {
	console.log('Database error: ' + err)
});

const app = express();


//port number
const port = 3000;

//CORS Middleware
app.use(cors());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Paser Midleware
app.use(bodyParser.json());
//app.use('/users', router);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

routes(app);

//Index route
app.get('/', (req, res) => {
	res.send('invalid endpoint');
});

//Start Server
app.listen(port, () => {
	console.log('Server started at port' + port);
});