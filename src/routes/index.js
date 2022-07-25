const router = require("express").Router();
const user = require('./');


router.use('/user', user);

module.exports = router;