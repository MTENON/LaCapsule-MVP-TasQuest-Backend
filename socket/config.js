const socketIo = require("socket.io");
const sockets = require("./sockets");

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*'
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);
        const userNumber = io.engine.clientsCount;
        console.log(userNumber)

        socket.on("disconnect", () => {
            console.log('Client disconnected', socket.id);
        });


        sockets(io, socket)

    });

    return io;
}