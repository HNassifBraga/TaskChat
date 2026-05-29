import { useEffect, useState } from 'react';
import { ChatComponent } from './socket'; // Seu componente de socket
import { CompanyUsers } from '../../services/comanyUsers/companyUsers';
import { getUserCookie } from '../../services/getUserCookie/getUserCookie';
import { io, Socket } from 'socket.io-client';
import { NavBar } from '../navbar/navbar';
import styles from './DashBoard.module.css'
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
    <div>
      <NavBar/>
      <div className={`d-flex flex-column p-5 ${styles.bg} vh-100`}>
        <h4 className='text-white mx-5 h4s-5'>Quadro de tarefas</h4>
        <div className='d-flex justify-content-evenly px-5'>

            <div className='  text-white border rounded'>
                <h3 className='fs-4 w-100 border p-2'>A fazer</h3>

            </div>
            <div className='p-5 pg-primary border'>

            </div>
            <div className='p-5 pg-primary border'>

            </div>


        </div>
        <div className='m-5'>
            <div  className={`d-flex flex-column vh-75 overflow-hidden rounded ${styles.bg_chat}`}>
              <div  className={`d-flex flex-grow-1 overflow-hidden`}>
                
                <div  className={`text-white overflowY-auto ${styles.lista}`}>
                  <h3 className='text-center w-100 fs-4 fst-normal border-bottom border-secondary p-3'>Empresa</h3>
                  <ul className="mt-4 mx-2 list-unstyled">
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
                          { amigoAtivoId ? <span className='rounded-circle px-2 bg-success me-2'></span>:<span className='rounded-circle p-1 bg-secondary me-2'></span>}
                        {amigo.nome}
                      </li>
                    ))}
                  </ul>
                </div>

                {}
                {/* Mudamos o padding para 0 para controlar o espaçamento interno direto no ChatComponent */}
                <div  className='d-flex flex-grow-1 '>
                  {amigoAtivoId ? (
                    <div className='d-flex flex-column w-100 align-items-center'>
                      <h3 className='w-100 bg-transparent d-flex justify-content-center fs-4 text-white p-3 border-bottom border-secondary'>{nome}</h3>
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
        </div>
      </div>
    </div>
  );
}