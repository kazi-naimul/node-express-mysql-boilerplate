const rootSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection');
        socket.on('teste', (room) => {
            socket.join(room);

            console.log('join room for', room,socket.rooms);
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
            console.log(socket.rooms);
        });
    });

   

  

    return io;
};
module.exports = rootSocket;
