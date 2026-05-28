import { useEffect, useState } from 'react';
import { UserSignUp } from '../../services/signUp/signUpService';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../errorAlert/errorAlert';
import { useErrorHandler } from '../../hooks/errorHandler';
import type {signUpUser} from '../../interfaces/interfaceUser'
import { getUserCookie } from '../../services/getUserCookie/getUserCookie';
import { createLocalStorage } from '../../services/createLocalStorage/createLocalStorage';
import { cleanDigits } from '../../utils/formatters';
import styles from './Signup.module.css'

export const SignUp = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [idade, setIdade] = useState<number>(0);
    const [pass, Setpass] = useState<string>('');

    const {error, errorDetails, handleApiError } = useErrorHandler();


    // caso o usuário tenha algum token, significa que esta cadastrado, logo não tem porque estar nessa página
    useEffect(() => {
        const getUserCookies = async()=>{
            const cookie = await getUserCookie();
            if(cookie.role)
            {
                navigate('/mainPage');
            }
        }
        getUserCookies();
    }, [navigate]);

// ________________________________________________________________________________________________________________





    const handleSignUp = async () => {

        const userData:signUpUser = {
            nome: nome,
            cpf:cpf,
            email: email,
            idade:idade,
            pass: pass,
        };
        try {
            const response = await UserSignUp.postUser(userData);
            console.log(response);
            await createLocalStorage();
            navigate('/mainPage');
        } catch (e: unknown) {
            handleApiError(e);
        }
    }


    return (
        <div className={`container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center py-4 px-3  ${styles.bg_signup}`}>
            <div className="text-white mb-5 fs-4  ">
                <span
                className={`d-inline-flex align-items-center justify-content-center rounded-4   ${styles.logo}`}
                >
                T
                </span>
                TaskChat
            </div>
            <div className={` shadow-lg rounded text-white w-25 ${styles.card}`} >
                <div className="card-body p-4 p-sm-5">
                    <h1 className="text-center fw-light mb-4 fs-2">Crie sua conta</h1>
                    <p className='text-center text-secondary'>Comece gratis em menos de um minuto</p>
                    
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label small text-white">Nome Completo</label>
                            <input 
                                className={`${styles.input} text-white w-100 rounded p-2`}
                                type="text" 
                                placeholder="Digite seu nome" 
                                onChange={(e) => setNome(e.target.value)} 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label small text-white">CPF</label>
                            <input 
                                className={`${styles.input} text-white w-100 rounded p-2`}
                                type="text" 
                                placeholder="CPF" 
                                value={cpf}
                                onChange={(e)=>{setCpf(cleanDigits(e.target.value))}} 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small text-white">Email</label>
                            <input 
                                className={`${styles.input} text-white w-100 rounded p-2`}
                                type="email" 
                                placeholder="exemplo@email.com" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small text-white">Idade</label>
                            <input 
                                className={`${styles.input} text-white w-100 rounded p-2`}
                                type="email" 
                                placeholder="Idade" 
                                onChange={(e) => setIdade(Number(e.target.value))} 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small text-white">Senha</label>
                            <input 
                                className={`${styles.input} text-white w-100 rounded p-2`}
                                type="password" 
                                placeholder="Crie uma senha forte" 
                                onChange={(e) => Setpass(e.target.value)} 
                            />
                        </div>

                        <button 
                            className={styles.button}
                            type="button" 
                            onClick={handleSignUp}
                        >
                            CADASTRAR
                        </button>
                    </form>
                    <div className="mt-4">
                       <ErrorAlert error={error} errorDetails={errorDetails}/>
                    </div>
                </div>
            </div>
                    <div className=" d-flex w-25 justify-content-center mt-3">
                        <span className="text-secondary mt-2 text-center ">já tem uma conta?</span>
                        <button className="btn btn-link m-0  " onClick={()=>{navigate('/login')}}>Log In</button>
                    </div>
        </div>
    );
}