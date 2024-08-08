const sockets = async (io, socket) => {

    socket.on("message", (data) => {
        console.log('User', data.user, 'sent', data.content)
        io.emit("message", { user: data.user, content: data.content })
    });

    // --- ROOMS --- //
    socket.on('join room', (room) => {
        socket.join(room)
        console.log(room, 'joined')
    });

    socket.on('leave room', (room) => {
        socket.leave(room)
        console.log(room, 'leaved')
    })

    socket.on('room message', (data) => {

        console.log('User', data.user, 'sent', data.content, 'in room:', data.room)

        io.to(data.room).emit('message', { user: data.user, content: data.content })
    })
};

module.exports = sockets;