module.exports = {
	database: process.env.NODE_ENV == 'test' ? 'mongodb://localhost:27017/meanauth-test' : 'mongodb://localhost:27017/meanauth',
	secret: 'yoursecret'
};