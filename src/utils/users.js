const users = []

//addUser removeUser getUser getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    displayname = username
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //Check and validate for existing user

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'Sorry this username is already taken'
        }
    }

    const user = { id, displayname, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    
    if (index !== -1) {
        //
        return users.splice(index, 1)[0]
    }

}

const getUser = (id) =>{
    const index = users.findIndex((user) => user.id === id)
    return users[index]
}

const getUsersInRoom = (room) =>{
    return users.filter((user)=>user.room === room)
}


module.exports= {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}