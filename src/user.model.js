import mongoose from 'mongoose'

const Cruasan = mongoose.model('Users', {
	name: { type: String, required: true, minLength: 3 },
	lastname: { type: String, required: true, minLength: 3 },
	email: { type: String, required: true, minLength: 7 },
	password: { type: String, required: true, minLength: 8 },
  salt: { type: String, required: true },
  friends: { type: Array }
})

export default Cruasan
