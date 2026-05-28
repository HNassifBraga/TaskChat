
import { NavBar } from '../navbar/navbar'
import { ValidateUserLogedIn } from '../../services/validate/validateLogedIn/validateLogedIn'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cleanDigits } from '../../utils/formatters';
import { CompanySignUp } from '../../services/signCompany/signCompany';
import { useErrorHandler } from "../../hooks/errorHandler";
import { ErrorAlert } from "../errorAlert/errorAlert";
import styles from './Mainpage.module.css'
import { vincularCompany } from '../../services/signUp/complete';
export const MainPage = ()=>{
    const navigate = useNavigate();
    const [mostrarInicio, setMostrarInicio] = useState<boolean>(true);
    const [mostrarRegistro, setMostrarRegistro] = useState<boolean>(false);
    const [mostrarVinculo, setMostrarVinculo] = useState<boolean>(false);
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [email,setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const { error, errorDetails, handleApiError } = useErrorHandler();

    ValidateUserLogedIn();

    // console.log(mostrarRegistro)


    const handleSignUpCompany = async()=>{

        try{
            const obj = {cnpj:cnpj,nome:nome, email:email, telefone:telefone, endereco:endereco};
            await CompanySignUp.postCompany(obj);
            navigate('/myCompany');
        }catch(e)
        {
           handleApiError(e);
        }
    }

    const handleVinculo = async()=>{
        try{
            const obj = {cnpj:cnpj}
            await vincularCompany.postUser(obj);
        }catch(e){
            console.log(e.response)
        }
    }
    const userNome = localStorage.getItem('nome');

    return (
       <div className={`d-flex flex-column vh-100 ${styles.bg_main}`}>
        <nav><NavBar/></nav>
        {
            mostrarInicio &&(

                <div className='d-flex flex-column align-items-center justify-content-center  vh-100'>
                    <h1 className='text-white'>Bem-vindo, <span className={styles.nome}>{userNome}</span></h1>
                    <p className='text-secondary text-center'>Para começar, configure o espaço da sua empresa. <br />Você poderá gerenciar projetos, chamados e sua equipe em um só lugar.</p>
                    <div className='d-flex '>
                        <div className={`p-1 border rounded  text-white ${styles.card} mx-3`}>
                        <div className=' d-flex flex-column align-items-center border rounded p-3 shadow-lg bg'>
                            <div className='w-100 mt-4'>

                                <h2 className='text-start fw-normal mb-3 text-white fs-5'>Registrar empresa</h2>
                            </div>
                            <p className={`text-secondary `}>Crie um novo espaço e convide o seu time para <br /> começar do zero</p>
                                <button className={` ${styles.button}`} onClick={()=>{setMostrarInicio(false); setMostrarRegistro(true)}}>Registrar Empresa</button>
                        </div>
                    </div>
                    <div className={`p-1 border rounded  text-white ${styles.card}`}>
                        <div className=' d-flex flex-column align-items-center border rounded p-3 shadow-lg bg'>
                            <div className='w-100 mt-4'>

                                <h2 className='text-start fw-normal mb-3 text-white fs-5'>Vincular-se a uma empresa</h2>
                            </div>
                            <p className={`text-secondary `}>Entre em um espaço existente com o CNPJ  da <br />   empresa</p>
                                <button className={` ${styles.button}`} onClick={()=>{setMostrarInicio(false); setMostrarVinculo(true)}}>Vincular-se a uma empresa</button>
                        </div>
                    </div>
                    </div>
                </div>
            )
        }
        {
            mostrarRegistro && (
                <div className="vh-100 d-flex justify-content-center align-items-center flex-column">
                    <div className={`rounded text-white d-flex justify-content-center align-items-center p-5 ${styles.card}`}>
                        <div className="card-body"> 
                            <h1 className="mb-4
                            fs-2 text-center">Cadastre Sua Empresa</h1>
                            <form onSubmit={(e)=>e.preventDefault()}>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="cnpj">CNPJ</label>
                                    <input type="text" name="" placeholder="CNPJ" className={`w-100 rounded text-white p-2 ${styles.input}`} id="cnpj" value={cnpj} onChange={(e)=>{setCnpj(cleanDigits(e.target.value))}}/>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label" htmlFor="nome">Nome</label>
                                    <input type="text" name="" placeholder="Nome" className={`w-100 rounded text-white p-2 ${styles.input}`}  id="nome" onChange={(e)=>{setNome(e.target.value)}}/>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label" htmlFor="email">email</label>
                                    <input type="text" name="" placeholder="email" className={`w-100 rounded text-white p-2 ${styles.input}`}  id="email" onChange={(e)=>{setEmail(e.target.value)}}/>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label" htmlFor="endereco">endereço</label>
                                    <input type="text" name="" placeholder="endereço" className={`w-100 rounded text-white p-2 ${styles.input}`}  id="endereco" onChange={(e)=>{setEndereco(e.target.value)}}/>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label" htmlFor="Telefone">telefone</label>
                                    <input type="text" name="" placeholder="Telefone" className={`w-100 rounded text-white p-2 ${styles.input}`}  id="Telefone" onChange={(e)=>{setTelefone(e.target.value)}}/>
                                </div>
                                <button className={styles.button} onClick={handleSignUpCompany}>Cadastrar</button>
                            </form>
                            <ErrorAlert error={error} errorDetails={errorDetails}/>
                        </div>
                        
                    </div>
                    <p className='text-secondary align-self-center mt-2'>Sua empresa já esta cadasstrada? <button className='btn btn-link m-0' onClick={()=>{setMostrarRegistro(false); setMostrarVinculo(true)}}>se vincule aqui</button></p>
                </div>

            )
        }
        {
            mostrarVinculo && (
                <div className='  d-flex flex-column vh-100 align-items-center justify-content-center'>
                    <div className={`border rounded d-flex flex-column p-5 text-white ${styles.card}`}>
                        <h3>Se vincule a uma empresa</h3>
                        <form onSubmit={(e)=>{e.preventDefault()}} className='d-flex flex-column mt-3'>
                            <label htmlFor="" className='form-label'>CNPJ</label>
                            <input type="text"
                            placeholder='CNPJ'
                            value={cnpj}
                            className={`text-white p-2 rounded w-100 ${styles.input}`}
                            onChange={(e)=>{setCnpj(cleanDigits(e.target.value))}}
                            />
                            <button className={styles.button} onClick={handleVinculo}>Se Vincular</button>
                        </form>
                    </div>
                    <p className='text-secondary align-self-center mt-2'>É o primeiro acesso da sua empresa? <button className='btn btn-link m-0' onClick={()=>{setMostrarVinculo(false);setMostrarRegistro(true)}}>cadastre-a aqui</button></p>
                </div>
            )
        }
       </div>
    );
}