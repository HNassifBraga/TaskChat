import { useEffect, useState, useRef } from 'react';
import {  Socket } from 'socket.io-client';

interface ChatComponentProps {
  amigoSelecionadoId: number;
  socketInstancia: Socket; // Recebe o socket do pai
  companyId:number|null,
  userId:number|null
}
export function ChatComponent({ amigoSelecionadoId, socketInstancia, companyId, userId}: ChatComponentProps) {


  
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const socket:Socket = socketInstancia;
  const companyid = companyId;
  const userid = userId;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  
  // Guardamos a sala atual em uma Ref para que o socket.on sempre tenha acesso ao valor mais recente
  const currentRoomRef = useRef(currentRoom);  

  // Toda vez que o estado currentRoom mudar, atualizamos a Ref
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);



  useEffect(() => {
    if (!socket) return;

    // Escuta quando o backend confirma que a sala privada foi criada/entrou
    socket.on('private-chat-ready', (data: { roomId: string, chatMessages:{ content:string,  userId:number }[] }) => {

      setCurrentRoom(data.roomId);
      console.log('messages',data.chatMessages)
      setMessages(data.chatMessages); 
    });//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Escuta a chegada de novas mensagens do amigo
    socket.on('receive-private-message', (newMessage) => {
      // Usando a Ref, garantimos que estamos comparando com a sala que o usuário está vendo AGORA
      if (newMessage.roomId === currentRoomRef.current) {
        setMessages((prev) => [...prev, newMessage]);
        console.log(newMessage)
      }
    });

    // Função de limpeza: remove os ouvintes antigos para não duplicar na próxima renderização
    return () => {
      socket.off('private-chat-ready');
      socket.off('receive-private-message');
    };
  }, [currentRoom, socket]); // Executa novamente se mudarmos de sala

  // 3. Notificar o backend sobre a troca de amigo selecionado
  //sempre que amigoselecionado mudar, realize o evento join-private-chat que realizara a funçao no servidor
  useEffect(() => {
    if (amigoSelecionadoId && socket) {
      socket.emit('join-private-chat', { targetUserId: amigoSelecionadoId, companyId:companyid, tipo:'DIRECT'});
    }
  }, [amigoSelecionadoId,socket,companyid]);

  //funçao que ativa o evento send_private_message com o messageData como dado
  const handleSendMessage = () => {
    if (!text.trim() || !currentRoom) return;

    const messageData = {
      chatNome: currentRoom,
      content: text,
      userId:userid
    };
    socket.emit('send-private-message', messageData);
    // Adiciona o seu próprio texto na tela com o senderId marcado como você (ex: 'me')
    setMessages((prev) => [...prev, { ...messageData, userId: userId, createdAt: new Date() }]);
    setText('');
  };

  return (
    <div className='d-flex flex-column w-100 h-100  rounded-bottom p-4 '>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}  style={{ textAlign: msg.userId === userId ? 'right' : 'left', margin: '5px 0' }}>
            <span style={{ background: msg.userId === userId ? '#dcf8c6' : '#eee', padding: '5px 10px', borderRadius: '10px', display: 'inline-block' }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Digite sua mensagem..."
          style={{ flex: 1, marginRight: '5px' }}
        />
        <button className='btn btn-primary' onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
}