import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import config from '../config/database';

//User Schma
const UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		require: true
	},
	username: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = async function(id){
	return User.findById(id);
}

module.exports.getUserByUsername = async function({username}){
	//const query = {username: username}
	 User.findOne({username});
}

module.exports.addUser = function(newUser){
	bcrypt.genSalt(10, async (err, salt) => {
		const hash = await bcrypt.hash(newUser.password, salt, null, (err, hash) => {
			newUser.password = hash;
			newUser.save();
		});
	});
	return newUser;
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
}