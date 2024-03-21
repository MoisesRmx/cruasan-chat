import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import CruasanChat from '../user.model.js'

const signToken = _id => jwt.sign({ _id }, process.env.SECRET)

const AuthUsers = {
  register: async (req, res) => {
    const { body } = req
    try {
      const isUser = await CruasanChat.findOne({ email: body.email })
      if(isUser) {
        res.send('usuario ya existe')
      } else {
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await CruasanChat.create({ name: body.name, lastname: body.lastname, email: body.email, password: hashed, salt })
        const signed = signToken(user._id)
        res.status(201).send(signed)
      }
    } catch(err) {
      res.status(500).send(err.message)
    }
  },
  login: async (req, res) => {
    const { body } = req
    try {
      const user = await CruasanChat.findOne( { email: body.email })
      if(!user) {
        res.status(403).send('usuario y/o contraseña inválida')
      } else {
        const isMatch = await bcrypt.compare(body.password, user.password)
        if(isMatch) {
          const signed = signToken(user._id)
          res.status(200).send({ jwt: signed })
        } else {
          res.status(403).send('usuario y/o contraseña inválida')
        }
      }
    }
    catch(err) {
      res.status(500).send(err.message)
    }
  },
  profile: async (req, res) => {
    const { id } = req.params
    const user = await CruasanChat.findById({ _id: id })
    res.status(200).send(user)
  },
  message: async (req, res) => {
    const { auth } = req
    res.status(200).send('Mensaje enviado con exito')
    console.log(auth)
  },
  addFriend: async (usuario, nombre) => {
    const user = await CruasanChat.findOne({ name: usuario })
    const friend = await CruasanChat.findOne({ name: nombre })

    user.friends.push({ _id: friend._id, name: `${friend.name} ${friend.lastname}`, messages: [] })
    let a = user.friends.find(usr => usr._id = friend._id)
    // a.messages.push(["redc", "oyes que crees"])
  }
}

// module.exports = AuthUsers

export default AuthUsers
