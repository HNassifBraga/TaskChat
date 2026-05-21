import { useEffect, useState } from 'react';
import { ChatComponent } from './socket'; // Seu componente de socket
import { CompanyUsers } from '../../services/comanyUsers/companyUsers';
import { getUserCookie } from '../../services/getUserCookie/getUserCookie';
import { io, Socket } from 'socket.io-client';

let socket: Socket;
export function ChatPage() {
  // Estado que guarda qual amigo foi clicado na barra lateral
  const [amigoAtivoId, setAmigoAtivoId] = useState<number | null>(null);
    const  [companyUsers, setCompanyUsers] = useState<any[]>([]);
    const [id,setId]=useState<number |null>(null);
  // Lista mockada (depois você puxará isso do UserService via API HTTP)
    useEffect(() => {
    socket = io('http://localhost:3000', {
      withCredentials: true
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    const func = async()=>{
        const users = await CompanyUsers();
        if(!users)throw new Error('erro serio');
        setCompanyUsers(users.data);
    }
    const cookie = async()=>{
        const cookies = await getUserCookie();
        setId(cookies.id);
    }
    func();
    cookie();
  },[])
  console.log('companyUsers: ',companyUsers)
  const listaAmigos = companyUsers.filter((u)=> u.id != id)
  console.log('lista',listaAmigos);

  console.log('ativos', amigoAtivoId);
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* BARRA LATERAL (ESTILO DISCORD) */}
      <div style={{ width: '250px', background: '#2f3136', color: 'white', }}>
        <h3 className='text-center w-100  my-3'>Colaboradores</h3>
        <div className='px-5 py-1 w-100 bg-dark'></div>
        <ul className="mt-4 mx-2">
          {listaAmigos.map(amigo => (
            <li 
              key={amigo.id} 
              onClick={() => setAmigoAtivoId(amigo.id)}
              style={{ 
                cursor: 'pointer', 
                padding: '8px', 
                background: amigoAtivoId === amigo.id ? '#4f545c' : 'transparent',
                borderRadius: '4px'
              }}
            >
              {amigo.nome}
            </li>
          ))}
        </ul>
      </div>

      {/* ÁREA DO CHAT PRIVADO */}
      <div style={{ flex: 1, padding: '20px', background: '#36393f' }}>
        {amigoAtivoId ? (
          // Agora passamos o ID corretamente aqui!
          <ChatComponent amigoSelecionadoId={amigoAtivoId} socketInstancia={socket}/>
        ) : (
          <div style={{ color: 'gray' }}>Selecione um amigo para iniciar a conversa</div>
        )}
      </div>
    </div>
  );
}