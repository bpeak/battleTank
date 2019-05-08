import io from 'socket.io-client'
//managers
import GameStateManager from './managers/GameStateManager'
import TouchPadManager from './managers/TouchPadManager'
import UserManager from './managers/UserManager'
import ImageManager from './managers/ImageManager'

//utils
import getMousePos from './utils/getMousePos'

const mainCanvas = document.getElementById("mainCanvas")
const mainCtx = mainCanvas.getContext("2d")
mainCanvas.width = 3000
mainCanvas.height = 1500
const gameCanvas = document.createElement("canvas")
const gameCtx = gameCanvas.getContext("2d")
gameCanvas.width = mainCanvas.width
gameCanvas.height = mainCanvas.height
const minimapCanvas = document.createElement("canvas")
const minimapCtx = minimapCanvas.getContext("2d")
minimapCanvas.width = mainCanvas.width
minimapCanvas.height = mainCanvas.height
const bufferCanvas = document.createElement("canvas")
const bufferCtx = bufferCanvas.getContext("2d")
bufferCanvas.width = mainCanvas.width
bufferCanvas.height = mainCanvas.height

//create Managers
const touchPadManager = TouchPadManager({ canvasWidth : mainCanvas.width, canvasHeight : mainCanvas.height })
const gameStateManager = GameStateManager()
const userManager = UserManager()
const imageManager = ImageManager()

//create socket
const socket = io("172.30.1.30")

socket.on("state-init", async (data) => {
    try{
        gameStateManager.initMaps(data.state.maps, mainCanvas.width, mainCanvas.height)
        gameStateManager.updateState(data.state)
        userManager.updateSocketId(data.socketId)
        await imageManager.load()
        gameStateManager.updateProcessState("START")
    } catch ( err ) {

    }
})

const log = (data) => {
    socket.emit("log", data)
}

socket.on("user-init", (user) => {

})

socket.on("state-new", (newState) => {
    gameStateManager.updateState(newState)
})

socket.emit("player-new")

socket.on("newState", (data) => {

})




document.getElementById("btn").addEventListener("click", () => {
    document.documentElement.webkitRequestFullScreen()
    document.getElementById("btn").remove()
    log(mainCanvas.width)
})

mainCanvas.addEventListener("touchmove", (e) => {
    for(let i = 0; i < e.touches.length; i++){
        const { mouseX, mouseY } = getMousePos(mainCanvas, { clientX : e.touches[i].clientX, clientY : e.touches[i].clientY })
        touchPadManager.moveHandler({ mouseX, mouseY })
    }
    // const mouseEvent = new MouseEvent("mousemove", {
    //     clientX: touch.clientX,
    //     clientY: touch.clientY,
    // })
    // mainCanvas.dispatchEvent(mouseEvent)
})

mainCanvas.addEventListener("touchstart", (e) => {
    for(let i = 0; i < e.touches.length; i++){
        const { mouseX, mouseY } = getMousePos(mainCanvas, { clientX : e.touches[i].clientX, clientY : e.touches[i].clientY })
        touchPadManager.startHandler({ mouseX, mouseY })
    }
})

mainCanvas.addEventListener("click", (e) => {
    const { mouseX, mouseY } = getMousePos(mainCanvas, { clientX : e.clientX, clientY : e.clientY })
    touchPadManager.startHandler({ mouseX, mouseY })
})

mainCanvas.addEventListener("touchend", (e) => {
    for(let i = 0; i < e.changedTouches.length; i++){
        const { mouseX, mouseY } = getMousePos(mainCanvas, { clientX : e.changedTouches[i].clientX, clientY : e.changedTouches[i].clientY })
        touchPadManager.endHandler({ mouseX, mouseY })
    }
    // const touch = e.touches[0]
    // const { mouseX, mouseY } = getMousePos(mainCanvas, { clientX : touch.clientX, clientY : touch.clientY })
    // touchPadManager.updateBallPosition({
    //     distanceX : 0,
    //     distanceY : 0,
    //     sinE : 0,
    //     cosE : 0,
    // })
})

mainCanvas.addEventListener("mousemove", (e) => {
    const { mouseX, mouseY } = getMousePos(mainCanvas, e)
    touchPadManager.moveHandler({ mouseX, mouseY })
    // const {
    //     bgBallR,
    //     bgBallX,
    //     bgBallY,
    // } = touchPadManager.getStatus()
    // const distanceX = mouseX - bgBallX
    // const distanceY = mouseY - bgBallY
    // const distanceR = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))
    // const sinE = distanceY / distanceR 
    // const cosE = distanceX / distanceR
    // if(distanceR <= bgBallR){
    //     touchPadManager.updateBallPosition({
    //         distanceX,
    //         distanceY,
    //         sinE,
    //         cosE,
    //     })
    //     log(
    //         `${distanceX}, ${distanceY} DX DY`
    //     )
    // }
    // socket.emit("ready", { test : getMousePos(mainCanvas, e)})
})

// mainCanvas.addEventListener("mousemove", (e) => {
//     console.log("엥?")
//     const { mouseX , mouseY } = getMousePos(mainCanvas, e)
//     const {
//         bgBallR,
//         bgBallX,
//         bgBallY,
//     } = touchPadManager.getStatus()
//     const distanceX = bgBallX - mouseX
//     const distanceY = bgBallY - mouseY
//     const ddr = Math.sqrt(Math.pow(distanceX) + Math.pow(distanceY))
//     console.log(ddr, '이게 작으면데 머보다? ', bgBallR)
//     log({
//         x,
//         y,
//     })
//     // socket.emit("ready", { test : getMousePos(mainCanvas, e)})
// })

// const keyManager = (() => {
//     const KEYCODE_LEFT = 37
//     const KEYCODE_UP = 38
//     const KEYCODE_RIGHT = 39
//     const KEYCODE_DOWN = 40

//     let leftPressed = false
//     let rightPressed = false
//     let upPressed = false
//     let downPressed = false
//     const getStatus = () => {
//         return ({
//             leftPressed,
//             rightPressed,
//             upPressed,
//             downPressed,
//         })
//     }
//     const updateStatusByKeyCode = (keyCode, keyStatus) => {
//         switch(keyCode){
//             case KEYCODE_LEFT:
//             case KEYCODE_RIGHT:
//             case KEYCODE_DOWN:
//             case KEYCODE_UP:
//         }
//     }
//     return ({
//         getStatus,
//         updateStatusByKeyCode
//     })
// })()

document.addEventListener("keydown", (e) => {
    // keyManager.updateStatusByKeyCode(e.keyCode, true)
})

document.addEventListener("keyup", (e) => {
    // keyManager.updateStatusByKeyCode(e.keyCode, false)
})

setInterval(() => {
    update()
    draw()
}, 1000 / 60)

function update(){
    //detect mobile 가로 세로
    if(window.innerWidth < window.innerHeight){
        gameStateManager.updateProcessState("MENU")
    }
    //update player moving
    const { sinE, cosE } = touchPadManager.getStatus()
    if(sinE !== 0 || cosE !== 0){
        socket.emit("player-move", { sinE, cosE })
    }
    //update shot
    const { users } = gameStateManager.getState()
    const mySocketId = userManager.getState().socketId
    const me = users[mySocketId]
    const { btnPressed } = touchPadManager.getStatus()
    if(btnPressed){
        socket.emit("player-shot", {
            sinE : me.sinE, 
            cosE : me.cosE,
            x : me.x,
            y : me.y,
        })
        touchPadManager.deactivePressed()
    }
}

function draw(){
    //clear
    gameCtx.clearRect(0, 0, gameCtx.width, gameCtx.height)
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height)
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)

    const gameProcessState = gameStateManager.getProcessState()
    if(gameProcessState === "LOADING"){
        return
    }
    if(gameProcessState === "MENU"){
        bufferCtx.fillRect(300, 300, 300, 300)
        mainCtx.drawImage(bufferCanvas, 0, 0, bufferCanvas.width, bufferCanvas.height)
        return
    }

    const { users, maps } = gameStateManager.getState()
    const { tileW, tileH } = gameStateManager.getConfig()
    //draw map
    for(let row = 0; row < maps.length; row++){
        for(let col = 0; col < maps[0].length; col++){
            if(maps[row][col] === 0){
                gameCtx.fillStyle = "grey"
                gameCtx.fillRect(col * tileW, row * tileH, tileW, tileH)
            }
            if(maps[row][col] !== 0){
                gameCtx.fillStyle = "black"
                gameCtx.fillRect(col * tileW, row * tileH, tileW, tileH)
            }
        }
    }
    //draw user
    const imgs = imageManager.getImgs()
    const mySocketId = userManager.getState().socketId
    for(let socketId in users){
        if(mySocketId === socketId){
            //me
        } else {
            // //others
        }
        //common
        const { x, y, cosE, sinE } = users[socketId]
        gameCtx.fillStyle = "red" 
        // gameCtx.drawImage(imgs.tank, x, y, 200, 200)
        gameCtx.save(); 
        // move to the middle of where we want to draw our image
        gameCtx.translate(x, y);
        // rotate around that point, converting our 
        // angle from degrees to radians 
        gameCtx.rotate(Math.atan2(sinE, cosE));      
        // draw it up and to the left by half the width
        // and height of the image 
        gameCtx.drawImage(imgs.tank, -(tileW/2), -(tileH/2), tileW, tileH)        
        // and restore the co-ords to how they were when we began
        gameCtx.restore(); 
    }

    //gameCanvas to bufferCanvas by CAM
    const me = users[mySocketId]
    const cam = {
        w : 1000,
        h : 500,
    }
    let srcX = me.x - cam.w
    let srcY = me.y - cam.h
    if(srcX <= 0){
        srcX = 0
    }
    if(srcX >= gameCanvas.width - cam.w * 2){
        srcX = gameCanvas.width - cam.w * 2
    }
    if(srcY <= 0){
        srcY = 0
    }
    if(srcY >= gameCanvas.height - cam.h * 2){
        srcY = gameCanvas.height - cam.h * 2
    }
    bufferCtx.drawImage(gameCanvas, srcX, srcY, cam.w * 2, cam.h * 2, 0, 0, gameCanvas.width, gameCanvas.height)

    //draw minimap maps
    for(let row = 0; row < maps.length; row++){
        for(let col = 0; col < maps[0].length; col++){
            if(maps[row][col] === 0){
                minimapCtx.fillStyle = "yellow"
                minimapCtx.fillRect(col * tileW, row * tileH, tileW, tileH)
            }
            if(maps[row][col] !== 0){
                minimapCtx.fillStyle = "black"
                minimapCtx.fillRect(col * tileW, row * tileH, tileW, tileH)
            }
        }
    }
    //draw minimap users
    for(let socketId in users){
        if(mySocketId === socketId){
            //me
            minimapCtx.fillStyle = "green"
        } else {
            // //others
            minimapCtx.fillStyle = "red"
        }
        const { x, y } = users[socketId]
        minimapCtx.beginPath()
        minimapCtx.arc(x, y, tileW / 2, 0, 2 * Math.PI)
        minimapCtx.fill()
        minimapCtx.closePath()
    }
    // minimapCtx.arc(100, 100, /50, 0, 2 * Math.PI)

    //minimap to buffer
    bufferCtx.drawImage(minimapCanvas, 0, 0, 300, 300)

    //draw touchpad
    const { 
        bgBallR, 
        bgBallX, 
        bgBallY, 
        ballR, 
        ballX, 
        ballY,
        btnX,
        btnY,
        btnWidth,
        btnHeight,
    } = touchPadManager.getStatus()
    bufferCtx.beginPath()
    bufferCtx.arc(bgBallX, bgBallY, bgBallR, 0, 2 * Math.PI)
    bufferCtx.stroke()
    bufferCtx.closePath()
    bufferCtx.beginPath()
    bufferCtx.arc(ballX, ballY, ballR, 0, 2 * Math.PI)
    bufferCtx.stroke()
    bufferCtx.closePath()

    //draw touchpad btn
    bufferCtx.fillRect(btnX, btnY, btnWidth, btnHeight)

    //buffer to main
    mainCtx.drawImage(bufferCanvas, 0, 0, bufferCanvas.width, bufferCanvas.height)
}