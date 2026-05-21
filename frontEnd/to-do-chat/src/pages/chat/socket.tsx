import { useEffect, useState, useRef } from 'react';
import {  Socket } from 'socket.io-client';
import { getUserCookie } from '../../services/getUserCookie/getUserCookie';

interface ChatComponentProps {
  amigoSelecionadoId: number;
  socketInstancia: Socket; // Recebe o socket do pai
}
export function ChatComponent({ amigoSelecionadoId, socketInstancia}: ChatComponentProps) {


  
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const socket:Socket = socketInstancia;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [cookies, setCookies]= useState<any>(null)
  
  // Guardamos a sala atual em uma Ref para que o socket.on sempre tenha acesso ao valor mais recente
  const currentRoomRef = useRef(currentRoom);

  useEffect(()=>{
    const cookie = async()=>{
      const cookies = await getUserCookie();
      setCookies(cookies);
      console.log(cookies)
    }
    cookie();
  },[])
  // Toda vez que o estado currentRoom mudar, atualizamos a Ref
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);



  // 2. useEffect para gerenciar os ouvintes de eventos (Listeners)
  // Toda vez que a sala mudar, nós limpamos os eventos antigos e criamos novos com o escopo atualizado
  useEffect(() => {
    if (!socket) return;

    // Escuta quando o backend confirma que a sala privada foi criada/entrou
    socket.on('private-chat-ready', (data: { roomId: string }) => {

      setCurrentRoom(data.roomId);
      setMessages([]); // Aqui você poderia buscar o histórico de mensagens do banco de dados (Prisma) via fetch/axios
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
  console.log('cookies',cookies);
  //sempre que amigoselecionado mudar, realize o evento join-private-chat que realizara a funçao no servidor
  useEffect(() => {
    if (amigoSelecionadoId && socket) {
      socket.emit('join-private-chat', { targetUserId: amigoSelecionadoId, companyId:cookies.companyId, tipo:'DIRECT'});
    }
  }, [amigoSelecionadoId,socket, cookies]);

  //funçao que ativa o evento send_private_message com o messageData como dado
  const handleSendMessage = () => {
    if (!text.trim() || !currentRoom) return;

    const messageData = {
      roomId: currentRoom,
      text: text
    };

    socket.emit('send-private-message', messageData);
    // Adiciona o seu próprio texto na tela com o senderId marcado como você (ex: 'me')
    setMessages((prev) => [...prev, { ...messageData, senderId: 'me', createdAt: new Date() }]);
    setText('');
  };

  return (
    <div className='d-flex flex-column w-100 h-100 border rounded p-3'>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}  style={{ textAlign: msg.senderId === 'me' ? 'right' : 'left', margin: '5px 0' }}>
            <span style={{ background: msg.senderId === 'me' ? '#dcf8c6' : '#eee', padding: '5px 10px', borderRadius: '10px', display: 'inline-block' }}>
              {msg.text}
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