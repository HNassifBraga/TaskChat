import { api } from "../api/api";
import type { companyData } from "../../interfaces/interfaces";



export const CompanySignUp= {
    postCompany:async (companyData:companyData) =>{
        const response = await api.post('/registerCompany', companyData);
        return response.data;
    }
}