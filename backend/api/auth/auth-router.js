const bcrypt = require('bcryptjs')
const router = require('express').Router()
const User = require('../user/user-model')
const mid = require('./auth-middleware')

router.post('/register', mid.uniqueUsername, async (req, res) => {
  try {
    const { username, password } = req.body
    const newUser = await User.insert({
      username,
      password: bcrypt.hashSync(password, 8),
    })
    res.status(201).json({ message: `Welcome, ${username}!`, data: newUser })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', mid.usernameExists, async (req, res) => {
  try {
    const { body: { password }, user } = req
    if (bcrypt.compareSync(password, user.password)) {
      res.json({
        message: `welcome, ${user.username}`,
        token: mid.generateToken(user),
      })
    } else {
      res.status(401).json({ message: 'invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/check', mid.isRegisteredUser)

module.exports = router
