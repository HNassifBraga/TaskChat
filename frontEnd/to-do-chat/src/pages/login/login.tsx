import { LogIn } from "../../services/logIn/logIn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getUserCookie } from "../../services/getUserCookie/getUserCookie";
import { createLocalStorage } from "../../services/createLocalStorage/createLocalStorage";

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
        /* px-3 garante um respiro lateral em telas bem pequenas */
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light px-3">
            <div className="card shadow p-4 p-md-5 w-100" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    <h1 className="text-center mb-4 fs-2">Log In</h1>
                    
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control form-control-lg-md" 
                                placeholder="exemplo@email.com" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Senha</label>
                            <input 
                                type="password" 
                                className="form-control form-control-lg-md" 
                                placeholder="Digite sua senha" 
                                onChange={(e) => setPass(e.target.value)} 
                            />
                        </div>

                        <button 
                            className="btn btn-primary w-100 py-2 fw-bold" 
                            onClick={handleLogin}
                        >
                            Entrar
                        </button>
                    </form>
                    <div className={error ? " m-3 d-flex justify-content-center alert alert-danger d-block" : "d-none"}>
                        {error}
                    </div>
                    <div className="align-item-center"><p className="d-flex justify-content-center mb-0 mt-4">não tem uma conta? <br/>clique no link abaixo</p><button className="d-flex justify-content-center btn btn-link m-0 w-100 " onClick={()=>{navigate('/signup')}}>cadastre-se</button></div>
                </div>

            </div>
        </div>
    );
}
