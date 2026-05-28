import { api } from "../api/api";
import type { companyData } from "../../interfaces/interfaceCompany";

export const getCompany = async():Promise<companyData>=>{
    const company = await api.get<companyData>('/getCompany', {withCredentials:true});
    return company.data
}