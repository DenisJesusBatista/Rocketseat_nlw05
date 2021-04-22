import { io } from "../http";
import { ConnectionsServices } from "../services/ConnectionsServices";
import { UsersServices } from "../services/UsersServices";
import { MessagesServices } from "../services/MessagesServices";


interface IParams {
    text: string;
    email: string;
}


io.on("connect", (socket) => {
    const connectionsService = new ConnectionsServices();
    const usersService = new UsersServices();
    const messagesService = new MessagesServices();

    socket.on("client_first_access", async (params) => {
        const socket_id = socket.id;
        const { text, email } = params;
        let user_id = null;


        const userExists = await usersService.findByEmail(email);

        if (!userExists) {
            const user = await usersService.create(email);

            await connectionsService.create({
                socket_id,
                user_id: user.id
            });

            user_id = user.id;

        } else {
            user_id = userExists.id;
            const connection = await connectionsService.findByUserId(userExists.id);

            if (!connection) {
                await connectionsService.create({
                    socket_id,
                    user_id: userExists.id,
                });
            } else {
                connection.socket_id = socket_id;

                await connectionsService.create(connection);
            }



            await connectionsService.create({
                socket_id,
                user_id: userExists.id
            })
        }

        await messagesService.create({
            text,
            user_id
        });

    });
});