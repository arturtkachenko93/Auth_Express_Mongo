const Router = require('express')
const controller = require('./authController')
const router = new Router()
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

// middleware для валидации
const {check} = require('express-validator')

router.post('/registration', [
  check('username', 'Username cannot be empty!').notEmpty(),
  check('password', 'Password is invalid!').isLength({min: 4, max: 10})
],  controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['USER']), controller.getUsers)
router.get('/catalog', roleMiddleware(['USER']), controller.getCatalog)

module.exports = router
