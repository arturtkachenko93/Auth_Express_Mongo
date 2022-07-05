const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config')

const generateAccessToken = (id, roles) => {
  const payload =  {
    id,
    roles
  }

  return jwt.sign(payload, secret, {expiresIn: '24h'} )
}

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({message: 'Auth error!', errors})
      const {username, password} = req.body
      const candidate = await User.findOne({username})
      if (candidate) return res.status(400).json({message: 'User already used!'})
      const hashPassword = bcrypt.hashSync(password, 6)
      const userRole = await Role.findOne({value: 'USER'})
      const user = new User({username, password: hashPassword, roles: [userRole.value]})
      await user.save()
      return res.json({message: 'User success registration!'})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Registration error!'})
    }
  }

  async login(req, res) {
    try {
      const {username, password} = req.body
      const user = await User.findOne({username})
      if (!user) return res.status(400).json({message: 'User with this name will not find!'})
      const validPassword = bcrypt.compareSync(password, user.password)
      if(!validPassword) return res.status(400).json({message: 'Password is invalid!'})
      const token = generateAccessToken(user._id, user.roles )
      return res.json({token})
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Login error!'})
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users)
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Get users error!'})
    }
  }

  async getCatalog(req, res) {
    try {
      res.send("Get catalog ...")
    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Get catalog error!'})
    }
  }
}

module.exports = new authController()
