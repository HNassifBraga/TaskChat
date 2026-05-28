import { useEffect, useState } from "react";
import { NavBar } from "../navbar/navbar";
import { getAllActiveUsersInCompany } from "../../services/suaEmpresa/activeUsers";
import type { UsersInCompany } from "../../interfaces/interfaceUser";
import { getAllOffUsersInCompany } from "../../services/suaEmpresa/offUsers";
import { changeStatus } from "../../services/updateUserStatus/updateuserStatus";
import { getUserCookie } from "../../services/getUserCookie/getUserCookie";
import { changeRole } from "../../services/changerole/changeRole";
import type { companyComplete } from "../../interfaces/interfaceCompany";
import styles from './SuaEmpresa.module.css'
import { getCompany } from "../../services/suaEmpresa/getCompany";
import { updateCompany } from "../../services/suaEmpresa/updateCompany";
export function SuaEmpresa(){
    const [id,setId] = useState(0);
    const [onFuncionarios, setOnFuncionarios] = useState<UsersInCompany[]>([]);
    const [offFuncionarios, setOffFuncionarios] = useState<UsersInCompany[]>([]);
    const [role, setRole] = useState('')
    const [companyId, setCompanyId] = useState<number|null>(null);
    const [bool,setBool] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        cnpj: "",
        telefone: "",
        email: "",
        endereco: ""
    });

    
    useEffect(()=>{
        const getCookie = async()=>{
            const cookie = await getUserCookie();
            setId(cookie.id);
            setRole(cookie.role);
        };
        const getCompanyData = async () => {
            try {
                    const data: Partial<Omit<companyComplete, 'ownerId'>> = await getCompany();
                    setForm({
                        nome: data.nome || "",
                        cnpj: data.cnpj || "",
                        telefone: data.telefone || "",
                        email: data.email || "",
                        endereco: data.endereco || ""
                    });
                    if(!data.id)throw new Error('sem company id');
                    setCompanyId(data.id);
                } catch (e) {
                    console.error(e);
                }
        };
        getCompanyData();
        getCookie();

    },[])

    useEffect(()=>{
        if(id==0)return
        const callActive = async()=>{
            const response:UsersInCompany[] = await getAllActiveUsersInCompany(id);
            setOnFuncionarios(response);
        }
        const callOff = async()=>{
            const response:UsersInCompany[]= await getAllOffUsersInCompany();
            console.log(response);
            setOffFuncionarios(response);
        }

        callOff();
        callActive();
    },[id, bool ]);


    const changeStatus1 = async( status:'APROVADO'|'NEGADO',id:number)=>{
        try{
            const user =await  changeStatus(status,id);
            console.log('certo',user);
            setBool(!bool);
        }catch(e)
        {
            console.log(e.response)
        }
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setForm(prev => ({
            ...prev,
            [id]: value // O id do input deve ser exatamente igual à chave do objeto
        }));
    };
    const updateCompany1 = async()=>{
        try{
            if(!companyId)throw new Error('sem company id');
            const upComp = await updateCompany(form, companyId);
            console.log(upComp);
        }catch(e)
        {
            console.log(e.response)
        }
    }
    const fLetter = (userNome:string)=>{
        return userNome[0]
    }
    return (
        <>
            <NavBar/>
            <div className={`d-flex text-white flex-column w-100 p-5 ${styles.bg}  min-vh-100`}>
                <h1>Minha <span className={styles.nome}>empresa</span></h1>
                <p className="text-secondary fs-5">Atualize os dados, aprove novos membros e gerencie sua equipe.</p>
                <div className={`text-white my-5 rounded p-3 w-75 align-self-center ${styles.card}`}>
                    <div className="mx-4 my-1">
                        <h2 className="fs-4">Dados da empresa</h2>
                        <p className="text-secondary">Essas informações aparecem para todos os membros</p>
                    </div>
                    <form onSubmit={(e)=>{e.preventDefault(); updateCompany1()}} className=" d-flex flex-column">
                        <div className="container-fluid w-100   p-2">
                            <div className="row">
                                <div className="col mx-4 mt-1">
                                    <label htmlFor="nome" className=" text-secondary">Nome da empresa</label>
                                    <input type="text" placeholder="" id="nome" className={`py-1 px-2 w-100 ${styles.input} rounded text-white`} value={form.nome} onChange={handleInputChange}/>
                                </div>
                                <div className="col mx-4 my-1">
                                    <label htmlFor="cnpj" className=" text-secondary">CNPJ</label>
                                    <input type="text" placeholder="" id="cnpj" className={` py-1 px-2 w-100  ${styles.input} rounded text-white`} value={form.cnpj} onChange={handleInputChange}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col mx-4 my-1">
                                    <label htmlFor="telefone" className=" text-secondary">Telefone</label>
                                    <input type="text" placeholder="" id="telefone" className={`py-1 px-2 w-100 ${styles.input} rounded text-white`} value={form.telefone} onChange={handleInputChange}/>
                                </div>
                                <div className="col mx-4 my-1">
                                    <label htmlFor="email" className=" text-secondary">Email de contato</label>
                                    <input type="text" placeholder="" id="email" className={` py-1 px-2 w-100  ${styles.input} rounded text-white`} value={form.email} onChange={handleInputChange}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col mx-4 my-1">
                                    <label htmlFor="endereco" className=" text-secondary">Endereço</label>
                                    <input type="text" placeholder="" id="endereco" className={` py-1 px-2 w-100  ${styles.input} rounded text-white`} value={form.endereco} onChange={handleInputChange}/>
                                </div>
                            </div>
                            {
                                role=='CEO' &&(
                                    <div className="row me-3 mt-3">
                                        <div className="d-flex flex-column justify-content-end">
                                            <button className={`${styles.button} fs-6 align-self-end my-0  col`}>Salvar alterações</button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </form>
                </div>
                {offFuncionarios.length>0 && (<div className={`text-white my-5 rounded p-3 w-75 align-self-center ${styles.card}`}>
                    <h2 className="fs-4 mb-0">Usuários pendentes</h2>
                    <p className="text-secondary">Solicitações aguardando sua aprovação</p>
                    <div className="border border-secondary rounded overflow-hidden">
                        <table className=" w-100 ">
                            <thead className="border-secondary border-bottom ">
                                <tr >
                                    <th className="p-3">Nome</th>
                                    <th>Email</th>
                                    <th>CPF</th>
                                    <th className="text-end px-5">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                { (offFuncionarios.map((u)=>(
                                    <tr key={u.id}>
                                        <td className="col p-3"><span className={`bolder  ${styles.fLetter}`}>{fLetter(u.nome)}</span> {u.nome}</td>
                                        <td className="col">{u.email}</td>
                                        <td className="col">{u.cpf}</td>    
                                        <td className="d-flex justify-content-end pe-4">
                                            <button className={`${styles.button} my-2 px-4`} onClick={()=>{changeStatus1('APROVADO', u.id)}}> Aceitar</button>
                                            <button className={`ms-3 ${styles.buttonNegar} rounded text-white my-2 border-0 px-4`} onClick={()=>{changeStatus1('NEGADO', u.id)}}><span className="me-2">X </span> Negar</button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                    
                </div>)}
                { onFuncionarios.length>0 &&(<div className={`text-white my-5 rounded p-3 w-75 align-self-center ${styles.card}`}>
                    <h2 className="fs-4 mb-0">Membros da empresa</h2>
                    <p className="text-secondary">Gere tarefas, gerencie permissões ou remova membros</p>
                    <div className="border border-secondary rounded overflow-hidden">
                        <table className=" w-100 ">
                            <thead className="border-secondary border-bottom ">
                                <tr >
                                    <th className="p-3">Nome</th>
                                    <th>Email</th>
                                    <th>CPF</th>
                                    <th>Papel</th>
                                    <th className="text-end px-5">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(onFuncionarios.map((u)=>(
                                    <tr key={u.id}>
                                        <td className="col p-3"><span className={`bolder  ${styles.fLetter}`}>{fLetter(u.nome)}</span> {u.nome}</td>
                                        <td className="col">{u.email}</td>
                                        <td className="col">{u.cpf}</td>    
                                        <td className="col">{u.role}</td>    
                                        <td className="d-flex justify-content-end pe-4">
                                            <button className={`ms-3 ${styles.buttonNegar} rounded text-light my-2 border-0 px-4 py-2`}> Gerar tarefa</button>
                                            {u.role == 'ADMIN'?(
                                                <button className={`ms-3 ${styles.buttonNegar} rounded text-light my-2 border-0 px-4 py-2`}>Remover admin</button>
                                            ):(
                                                <button className={`ms-3 ${styles.buttonNegar} rounded text-light my-2 border-0 px-4 py-2`}>Tornar admin</button>
                                            )}
                                            <button className={`ms-3 ${styles.buttonNegar} rounded text-danger my-2 border-0 px-4 py-2`}>Remover</button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                    
                </div>)}
            </div>
        </>
    );
}