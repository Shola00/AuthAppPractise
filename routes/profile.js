import express from 'express';
import { getProfile } from '../controllers/profileController';
import  passport  from 'passport';

//const router = express.Router();

const profileRoutes =  app  => {
	
	//Profile
	app
		.route('/profile')
		.get(passport.authenticate('jwt', {session: false}), getProfile);

};

export default profileRoutes;