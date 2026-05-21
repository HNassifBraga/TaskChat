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
    const addMessage = async(userId:number, content:string, chatNome:string)=>{
        const message = await chatservice.createMessage(userId, content, chatNome);
        return message;
    }

    const createChat =async (privateRoomId:string, companyId:number) =>{
        const chat = await chatservice.createChat(privateRoomId, companyId, 'DIRECT');
        return chat
    }

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
        const userId = Number(socket.userId!);//id de quem esta enviando
        onlineUsers.set(userId, socket.id);//coloca no objeto onlineUsers o {idDoUser:id da sala}
        console.log('user ', userId, 'entrou');//log

        //ouvir um evento especifico, entrar no chat, enviado pelo cliente
        socket.on('join-private-chat', async (data:{targetUserId:number, companyId:number, tipo:'DIRECT'|'GROUP'})=>{
            const {targetUserId, companyId } = data;
            
            const sortedIds = [userId, targetUserId].sort((a, b) => a - b);//[menorId,maiorId]
            const privateRoomId = `dm_${sortedIds[0]}_${sortedIds[1]}`;//da um nome ao chatRoom
            try{
                const chatMessages = await createChat(privateRoomId, companyId)
                console.log(chatMessages)
                socket.join(privateRoomId);//UserId join the chatRoom 
                socket.emit('private-chat-ready',{roomId:privateRoomId, chatMessages:chatMessages});//envia para o usuario que disparou o evento, userId, {roomId:privateRoomId}
            }catch(e)
            {
                console.log(e)
            }
        });

        //ouvir se usuário enviou uma mensagem
        socket.on('send-private-message',async (data:{chatNome:string, content:string})=>{
            const {chatNome, content} = data;
            console.log(chatNome)
            console.log(data)
            if(!chatNome.includes(`_${userId}`)){
                return socket.emit('sem permissao para esse chat');
            }
            const message = await addMessage(userId, content, chatNome)
            
            //envia para todo mundo que esta na sala menos quem esta enviando a mensagem
            socket.to(chatNome).emit('receive-private-message',{
                content,
                userId:userId,
                createdAt:new Date()
            });
            console.log('mensge de ',userId, 'enviada na sala', chatNome);
        })
        //ouvi eventos de desconexão e deleta o usuário de userOnline
        socket.on('disconnect', ()=>{
            onlineUsers.delete(userId);
            console.log(`usuario ${userId} desconectou`)
        })
    })


  return io;
}