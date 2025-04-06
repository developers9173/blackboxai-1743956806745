const socketIo = require('socket.io');
const Message = require('../models/Message');

let io;

const initSocket = (server) => {
    io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('New user connected');

        // Handle message sending
        socket.on('message:send', async (messageContent) => {
            const message = new Message({
                sender: socket.user._id,
                content: messageContent
            });
            await message.save();
            io.emit('message:receive', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIo };