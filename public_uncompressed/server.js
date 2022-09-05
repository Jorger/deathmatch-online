const users = [];
const rooms = [];

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {
  io: (socket) => {
    /**
     * Evento para un nuevo usuario
     */
    socket.on(
      "nU",
      (
        { type = "online", friendRoom = "", createRoom = false, player = {} },
        callback
      ) => {
        // Se agrega el id del socket al jugador...
        player.id = socket.id;
        // Primero validar el tipo de conexión...
        // Traer los usuarios que estén disponibles
        // Se filtrará que no permita al mismo usuario
        const filterUsers = users.filter(
          (v) => v.type === type && v.player.token !== player.token
        );

        if (
          (filterUsers.length !== 0 && !createRoom) ||
          (type === "friend" && !createRoom)
        ) {
          // Si es de tipo jugar con amigos, se debe buscar que exista la sala...
          let indexPartner = -1;

          if (type === "online") {
            // Hay usuarios dipsonibles para jugar....
            indexPartner = rnd(0, filterUsers.length - 1);
          }

          if (type === "friend") {
            indexPartner = filterUsers.findIndex((v) => v.room === friendRoom);

            // Si existe la sala
            if (indexPartner < 0) {
              return callback("Invalid room");
            }
          }

          if (indexPartner < 0) {
            return callback("Invalid type");
          }

          const userData = {
            player,
            partner: filterUsers[indexPartner].player,
          };

          // Genera la data de los usuarios...
          const newRoom = filterUsers[indexPartner].room;
          const gameData = {
            BOARD: newBoard(),
            users: setOrder(
              ["player", "partner"].map((v) => [
                userData[v].name,
                userData[v].token,
                0,
                userData[v].id,
              ])
            ),
            room: newRoom,
            typeGame: 3,
          };
          socket.join(newRoom);
          rooms.push({
            room: newRoom,
            users: [userData.player.id, userData.partner.id],
          });
          const indexRoom = users.findIndex((v) => v.room === newRoom);
          users.splice(indexRoom, 1);
          io.sockets.in(newRoom).emit("sG", gameData);
        } else {
          // Se guardará el usuario en el lstado de usuarios disponibles...
          const room = String(type === "online" ? guid() : friendRoom);

          users.push({
            room,
            type,
            player,
          });
          socket.join(room);
        }

        callback();
      }
    );

    /**
     * Evento que recibe las diferentes acciones del juego...
     */
    socket.on("action", (data) => {
      if (data.type !== "end") {
        io.sockets.in(data.room).emit("action", data);
      } else {
        const indexRoom = rooms.findIndex(({ room }) => data.room === room);
        if (indexRoom >= 0) {
          rooms.splice(indexRoom, 1);
        }
      }
    });

    /**
     * Evento para indicar que un jugador se ha desconectado
     */
    socket.on("disconnect", () => {
      // Buscar la sala a la cual pertenece este socket
      const indexRoom = rooms.findIndex(({ users }) =>
        [users[0], users[1]].includes(socket.id)
      );

      if (indexRoom >= 0) {
        // Se emite al jugador que quedó que se ha desconectado el otro jugador
        io.sockets.in(rooms[indexRoom].room).emit("action", { type: "leave" });
        // Se elimina la sala
        rooms.splice(indexRoom, 1);
      } else {
        // Buscar en el listado de usuarios pendientes a jugar
        const indexPlayer = users.findIndex(
          ({ player }) => player.id === socket.id
        );

        // Se saca al usuario del listado de jugadores disponibles
        if (indexPlayer >= 0) {
          users.splice(indexPlayer, 1);
        }
      }
    });
  },
};
