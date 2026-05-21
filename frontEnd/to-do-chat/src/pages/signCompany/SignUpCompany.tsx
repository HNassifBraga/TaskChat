import { useEffect, useState } from "react";
import { CompanySignUp } from "../../services/signCompany/signCompany";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../navbar/navbar";
import { useErrorHandler } from "../../hooks/errorHandler";
import { ErrorAlert } from "../errorAlert/errorAlert";
import { ValidateUserLogedIn } from "../../services/validate/validateLogedIn/validateLogedIn";
import { getUserCookie } from "../../services/getUserCookie/getUserCookie";


export const SignCompanyUp = ()=>{
    const [cnpj, setCnpj] = useState('');
    const [nome, setNome] = useState('');
    
    const { error, errorDetails, handleApiError } = useErrorHandler();

    
    const navigate = useNavigate();
    ValidateUserLogedIn();
    useEffect(()=>{
        const hasCompany = async()=>{
            const cookie = await getUserCookie();
            if(cookie.companyId)
            {
                navigate('/mainPage');
            }
        };
        hasCompany();
    },[navigate]);
    const handleSignUpCompany = async()=>{

        try{
            const obj = {cnpj:cnpj,nome:nome};
            await CompanySignUp.postCompany(obj);
            navigate('/mainPage');
        }catch(e)
        {
           handleApiError(e);
        }
    }


    return(
    <>
            <NavBar/>
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="card d-flex justify-content-center align-items-center p-4">
                <div className="card-body"> 
                    <h1 className="mb-4
                     fs-2 text-center">Cadastre Sua Empresa</h1>
                    <form onSubmit={(e)=>e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="cnpj">CNPJ</label>
                            <input type="text" name="" placeholder="CNPJ" className="form-control" id="cnpj"  onChange={(e)=>{setCnpj(e.target.value)}}/>
                        </div>
                        <div className="mb-4">
                            <label className="form-label" htmlFor="nome">Nome</label>
                            <input type="text" name="" placeholder="Nome" className="form-control" id="nome" onChange={(e)=>{setNome(e.target.value)}}/>
                        </div>
                        <button className="btn btn-primary p-2 w-100" onClick={handleSignUpCompany}>Cadastrar</button>
                    </form>
                    <ErrorAlert error={error} errorDetails={errorDetails}/>
                </div>
                
            </div>
        </div>
    </>
    
    )
}