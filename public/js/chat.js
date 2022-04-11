const socket = io()


// Elements
const $messageForm = document.querySelector('#msg-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $usersSidebar = document.querySelector('#sidebar')

// Templates 
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true})


socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        user: message.user,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss A')
    })
    $messages.insertAdjacentHTML('afterbegin', html)
})


socket.on('locationMessage', (myLocationURL) => {
    const html = Mustache.render(locationTemplate, {
        user: myLocationURL.user,
        myLocationURL : myLocationURL.url,
        createdAt : moment(myLocationURL.createdAt).format('h:mm:ss A')
    })
    $messages.insertAdjacentHTML('afterbegin', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()


    // disable form
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.msg_box.value

    socket.emit('sendMessage', message, (msg) => {
        // enable form
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const location = [position.coords.latitude, position.coords.longitude]
        socket.emit('sendLocation', location, (ack_msg) => {
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    })
    $usersSidebar.innerHTML = html
})

socket.emit('join', {username,room}, (error)=>{
    if (error) {
        alert(error)
        location.href = '/'
    }
})