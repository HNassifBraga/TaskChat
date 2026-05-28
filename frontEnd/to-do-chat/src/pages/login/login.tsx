import { LogIn } from "../../services/logIn/logIn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getUserCookie } from "../../services/getUserCookie/getUserCookie";
import { createLocalStorage } from "../../services/createLocalStorage/createLocalStorage";
import styles from './Login.module.css'

export const LogInInt = () => {
    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    // const [details, setDetails] = useState<Details[]>([]);  

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


    const handleLogin = async () => {
        setError('');
        try {
            await LogIn(email, pass);
            await createLocalStorage();
            navigate('/mainPage');
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data.message || 'Erro ao fazer login');
            }
        }
    }


    return (
        
        <div className={`container-fluid vh-100 d-flex align-items-center justify-content-center px-3 flex-column ${styles.bg_login}`}>
            <div className="text-white mb-5 fs-4  ">
                <span
                className={`d-inline-flex align-items-center justify-content-center rounded-4   ${styles.logo}`}
                >
                T
                </span>
                TaskChat
            </div>
            <div className={` shadow p-4 p-md-5 ${styles.card} rounded text-white`} >
                <div className={`card-body`}>
                    <h1 className="text-center mb-4 fs-2">Bem-vindo de volta</h1>
                    <p className="text-secondary text-center">Entre na sua conta para continuar</p>
                    
                    <form onSubmit={(e) =>{ e.preventDefault(); handleLogin()}}>
                        <div className="mb-3">
                            <label className="form-label ">Email</label><br />
                            <input 
                                type="email" 
                                autoComplete="email"
                                className={`rounded w-100 p-2 ${styles.input} text-white`}
                                placeholder="exemplo@email.com" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Senha</label>
                            <input 
                                type="password" 
                                className={`rounded w-100 p-2 ${styles.input} text-white `}
                                placeholder="Digite sua senha" 
                                autoComplete="current-password"
                                onChange={(e) => setPass(e.target.value)} 
                            />
                        </div>

                        <button 
                            className={styles.button} 
                            type="submit"
                        >
                            Entrar
                        </button>
                    </form>
                    <div className={error ? " m-3 d-flex justify-content-center alert alert-danger d-block" : "d-none"}>
                        {error}
                    </div>
                </div>

            </div>
                    <div className="align-item-center justify-content-center d-flex  text-secondary" style={{width:400}}><span className="mt-2">não tem uma conta?</span><button className="d-flex justify-content-center btn btn-link m-0" onClick={()=>{navigate('/signup')}}>cadastre-se</button></div>

        </div>
    );
}
