const generateMessage = (user,text) => {
    return {
        user,
        text,
        createdAt: new Date().getTime(),

    }
}
const generateLocationMessage = (user,url) =>{
    return{
        user,
        url,
        createdAt: new Date().getTime(),

    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
}