import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ClientService } from '../user/user.services'

let mesages = new Map()
let users = new Map()
let heartbeat = new Map()

//check if user has sent heartbeat in past 7 seconds 
const runtime = () => {
    heartbeat.forEach(function (value, key) {
        const currentTime = Date.now()
        const diff = (currentTime - value) / 1000
        if (diff > 7) {
            users.delete(key)
            heartbeat.delete(key)
        }
    }),
    console.log('this is heartbeat users after checking', heartbeat)
    console.log('this is users ', users)
}

//set heartbeat check every 10 seconds
setInterval(runtime, 10000)


@WebSocketGateway({
    // cors: {
    //     origin: "http://localhost:3001",
    //     credentials: true,
    // },
    cors: true
})

export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private clientservice: ClientService) { }

    @WebSocketServer() server: Server;

    //event for updating status of the user
    @SubscribeMessage('changeStatus')
    async handleSendMessage(client: Socket, payload): Promise<void> {
        console.log('this is payload ', payload)
        mesages.set(payload, client.id) //to get the client id of a specific user
        // OnlineUsers.set(payload, payload) //to change
        users.set(client.id, payload) //to get the id of a specific client and make updates
        console.log('this is messages connect', mesages)
        console.log('this is users connect', users)
        //  const user = await this.clientservice.onlineclient(payload)
        mesages.set(payload, client.id) //to get the client id of a specific user
        // OnlineUsers.set(payload, payload) //to change
        users.set(client.id, payload) //to get the id of a specific client and make updates
        heartbeat.set(client.id, Date.now()) //to get the id of a specific client and make updates
        console.log('this is messages connect', mesages)
        console.log('this is users connect', users)
        console.log('this is heartbeat users', heartbeat)
    }

    //event for sending message by user 1 to user 2
    @SubscribeMessage('sendMessages')
    async handleSendmessage(client: Socket, payload): Promise<void> {
        const { id, text } = payload
        const userID = mesages.get(id)
        console.log('Recipient id: ', userID)
        this.server.to(userID).emit('msg-recieved', text);
    }

    //event for handling heartbeat messages
    @SubscribeMessage('heartbeat')
    async handleHeartbeat(client: Socket, payload): Promise<void> {
        heartbeat.set(client.id, Date.now())
        console.log('this is recieved heartbeat', heartbeat)
    }


    // we will change the status of the user in the frontend here
    // 1. checking if the friend id is in the user object
    // 2. if its inside, we send an online message to signify the frontend that the user is still active as such change user status to active 
    // 3.  if its not , fetch the friend lastseen from te database and send to the frontend which will then change the status to last seen 
    // 4.  the first check will be a useffect, and consequent check will be throgh setinterval
    // world
    @SubscribeMessage('checkStatus')
    async ChangeUserStaus(client: Socket, payload): Promise<void> {
        let friendId; // vairiable to store the friend id gotten from the users map object during foreach to loop the objects
        const { senderid, receviverid } = payload  // payload from the socket.io messages
        const NewclientId = mesages.get(senderid) // retrieving the socket id of the current user
        users.forEach((userid, clientId) => {
            if (userid === receviverid) friendId = userid
        })  // here we check for the friends id and then store it in friendId

        //here we check if the id exist or not, if it does send online message to the current user , else retrieve the user last seen 
        // and send to the current user
        if (!friendId) {
            console.log('userID IS NULL', friendId)
            // const Status = await this.clientservice.getclient(receviverid)
            // console.log('this is last seen', Status)

            this.server.to(NewclientId).emit('offlineStatus', 'offline')
        } else {
            console.log('this is the user id', friendId)
            this.server.to(NewclientId).emit('onlineStatus', 'online')
        }
    }

    afterInit(server: Server) {
        // console.log(server);
        //Do stuffs
    }

    //triggered whenever any user disconnects 
    async handleDisconnect(client: Socket): Promise<void> {
        console.log(`Disconnected: ${client.id}`);
        const userid = users.get(client.id)
        const id = users.delete(client.id)
        heartbeat.delete(client.id)
        console.log("this is users", users)
        //const people = await this.clientservice.offlineclient(userid)
    }

    //triggered whenever any user connects 
    async handleConnection(client: Socket, payload) {
        console.log(`Connected ${client.id} ,`);
        //Do stuffs
    }
}