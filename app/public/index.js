const loadUserPage = async () => {

 let myData = {
    "name": "Chuck",
    "lastname": "Norris",
    "email": "chucknorris@bee.com",
    "friends": [
      {
        "name": "Bruce",
        "lastname": "Lee",
        "messages": [
          ["redc", "Hi! I don't think I know you, is it your firts day?"],
          ["send", "Hi! Yes, I'm starting my English lessons today."],
          ["redc", "My name's Bruce Lee, nice to meet you"],
          ["send", "Chuck Norris XD, nice to meet you too."],
        ]
      },
    ]
  }

  const body = document.getElementsByTagName('body')[0]
  body.innerHTML = ''

  let mainChatNya = document.createElement('main')
  mainChatNya.className = 'mainChatNya'
  body.appendChild(mainChatNya)
  let sidebar = document.createElement('aside')
  sidebar.className = 'sidebar'
  mainChatNya.appendChild(sidebar)
  let chatTools = document.createElement('div')
  chatTools.className = 'chatTools'
  sidebar.appendChild(chatTools)
  let toolsDropdownMenu = document.createElement('div')
  toolsDropdownMenu.className = 'toolsDropdownMenu'
  toolsDropdownMenu.innerText = '☰'
  chatTools.appendChild(toolsDropdownMenu)
  let searchUsers = document.createElement('input')
  searchUsers.type = 'text'
  searchUsers.name = 'searchUsers'
  searchUsers.placeholder = 'Buscar...'
  chatTools.appendChild(searchUsers)
  let chatbar = document.createElement('div')
  chatbar.className = 'chatbar'
  sidebar.appendChild(chatbar)
  let chatWindow = document.createElement('section')
  chatWindow.className = 'chatWindow'
  mainChatNya.appendChild(chatWindow)

  myData.friends.map(user => {
    let chatUserProfile = document.createElement('div')
    chatUserProfile.className = 'chatUserProfile'
    chatUserProfile.innerHTML = `
      <h2>${user.name} ${user.lastname}</h2>
      <span>${user.messages[user.messages.length - 1][1]}</span>
    `
    chatUserProfile.onclick = () => {
      chatWindow.innerHTML = ''
      let navChatWindow = document.createElement('nav')
      navChatWindow.innerHTML = `<h3>${user.name} ${user.lastname}</h3>`
      navChatWindow.className = 'navChatWindow'
      let loadMessageWindow = document.createElement('ul')
      user.messages.forEach(usr => {
        loadMessageWindow.innerHTML += `<li class=${usr[0]}><span>${usr[1]}</span></li>`
      })
      loadMessageWindow.className = 'loadMessageWindow'
      let formMessage = document.createElement('form')
      formMessage.id = 'formMessage'
      formMessage.innerHTML = `
        <input type="text" name="message" placeholder="Escribe un mensaje">
        <button></button>
      `
      formMessage.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(formMessage)
        const data = Object.fromEntries(formData.entries())
        if (data.message.length > 1) {
          user.messages.push(['send', data.message])
          loadMessageWindow.innerHTML += `<li class='send'><span>${data.message}</span></li>`

          /*
          const sendMessage = await fetch('/message', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Authorization': localStorage.getItem('jwt'),
              'Content-Type': 'application/json'
            }
          })
          console.log(await sendMessage.text())
          */
          formMessage.reset()
        }
      }

      let bloques = [navChatWindow,loadMessageWindow,formMessage]
      bloques.forEach(item => chatWindow.appendChild(item))
    }
    chatbar.appendChild(chatUserProfile)
  })
}

const checkLogin = () => localStorage.getItem('jwt')
// const checkLogin = () => true

const loadLoginTemplate = () => {
  const template = `
    <main class="mainLoginNya">
      <div class="logIn">
        <h3>Log In</h3>
        <form  id="formLogin">
          <input type="text" name="email" placeholder="Username">
          <input type="password" name="password" placeholder="Password">
          <button>Log In</button>
        </form>
        <p>Don't have an account? <span>Sign Up</span></p>
      </div>
    </main>
`
  const body = document.getElementsByTagName('body')[0]
  body.innerHTML = template

  const loginListener = () => {
    const loginForm = document.getElementById('formLogin')
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
      const response = await sendData.json()
      if (sendData.status >= 300) {
        console.log('Error al inicial cesión')
      } else {
        const dataStorage = localStorage.setItem('jwt', `Bearer ${response.jwt}`)
        loadUserPage()
      }
    }
  }
  loginListener()

  const signupButton = document.querySelector('.logIn p span')
  signupButton.onclick = () => loadSignupTemplate()
}

const loadSignupTemplate = () => {
  const template = `
    <main class="mainSignupNya">
      <div class="signUp">
        <h3>Sign Up</h3>
        <form id="formSignup">
          <input type="text" name="name" placeholder="First Name">
          <input type="text" name="lastname" placeholder="Last Name">
          <input type="email" name="email" placeholder="Email">
          <input type="password" name="password" placeholder="Password">
          <button>Sign Up</button>
        </form>
        <p>Already have an account? <span>Sign In</span></p>
      </div>
    </main>
  `
  const body = document.getElementsByTagName('body')[0]
  body.innerHTML = template

  const addRegisterListener = () => {
    const registerForm = document.getElementById('formSignup')
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
  const signupButton = document.querySelector('.signUp p span')
  signupButton.onclick = () => loadLoginTemplate()
}

window.onload = () => {
  const isLoggedIn = checkLogin();
  if(isLoggedIn) {
    loadUserPage()
  } else {
    loadLoginTemplate();
    // loadSignupTemplate()
  }
}
