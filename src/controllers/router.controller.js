import express, { Router } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import AuthUsers from './auth.controller.js'
import { expressjwt } from 'express-jwt'
// import 'dotenv/config'


const router = Router();
const validateJwt = expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] })

// mongoose.connect(process.env.DB_URLCN)

router.use('/public', express.static(path.join(`${process.cwd()}/app/public`)))
router.use(express.json())

router.get('/', (req, res) => {
  try {
    res.status(200).sendFile(path.join(`${process.cwd()}/app/logInPage.html`));
  } catch(err) {
    console.error(err)
  }
});

router.get('/clave', (req, res) => {
  res.send(process.env.SECRET, process.env.DB_URLCN)
})

// router.post('/register', AuthUsers.register)

// router.post('/login', AuthUsers.login)

/*
router.post('/message', validateJwt, AuthUsers.message)
*/

export default router;
