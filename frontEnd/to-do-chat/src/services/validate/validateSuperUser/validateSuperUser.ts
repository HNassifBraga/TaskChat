import axios from "axios";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const ValidateSuperUser = ()=>{
    const navigate = useNavigate();
    useEffect(() => {
            const checkAuth = async () => {
                try {
                    await api.get('/validateSuperuser', { withCredentials: true });
                    console.log("Usuário autenticado");
                } catch (e) {
                    if(axios.isAxiosError(e))
                    {
                        console.log(e)
                    }
                    console.error("Não autorizado, redirecionando...");
                    localStorage.clear();
                    navigate('/');
                }
            };
            checkAuth();
        }, [navigate]);
}