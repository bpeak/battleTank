const socket = io()
// socket.emit("ready", { test : 123 })
socket.on("newState", (data) => {
    console.log(data)
})

const mainCanvas = document.getElementById("mainCanvas")
const mainCtx = mainCanvas.getContext("2d")
mainCanvas.width = 3000
mainCanvas.height = 1500
const bufferCanvas = document.createElement("canvas")
const bufferCtx = bufferCanvas.getContext("2d")
bufferCanvas.width = 3000
bufferCanvas.height = 1500

const log = (data) => {
    socket.emit("log", data)
}

const userManager = (() => {
    let x = 0
    let y = 0
    const updateStatus = (n) => {
        x = n.x
        y = n.y
    }
    const getStatus = () => {
        return ({
            x,
            y,
        })
    }
    return ({
        updateStatus,
        getStatus,
    })
})()

const touchPadManager = (() => {
    //touchpad
    let touchPadNum = 0
    const bgBallR = mainCanvas.width / 10
    const bgBallX = 0 + bgBallR
    const bgBallY = mainCanvas.height - 2 * bgBallR
    let ballX = bgBallX
    let ballY = bgBallY
    let sinE = 0
    let cosE = 0
    const ballR = bgBallR / 3
    const ballDrX = 0.5
    const ballDrY = Math.sqrt(Math.abs(1 - Math.pow(ballDrX, 2)))
    //touchpad btn
    let btnNum = 1
    let btnPressed = false
    const btnWidth = mainCanvas.width / 10
    const btnHeight = btnWidth
    const btnX = mainCanvas.width - btnWidth - btnWidth / 10
    const btnY = mainCanvas.height - btnHeight - btnHeight / 10
    const btnStartX = btnX
    const btnEndX = btnX + btnWidth
    const btnStartY = btnY
    const btnEndY = btnY + btnHeight
    const updateBallPosition = (n) => {
        ballX = bgBallX + n.distanceX
        ballY = bgBallY + n.distanceY
        sinE = n.sinE
        cosE = n.cosE
    }
    const getStatus = () => {
        return ({
            bgBallR,
            bgBallX,
            bgBallY,
            ballX,
            ballY,
            ballR,
            ballDrX,
            ballDrY,
            sinE,
            cosE,
            btnWidth,
            btnHeight,
            btnX,
            btnY,
        })
    }
    const startHandler = ({ mouseX, mouseY }) => {
        if(
            mouseX >= btnStartX && 
            mouseX <= btnEndX &&
            mouseY >= btnStartY &&
            mouseY <= btnEndY
        ){
            log("btn pressed")
            btnPressed = true
        }
    }
    const endHandler = ({ mouseX, mouseY }) => {
        if( mouseX <= mainCanvas.width / 2 ){
            //왼쪽 땜
            updateBallPosition({
                distanceX : 0,
                distanceY : 0,
                sinE : 0,
                cosE : 0,
            })
        } else {
            //오른쪽 땜
        }
    }
    const moveHandler = ({ mouseX, mouseY }) => {
        const distanceX = mouseX - bgBallX
        const distanceY = mouseY - bgBallY
        const distanceR = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))
        const sinE = distanceY / distanceR 
        const cosE = distanceX / distanceR
        if(distanceR <= bgBallR){
            updateBallPosition({
                distanceX,
                distanceY,
                sinE,
                cosE,
            })
        }
    }
    return ({
        updateBallPosition,
        getStatus,
        moveHandler,
        startHandler,
        endHandler,
    })
})()

document.getElementById("btn").addEventListener("click", () => {
    document.documentElement.webkitRequestFullScreen()
    document.getElementById("btn").remove()
    log(mainCanvas.width)
})

console.log(mainCanvas.width, mainCanvas.height)

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

mainCanvas.addEventListener("touchend", (e) => {
    log("touchend")
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
    const { sinE, cosE } = touchPadManager.getStatus()
    //update User position
    const currentUser = userManager.getStatus()
    const nextUserX = currentUser.x + cosE * 5
    const nextUserY = currentUser.y + sinE * 5
    userManager.updateStatus({ x : nextUserX, y : nextUserY })
}

function draw(){
    //clear
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height)
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)

    //touchPad
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
    
    //touchPad btn
    bufferCtx.fillRect(btnX, btnY, btnWidth, btnHeight)



    //draw user
    const userStatus = userManager.getStatus()
    bufferCtx.fillRect(userStatus.x, userStatus.y, 100, 100)

    //buffer to main  
    mainCtx.drawImage(bufferCanvas, 0, 0, mainCanvas.width, mainCanvas.height)
}


function  getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return {
        mouseX: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        mouseY: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}