const body = document.getElementsByTagName('body')[0]

const loadUserPage = async () => {

  const datosUs = await fetch('/profile', {
    method: "POST",
    body: JSON.stringify({
      email: localStorage.getItem('user'),
      contraseña: localStorage.getItem('password')
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('jwt')
    }
  })

  const myData = await datosUs.json()

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

const isLoggedIn = checkLogin();
if(isLoggedIn) {
  loadUserPage()
} else {
  window.location = '/'
}
