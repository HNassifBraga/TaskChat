import { UserService } from "../services";
import { Server as HttpServer} from "http";
import {Server, Socket} from 'socket.io';
import cookie from 'cookie';
import { chatService } from "../services";
interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export function setupSocket(httpServer:HttpServer)
{

    const chatservice = new chatService();
    const userService = new UserService();
    const io = new Server(httpServer, {
        cors:{
            origin:"http://localhost:5173",
            credentials:true
        }
    });

   const onlineUsers = new Map<number, string>();
    
   //pegar o userId a partir dos cookies
    io.use((socket:AuthenticatedSocket, next)=>{
        const cookieHeader = socket.handshake.headers.cookie;

        if(!cookieHeader){
            return next(new Error('error auth'));
        }

        const cookies = cookie.parse(cookieHeader);
        const token = cookies.token;
        if(!token){
            return next(new Error('no. token'));
        }
        const decode = userService.decodeToken(token);
        socket.userId = decode.id;
        next();

    });
    // io.on para ouvir eventos globais do servidor, sendo mais comum a conexão de novos usuários
    io.on('connection', (socket:AuthenticatedSocket)=>{
        const myUserId = Number(socket.userId!);//id de quem esta enviando
        onlineUsers.set(myUserId, socket.id);//coloca no objeto onlineUsers o {idDoUser:id da sala}
        console.log('user ', myUserId, 'entrou');//log

        //ouvir um evento especifico, entrar no chat, enviado pelo cliente
        socket.on('join-private-chat', (data:{targetUserId:number, companyId:number, tipo:'DIRECT'|'GROUP'})=>{
            const {targetUserId, companyId } = data;
            
            const sortedIds = [myUserId, targetUserId].sort((a, b) => a - b);//[menorId,maiorId]
            const privateRoomId = `dm_${sortedIds[0]}_${sortedIds[1]}`;//da um nome ao chatRoom
            const createChat =async (privateRoomId:string, companyId:number) =>{
                const chat = await chatservice.createChat(privateRoomId, companyId, 'DIRECT');
                return chat
            }
            createChat(privateRoomId, companyId);
            //
            socket.join(privateRoomId);//UserId join the chatRoom 
            socket.emit('private-chat-ready',{roomId:privateRoomId});//envia para o usuario que disparou o evento, userId, {roomId:privateRoomId}
        });

        //ouvir se usuário enviou uma mensagem
        socket.on('send-private-message',(data:{roomId:string, text:string})=>{
            const {roomId, text} = data;
            console.log(data)
            if(!roomId.includes(`_${myUserId}`)){
                return socket.emit('sem permissao para esse chat');
            }

            //envia para todo mundo que esta na sala menos quem esta enviando a mensagem
            socket.to(roomId).emit('receive-private-message',{
                roomId,
                text,
                senderId:myUserId,
                createdAt:new Date()
            });
            console.log('mensge de ',myUserId, 'enviada na sala', roomId);
        })
        //ouvi eventos de desconexão e deleta o usuário de userOnline
        socket.on('disconnect', ()=>{
            onlineUsers.delete(myUserId);
            console.log(`usuario ${myUserId} desconectou`)
        })
    })


  return io;
}