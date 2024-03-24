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
    const { body } = req
    try {
      const user = await CruasanChat.findOne({ email: body.email })
      const isMatch = await bcrypt.compare(body.contraseña , user.password)
      res.status(200).send({
        name: user.name,
        lastname: user.lastname,
        friends: user.friends,
      })
    } catch(err) {
      console.error(err)
    }
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

/*
async function obte() {
  const body = {
    jwt: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWZjZWQ1ZTc5YTM0MjYyZDUzZWJiNjAiLCJpYXQiOjE3MTEyNDEwMDN9.9vk8ZND2H601occ3WQUbK0dZXA05J4P03SPg3eU9WHE",
    email: "aloramirez@nya.com"
  }

  const signToken = _id => jwt.sign({ _id }, process.env.SECRET)
  console.log(signToken("moisesroberto"))
  try {
    const user = await CruasanChat.findOne({ email: body.email })
    const isMatch = await bcrypt.compare(user._id, body.jwt)
    console.log(isMatch)
  } catch(err) {
    console.error(err)
  }
}

obte()
  */

// module.exports = AuthUsers

export default AuthUsers
