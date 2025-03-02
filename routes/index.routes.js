const express = require('express');
const User = require('../models/User');
const router = express.Router();
console.log('In index route\n');

async function getUsername(id) {
	if (!id) {
		return null;
	}
	
	try {
			const user = await User.findOne({ where: { id } });
			return user ? user.username : null;
	} catch (err) {
			console.error('Error fetching username:', err);
			return null;
	}
}

router.get('/', async (req, res) => {  //just like that?
  res.redirect("/products"); 
  // const id = req.signedCookies.userId;
  // const username = await getUsername(id);
  // res.render('index', { userId: id, userName: username});
});

module.exports = router;