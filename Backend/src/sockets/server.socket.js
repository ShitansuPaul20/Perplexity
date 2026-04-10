const {Server} = require("socket.io")

let io;

function initSocket(httpServer){
    io = new Server(httpServer,{
        cors:{
            origin: "http://localhost:5173",
            credentials: true,
        }
    })

    console.log("Socket.io Server is running")

    io.on("connection", (socket)=>{
        console.log("A user connected:" + socket.id)
    })
} 

function getIO(){
    if(!io){
        throw new Error("Socket.io not initialized")
    }

    return io
}

module.exports = {
    initSocket,
    getIO
}