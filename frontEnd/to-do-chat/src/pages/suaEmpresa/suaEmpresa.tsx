import { useEffect, useState } from "react";
import { NavBar } from "../navbar/navbar";
import { getAllActiveUsersInCompany } from "../../services/suaEmpresa/activeUsers";
import type { UsersInCompany } from "../../interfaces/interfaces";
import { getAllOffUsersInCompany } from "../../services/suaEmpresa/offUsers";
import { changeStatus } from "../../services/updateUserStatus/updateuserStatus";
import { getUserCookie } from "../../services/getUserCookie/getUserCookie";
import { changeRole } from "../../services/changerole/changeRole";

export function SuaEmpresa(){
    const [onFuncionarios, setOnFuncionarios] = useState<UsersInCompany[]>([]);
    const [offFuncionarios, setOffFuncionarios] = useState<UsersInCompany[]>([]);
    const[show, setShow] = useState('APROVADO');
    const [dado,setDado] = useState(0);
    const [id,setId] = useState(0);

    useEffect(()=>{
        const getCookie = async()=>{
            const cookie = await getUserCookie();
            setId(cookie.id);
        };

        getCookie();

    },[])

    useEffect(()=>{
        const callActive = async()=>{
            const response:UsersInCompany[] = await getAllActiveUsersInCompany()
            setOnFuncionarios(response);
        }
        const callOff = async()=>{
            const response:UsersInCompany[]= await getAllOffUsersInCompany();
            setOffFuncionarios(response);
        }

        callOff();
        callActive();
    },[dado]);

    const mostrarRegistrados = ()=>{
        if(onFuncionarios){
            console.log(onFuncionarios)
            setShow('APROVADO');
        }
    }
    const mostrarPendentes = ()=>{
        if(offFuncionarios){
            console.log(offFuncionarios);
            setShow('PENDENTE');
        }
    }

    return (
        <>
            <NavBar/>
            <div className="d-flex justify-content-center w-100 mt-5 ">
                <div className=" d-flex flex-column w-auto ">
                    <div className="d-flex p-3 justify-content-between bg-dark rounded-top">
                        <button className='btn btn-primary' onClick={mostrarRegistrados}>funcionarios registrados</button>
                        <button className='btn btn-primary' onClick={mostrarPendentes}>all off</button>
                    </div>
                    <div className="d-flex justify-content-center shadow p-3 rounded-bottom">
                        {show == 'PENDENTE' &&  (
                            <div className="d-flex flex-column align-items-center">
                                <h2>Aprove Usuários</h2>
                                <table className="table table-hover table-bordered mt-3">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">user</th>
                                            <th scope="col">nome</th>
                                            <th scope="col">email</th>
                                            <th scope="col">cpf</th>
                                            <th scope="col">idade</th>
                                            <th scope="col">role</th>
                                            <th scope="col">ação</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {offFuncionarios.map((u) => (
                                            <tr key={u.id}>
                                                <td>{u.user}</td>
                                                <td>{u.nome}</td>
                                                <td>{u.email}</td>
                                                <td>{u.cpf || "---"}</td>
                                                <td>{u.idade || "---"}</td>
                                                <td>{u.role}</td>
                                                <td>
                                                    <button className="btn btn-primary mx-1" onClick={async ()=>{ await changeStatus('APROVADO',u.id); setDado(prev=>prev+1)}}>aprovar</button>
                                                    <button className="btn btn-warning mx-1" onClick={async ()=>{await changeStatus('NEGADO',u.id); setDado(prev=>prev+1)}}>negar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {show == 'APROVADO' &&  (
                            <div className="d-flex flex-column align-items-center">
                                <h2>Funcionários cadastrados</h2>
                                <table className="table table-hover table-bordered mt-3">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">user</th>
                                            <th scope="col">nome</th>
                                            <th scope="col">email</th>
                                            <th scope="col">cpf</th>
                                            <th scope="col">idade</th>
                                            <th scope="col">role</th>
                                            <th scope="col">ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {onFuncionarios.map((u) => (
                                            <tr key={u.id}>
                                                {u.id!= id && (
                                                    <>
                                                    
                                                    <td>{u.user}</td>
                                                    <td>{u.nome}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.cpf || "---"}</td>
                                                    <td>{u.idade || "---"}</td>
                                                    <td>{u.role}</td>
                                                    {u.role != 'ADMIN' &&(
                                                        <td>
                                                            <button className="btn btn-primary mx-1" onClick={async ()=>{ await changeRole('ADMIN',u.id); setDado(prev=>prev+1)}}>tornar admin</button>
                                                        </td>
                                                    )}
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}