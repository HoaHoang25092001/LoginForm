const router = require('express').Router()
const ctrls = require('../controllers/user')

router.post('/register', ctrls.register)
router.put("/finalregister/:token", ctrls.finalRegister)
router.post("/login", ctrls.login)
router.post("/forgotpassword", ctrls.forgotPassword)
router.put("/resetpassword", ctrls.resetPassword)
router.get("/locgout", trls.logout)
module.exports = router