import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user';
import config from '../config/database';
import jwt from 'jsonwebtoken';

module.exports = function(passport){
	var opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, 
		async (jwt_payload, done) => {
			try {
				console.log(jwt_payload._id)
				const user = await User.getUserById(jwt_payload._id);
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				
			} catch (error) {
			done(error, false);
		}
	}));

	const signIn = async (username, password, cb) => {
		try {

			const user = await User.findOne({username});
				
				if (!user) {
					return cb(null, false, {
						message: 'user not found'
					});
				}

			User.comparePassword(password, user.password, (err, isMatch) => {
				if (isMatch) {
					return cb(null, user,{
						message: 'Login Sucessful'
					});
					} else {
						return cb(null, false,{
							message: 'wrong password'
						});
						//return res.json({sucess: false, msg: 'wrong Password'});
					}
			});
								
		} catch (err) {
			if (err) {
				return cb(null, false,{
							message: err.message
						});
						
			}
		}
		
	}; 

	passport.serializeUser(function(user, cb) {
	    cb(null, user.id);
	});

	passport.deserializeUser(function(id, cb) {
	    User.findOne({
	        id
	    }, function(err, user) {
	        cb(err, users);
	    });
	});


	passport.use(new LocalStrategy({
	    usernameField: 'username',
	    passportField: 'password'
	}, signIn));
}