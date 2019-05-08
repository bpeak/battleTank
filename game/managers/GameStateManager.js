const GameStateManager = () => {
    let isStarted = false
    let state = {}
    let tileW = undefined
    let tileH = undefined
    let processState = "LOADING"
    const getIsStarted = () => isStarted
    const getProcessState = () => processState
    const updateProcessState = (newProcessState) => {
        processState = newProcessState
    }
    const getState = () => state
    const getConfig = () => ({
        tileW,
        tileH,
    })
    const initMaps = (maps, canvasWidth, canvasHeight) => {
        const rowsCount = maps.length
        const colsCount = maps[0].length
        tileW = canvasWidth / colsCount
        tileH = canvasHeight / rowsCount
    }
    const updateState = (newState) => {
        state = Object.assign(state, newState)
    }
    const startGame = () => {
        isStarted = true
    }
    return ({
        getProcessState,
        updateProcessState,

        getIsStarted,
        getState,
        getConfig,
        updateState,
        initMaps,
        startGame,
    })
}

export default GameStateManager

