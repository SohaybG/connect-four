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
        if (!getRoomByID(room)) {
            io.to(socket.id).emit('room_not_found');
            return;
        }
        if (getRoomByID(room).size < 2) {
            socket.join(room);
            io.to(room).emit('joined_room', socket.id, getRoomByID(room).size - 1);

            if (getRoomByID(room).size == 2) {
                io.to(room).emit('start_game');
            }
        } else {
            io.to(socket.id).emit('full_room');
        }
    });

    socket.on('added_piece', column => {
        socket.broadcast.emit('added_piece', column);
    });

    socket.on('leave_room', () => {
        socket.to(getGameRoomIDFromSocket(socket)).emit('player_disconnect');
        leaveGameRoom(socket);
    });

    socket.on('disconnecting', () => {
        socket.to(getGameRoomIDFromSocket(socket)).emit('player_disconnect');
    });
});

function createRoom() {
    let id = createRandomID();

    while(getRoomByID(id)) {
        id = createRandomID();
    }

    return id;
}

function getRoomByID(id) {
    return io.sockets.adapter.rooms.get(id);
}

function createRandomID() {
    return crypto.randomBytes(4).toString('hex');
}

function leaveGameRoom(socket) {
    let room = getGameRoomIDFromSocket(socket);
    if (room) socket.leave(room);
};

function getRoomFromSocket(socket) {
    return getRoomByID(getGameRoomIDFromSocket(socket));
}

function getGameRoomIDFromSocket(socket) {
    let gameRoom = false;
    for (let room of socket.rooms) {
        if (room != socket.id) {
            gameRoom = room;
        }
    }
    return gameRoom;
}