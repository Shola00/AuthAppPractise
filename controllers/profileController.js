
export const getProfile = (req, res, next) => {
	res.json({user: req.user})
};