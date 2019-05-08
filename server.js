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
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const canvasWidth = 3000
const canvasHeight = 1500
const tileW = 3000 / maps[0].length
const tileH = 1500 / maps.length

const users = {
    'aaa' : new User({
        socketId : "aaa",
        x : 100,
        y : 200,
    }),
    'bbb' : new User({
        socketId : "bbb",
        x : 300,
        y : 500,
    }),
    'ccc' : new User({
        socketId : "ccc",
        x : 1000,
        y : 2000,
    }),
}

const shots = []

io.on('connection', function(socket){
    if(isSetIntervaling === false){
        setInterval(() => {
            io.emit("state-new", {
                users,
                maps,
                shots,
            })
        }, 1000 / 60)
    }

    users[socket.id] = new User({
        x : 500,
        y : 500,
        socketId : socket.id
    })

    socket.emit("state-init", {
        state : {
            maps,
            users,
        },
        socketId : socket.id,
    })
    
    socket.on("log", (data) => {
        console.log(data)
    })



    socket.on("player-new", () => {
        users[socket.id] = new User({
            x : 200,
            y : 200,
            socketId : socket.id,
        })
    })

    socket.on("player-move", (data) => {
        const mySocketId = socket.id
        for(let socketId in users){
            if(socketId === mySocketId){
                const { sinE, cosE } = data
                users[socketId].updatePosition({ sinE, cosE })
                break
            }
        }
    })

    socket.on("player-shot", (data) => {
        const { x, y, sinE, cosE } = data
        const mySocketId = socket.id
        const shot = new Shot({
            socketId : mySocketId,
            x,
            y,
            sinE,
            cosE,
        })
        shots.push(shot)
    })

    socket.on("log", (data) => {
        console.log(data)
    })

})

// app.set('view engine', 'pug')
// app.set('views', './views')

// app.get("/", (req, res) => {
//     res.render("index")
// })

// app.get("/game", (req, res) => {

// })

app.use("/dist", express.static(path.join(__dirname, "dist")))
app.use("/public", express.static(path.join(__dirname, "public")))

app.get("*", (req, res) => {
    // console.log(req.device.type.toUpperCase())
    // res.send("123")
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
    socketId,
}){
    this.x = x
    this.y = y
    this.socketId = socketId
    this.sinE = 0
    this.cosE = 0
}

const speed = 10

User.prototype.updatePosition = function({
    sinE,
    cosE,
}){
    this.sinE = sinE
    this.cosE = cosE
    const nextX = this.x + cosE * speed
    const nextY = this.y + sinE * speed
    if(nextX < 0 + tileW / 2 || nextX > canvasWidth - tileW / 2){
        
    } else {
        this.x = nextX
    }
    if(nextY < 0 + tileH / 2 || nextY > canvasHeight - tileH / 2){

    } else {
        this.y = nextY
    }
}

function Shot({
    socketId,
    x,
    y,
    sinE,
    cosE,
}){
    this.socketId = socketId
    this.x = x
    this.y = y
    this.sinE = sinE
    this.cosE = cosE
}