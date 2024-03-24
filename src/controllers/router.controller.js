import express, { Router } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import AuthUsers from './auth.controller.js'
import { expressjwt } from 'express-jwt'

const router = Router();
const validateJwt = expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] })

mongoose.connect(process.env.MONGODB_URI)

router.use('/cesionSrc', express.static(path.join(`${process.cwd()}/app/cesionSrc`)))
router.use('/homeSrc', express.static(path.join(`${process.cwd()}/app/homeSrc`)))
router.use(express.json())

router.get(('/'), (req, res) => {
  try {
    res.status(200).sendFile(path.join(`${process.cwd()}/app/cesionPage.html`));
  } catch(err) {
    console.error(err)
  }
});

router.get('/home', (req, res) => {
  try {
    res.sendFile(path.join(`${process.cwd()}/app/homePage.html`))
  } catch(err) {
    console.error(err)
  }
})

router.post('/profile', validateJwt, AuthUsers.profile)

router.post('/register', AuthUsers.register)

router.post('/login', AuthUsers.login)

/*
router.post('/message', validateJwt, AuthUsers.message)
*/

export default router;
