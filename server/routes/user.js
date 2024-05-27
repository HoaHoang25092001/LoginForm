const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken } = require('../middlewares/verifyToken')

router.post('/register', ctrls.register)
router.put("/finalregister/:token", ctrls.finalRegister)
router.post("/login", ctrls.login)
router.get("/current", [verifyAccessToken], ctrls.getCurrent)
router.post("/forgotpassword", ctrls.forgotPassword)
router.put("/resetpassword", ctrls.resetPassword)
router.get("/logout", ctrls.logout)
module.exports = router