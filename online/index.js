const crypto = require("crypto");
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173']
    }
});

const rooms = {};

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('create_room', () => {
        let newRoom = createRoom();
        socket.join(newRoom);
        io.to(newRoom).emit('created_room', newRoom);
    });

    socket.on('join_room', room => {
        if (!io.sockets.adapter.rooms.get(room)) {
            io.to(socket.id).emit('room_not_found');
            return;
        }
        if (io.sockets.adapter.rooms.get(room).size < 2) {
            socket.join(room);
            io.to(room).emit('joined_room', socket.id);
            io.to(room).emit('start_game');
        } else {
            io.to(socket.id).emit('full_room');
        }
    });
});

function createRoom() {
    let id = createRandomID();

    while(rooms[id]) {
        id = createRandomID();
    }

    return id;
}

function createRandomID() {
    return crypto.randomBytes(4).toString('hex');
}