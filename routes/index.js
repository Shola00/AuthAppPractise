import express from 'express';
import  userRoutes  from './users';
import  profileRoutes  from './profile';

//const router = express.Router();

 const routes =  app => {

	userRoutes(app);
	profileRoutes(app);

}

export default routes;