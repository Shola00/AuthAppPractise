import User from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config/database';
import  passport  from 'passport';

export const signUp = async (req, res, next) => {
	try{

		if( await User.count({ email: req.body.email}) > 0)
                throw new Error('email already taken');

        if( await User.count({ username: req.body.username}) > 0)
            throw new Error('username already taken');
            
		let newUser = new User({
			name: req.body.name,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});
		const user = await User.addUser(newUser);
		res.json(user);
	} catch (err) {
		//return res.json({sucess: false, msg: 'failed to register'});
		//return res(err.message);
		if (err) {
			return res.json(err.message);
		}
	}
};

export const signIn = async ( req, res) => {

	passport.authenticate('local', async function(err, user, info) {
		if ((err) || (!user)) {

		    var errMsg = info? info.message: 'Server error';

		    return res.json(errMsg);
		}

		const body = { payload: { _id : user._id, email : user.email } };
		const token = jwt.sign(JSON.parse(JSON.stringify(body.payload)), config.secret, {
			expiresIn: 604800 //1 week
		});

		res.json({
			sucess: true,
			token: 'JWT ' + token,
			user: {
				id: user._id,
				name: user.name,
				username: user.username,
				email: user.email
				//password: user.password
			}
		});
	})(req, res);

}; 

export const getUsers = async (req, res) => {

	try {

		 const pageNo = parseInt(req.query.page) || 1
		 const size = parseInt(req.query.size) || 10
		 const query = {}

		if(pageNo < 0 || pageNo === 0) {
			var response = {"error" : true, "message" : "invalid page number, should start with 1"};
			return res.json(response)
		}

		query.skip = size * (pageNo - 1) || 0
		query.limit = size || 10
		//query.sort = 'created_at DESC'

		const totalCount = await User.count({});
	
		const users = await User.find({}, {}, query);

			
		var totalPages = Math.ceil(totalCount / size);

		response = {"error" : false, "message" : users, "pages": totalPages};

	    res.setHeader("X-Pagination-Page-Count", users.length);
        res.setHeader("X-Pagination-Per-Page", query.limit);
        res.setHeader("X-Pagination-Current-Page", pageNo);
        res.setHeader("X-Pagination-Total-Count", totalCount);

		res.json(response);
	}catch(err){
		return res.send(err.message);
	}
};

