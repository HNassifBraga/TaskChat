import { useEffect, useState } from 'react';
import { UserSignUp } from '../../services/signUp/signUpService';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../errorAlert/errorAlert';
import { useErrorHandler } from '../../hooks/errorHandler';
import type {signUpUser} from '../../interfaces/interfaces'
import { getUserCookie } from '../../services/getUserCookie/getUserCookie';
import { createLocalStorage } from '../../services/createLocalStorage/createLocalStorage';


export const SignUp = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [pass, Setpass] = useState<string>('');

    const {error, errorDetails, handleApiError } = useErrorHandler();

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


    const handleSignUp = async () => {

        const userData:signUpUser = {
            nome: nome,
            User: username,
            email: email,
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
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-4 px-3">
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '15px' }}>
                <div className="card-body p-4 p-sm-5">
                    <h1 className="text-center fw-light mb-4 fs-2">Sign Up</h1>
                    
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Nome Completo</label>
                            <input 
                                className="form-control form-control-md shadow-sm" 
                                type="text" 
                                placeholder="Digite seu nome" 
                                onChange={(e) => setNome(e.target.value)} 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Username</label>
                            <input 
                                className="form-control form-control-md shadow-sm" 
                                type="text" 
                                placeholder="Como quer ser chamado?" 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Email</label>
                            <input 
                                className="form-control form-control-md shadow-sm" 
                                type="email" 
                                placeholder="exemplo@email.com" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Senha</label>
                            <input 
                                className="form-control form-control-md shadow-sm" 
                                type="password" 
                                placeholder="Crie uma senha forte" 
                                onChange={(e) => Setpass(e.target.value)} 
                            />
                        </div>

                        <button 
                            className="btn btn-primary w-100 fw-bold shadow-sm mt-3 py-2" 
                            type="button" 
                            onClick={handleSignUp}
                        >
                            CADASTRAR
                        </button>
                    </form>
                    <div className="mt-4">
                       <ErrorAlert error={error} errorDetails={errorDetails}/>
                    </div>
                    <div className="align-item-center">
                        <p className="d-flex justify-content-center mb-0 mt-4 ">já tem uma conta? <br/>clique no link abaixo</p>
                        <button className="d-flex justify-content-center btn btn-link m-0 w-100 " onClick={()=>{navigate('/')}}>Log In</button>
                    </div>
                </div>
            </div>
        </div>
    );
}