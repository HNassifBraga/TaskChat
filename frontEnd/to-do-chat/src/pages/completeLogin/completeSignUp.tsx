import {UserSignUp} from '../../services/signUp/complete'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../navbar/navbar';
import { ErrorAlert } from '../errorAlert/errorAlert';
import { useErrorHandler } from '../../hooks/errorHandler';
import type { cookieUser } from '../../interfaces/interfaces';
import { ValidateUserLogedIn } from '../../services/validate/validateLogedIn/validateLogedIn';
import { getUserCookie } from '../../services/getUserCookie/getUserCookie';
import { createLocalStorage } from '../../services/createLocalStorage/createLocalStorage';

export const CompleteSign = ()=>{
    const navigate = useNavigate();
    const [cnpj,setCnpj]=useState<string>('');
    const [idade,setIdade] = useState<number>(0);
    const [cpf, setCpf] = useState<string>('');
    const [user,setUser] = useState<cookieUser|null>(null);

    const {error, errorDetails, handleApiError} = useErrorHandler();


    ValidateUserLogedIn();

    useEffect(()=>{
        const getCookie = async()=>{
            try{
                const cookie = await getUserCookie();
                setUser(cookie);
            }catch(e)
            {
                console.log(e);
            }
        }
        getCookie();
    },[]);

    const handleComplete = async()=>{
        const obj = {cnpj:cnpj,cpf:cpf,idade:idade};
        try{
            await UserSignUp.postUser(obj);
            await createLocalStorage();
            navigate('/mainPage');
        }catch(e)
        {
            handleApiError(e)
        }
    }
    return(
        <>
            <NavBar/>
            <div className='d-flex justify-content-center align-items-center vh-100  '>
            <div className='card p-5 shadow'>
                <h1 className="text-center mb-4 fs-2">finalize cadastro</h1>
                <form onSubmit={(e)=>e.preventDefault()} className=' mt-4'>
                    {!user?.companyId &&(
                        <div className='mb-3'>
                            <label className="form-label" htmlFor='cnpj'>CNPJ</label>
                            <input type="text" className='form-control' placeholder='cnpj' id='cnpj' onChange={(e)=>setCnpj(e.target.value)}/>
                        </div>
                    )}
                    
                    <div className='mb-3'>
                        <label className="form-label" htmlFor='cpf'>CPF</label>
                        <input type="text" className='form-control' name="" id="cpf" placeholder='cpf' onChange={(e)=>{setCpf(e.target.value)}} />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="idade" className='form-label'>Idade</label>
                        <input type="text" name="" id="idade" className='form-control' placeholder='idade' onChange={(e)=>setIdade(Number(e.target.value))}/>
                    </div>
                    <button className='btn btn-primary w-100 py-2 fs-bold' onClick={handleComplete}>finalizar cadastro</button>
                </form>
                <ErrorAlert error={error} errorDetails={errorDetails}/>
            </div>
        </div>
        </>

    )


}