const UserManager = () => {
    let socketId = null
    const updateSocketId = (newSocketId) => {
        socketId = newSocketId
    }
    const getState = () => {
        return ({ socketId })
    }
    return ({
        getState,
        updateSocketId,
    })
}

export default UserManager