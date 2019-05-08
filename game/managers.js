const gameStateManager = (() => {
    let state = {}
    const getState = () => state
    const updateState = (newState) => {
        state = Object.assign(state, newState)
    }
    return ({
        getState,
        updateState,
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

export default {
    gameStateManager,
    touchPadManager,
}