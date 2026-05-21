import {useEffect, useState} from 'react';
import { UserService } from '../../../services/getAll/getAllUsers/getAllUsers';
import type { UserComplete } from '../../../interfaces/interfaces';
import { ValidateSuperUser } from '../../../services/validate/validateSuperUser/validateSuperUser';
import { NavBar } from '../../navbar/navbar';
export function GetAllUsers()
{
    const [users,setUsers] = useState<UserComplete[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    ValidateSuperUser();
    useEffect(()=>{
        const fetchUsers = async ()=>{
            try{
                setLoading(true);
                const data = await UserService.getUsers();
                setUsers(data);
            }catch(e)
            {
                console.log(e)
                setError('error ao carregar users');
            }finally{
                setLoading(false);
            }
        }
        fetchUsers();

    },[])
    
    if(loading){return <p>carregando ...</p>}
    if(error){return <p>{error} ...</p>}

    console.log(users)
    return (
    <>
        <NavBar/>
        <div className='p-5'>
            <table className='table mr-5'>
                <thead>
                    <tr>
                        <th scope='col'>id</th>
                        <th scope='col'>nome</th>
                        <th scope='col'>user</th>
                        <th scope='col'>email</th>
                        <th scope='col'>companyId</th>
                        <th scope='col'>cpf</th>
                        <th scope='col'>pass</th>
                        <th scope='col'>idade</th>
                        <th scope='col'>role</th>
                        <th scope='col'>status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user)=>(
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nome}</td>
                            <td>{user.user}</td>
                            <td>{user.email}</td>
                            <td>{user.companyId}</td>
                            <td>{user.cpf}</td>
                            <td>{user.pass}</td>
                            <td>{user.idade}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
    </> 
    );
}

export default GetAllUsers;
