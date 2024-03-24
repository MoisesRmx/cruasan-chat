const checkLogin = () => localStorage.getItem('jwt')
// const checkLogin = () => false

const loadLoginTemplate = () => {
  const template = `
      <div class="formContainer">
        <h3>Log In</h3>
        <form  id="formData">
          <input type="text" name="email" placeholder="Username">
          <input type="password" name="password" placeholder="Password">
          <button>Log In</button>
        </form>
        <p>Don't have an account? <span>Sign Up</span></p>
        <span id="Error"><span>
      </div>
`
  const root = document.getElementById('mainCesion')
  root.innerHTML = template

  const loginListener = () => {
    const loginForm = document.getElementById('formData')
    loginForm.onsubmit = async (e) => {
      e.preventDefault()
      const formData = new FormData(loginForm)
      const data = Object.fromEntries(formData.entries())
      const sendData = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      
      if (sendData.status >= 300) {
        return document.getElementById('Error').innerText = 'Error al iniciar cesion'
      } else {
        const response = await sendData.json()
        const dataStorage = localStorage.setItem('jwt', `Bearer ${response.jwt}`)
        const emailStorage = localStorage.setItem('user', data.email)
        const passswordStorage = localStorage.setItem('password', data.password)
        window.location = "home"
      }
    }
  const signupButton = document.querySelector('.formContainer p span')
    signupButton.onclick = () => loadSignupTemplate()
  }
  loginListener()

}

const loadSignupTemplate = () => {
  const template = `
      <div class="formContainer">
        <h3>Sign Up</h3>
        <form id="formData">
          <input type="text" name="name" placeholder="First Name">
          <input type="text" name="lastname" placeholder="Last Name">
          <input type="email" name="email" placeholder="Email">
          <input type="password" name="password" placeholder="Password">
          <button>Sign Up</button>
        </form>
        <p>Already have an account? <span>Sign In</span></p>
      </div>
  `
  const root = document.getElementById('mainCesion')
  root.innerHTML = template

  const addRegisterListener = () => {
    const registerForm = document.getElementById('formData')
    registerForm.onsubmit = async (e) => {
      e.preventDefault()
      const formData = new FormData(registerForm)
      const data = Object.fromEntries(formData.entries())
      const sendData = await fetch('/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response = await sendData.text()
      registerForm.reset()
      console.log(response)
    }
  }

  addRegisterListener()
  const signupButton = document.querySelector('.formContainer p span')
  signupButton.onclick = () => loadLoginTemplate()
}

  const isLoggedIn = checkLogin();
  if(isLoggedIn) {
    window.location = '/home'
  } else {
    loadLoginTemplate();
  }
