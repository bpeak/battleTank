const express = require("express")
const app = express()
const http = require("http").Server(app)
const path = require("path")
const fs = require("fs")
const io = require('socket.io')(http)
const device = require("express-device")
app.use(device.capture())

let isSetIntervaling = false

const maps = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const users = {
    'sadfasdf' : new User(100, 200),
    'sdfdsf' : new User(100, 200),
    'sdfdsfadsfds' : new User(100, 200),
}

io.on('connection', function(socket){
    //id : socket.id
    if(isSetIntervaling === false){
        isSetIntervaling = true
        setInterval(() => {
            // console.log("보낸다")
            socket.emit("newState", {
                maps,
            })
        }, 1000 / 60)
    }

    socket.on("newPlayer", (data) => {
        console.log("새 플레이어 등장")
    })

    socket.on('new-player', state => {
        // console.log('New player joined with state:', state)
        // players[socket.id] = state
        // // Emit the update-players method in the client side
        // io.emit('update-players', players)
    })

    socket.on("log", (data) => {
        console.log(data)
    })

    socket.on("ready", (data) => {
        console.log(data)
    })

})

app.set('view engine', 'pug')
app.set('views', './views')

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/game", (req, res) => {

})

app.use("/public", express.static(path.join(__dirname, "public")))

app.get("*", (req, res) => {
    // console.log(req.device.type.toUpperCase())
    const html = fs.readFileSync(path.join(__dirname, "public/index.html"))
    res.set("Content-Type", "text/html")
    res.send(html)
})

http.listen(80, () => {
    console.log(123)
})

function User({
    x,
    y,
}){
    this.x = x
    this.y = y
}