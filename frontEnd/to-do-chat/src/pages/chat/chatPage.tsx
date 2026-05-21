import { useEffect, useState } from 'react';
import { ChatComponent } from './socket'; // Seu componente de socket
import { CompanyUsers } from '../../services/comanyUsers/companyUsers';
import { getUserCookie } from '../../services/getUserCookie/getUserCookie';
import { io, Socket } from 'socket.io-client';
import { NavBar } from '../navbar/navbar';

let socket: Socket;
export function ChatPage() {
  // Estado que guarda qual amigo foi clicado na barra lateral
  const [amigoAtivoId, setAmigoAtivoId] = useState<number | null>(null);
    const  [companyUsers, setCompanyUsers] = useState<any[]>([]);
    const [id,setId]=useState<number |null>(null);
    const [companyId, setCompanyId] = useState<null|number>(null);
    const [nome,setNome] = useState<string|null>(null)
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
        setCompanyId(cookies.companyId)
    }
    func();
    cookie();
  },[])
  console.log('companyUsers: ',companyUsers)
  const listaAmigos = companyUsers.filter((u)=> u.id != id)
  console.log('lista',listaAmigos);

  console.log('ativos', amigoAtivoId);
  return (

      
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden'}}>
    <NavBar />
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      
      <div style={{ width: '250px', background: '#2f3136', color: 'white', overflowY: 'auto' }}>
        <h3 className='text-center w-100 my-3'>Colaboradores</h3>
        <div className='px-5 py-1 w-100 bg-dark'></div>
        <ul className="mt-4 mx-2">
          {listaAmigos.map(amigo => (
            <li 
              key={amigo.id} 
              onClick={() => {setAmigoAtivoId(amigo.id); setNome(amigo.nome)}}
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

      {}
      {/* Mudamos o padding para 0 para controlar o espaçamento interno direto no ChatComponent */}
      <div style={{ flex: 1, background: '#36393f', display: 'flex' }}>
        {amigoAtivoId ? (
          <div className='d-flex flex-column w-100 align-items-center'>
            <div className='w-100 bg-transparent d-flex justify-content-center fs-5 text-white mt-2'>{nome}</div>
            <ChatComponent 
              amigoSelecionadoId={amigoAtivoId} 
              socketInstancia={socket} 
              companyId={companyId} 
              userId={id}
            />
          </div> 
          
        ) : (
          <div style={{ color: 'gray', padding: '20px' }}>Selecione um amigo para iniciar a conversa</div>
        )}
      </div>

    </div>
  </div>
  );
}