import express from 'express';
import { signUp, signIn, getUsers } from '../controllers/userController';


//const router = express.Router();

 const userRoutes =  app  => {

	//Resiger
	app
		.route('/register')
		.post(signUp);

	//Authenticate
	app
		.route('/authenticate')
		.post(signIn);

	//get all users(for teting pagination)
	app
		.route('/users')
		.get(getUsers);
};



export default userRoutes;
