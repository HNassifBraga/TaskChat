import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../../api/api";
import axios from "axios";

export const ValidateUserLogedIn = ()=>{
    const navigate = useNavigate();
    useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response =   await api.get('/validate', { withCredentials: true });
                    return response;
                } catch (e) {
                    if(axios.isAxiosError(e))
                    {
                        console.log(e.response?.data.message)
                    }
                    console.error("Não autorizado, redirecionando...");
                    localStorage.clear();
                    navigate('/');
                }
            };
            checkAuth();
        }, [navigate]);  
} 