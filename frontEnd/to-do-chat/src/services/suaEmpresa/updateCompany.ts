import { api } from "../api/api";
import type { companyComplete } from "../../interfaces/interfaceCompany";
export const updateCompany = async(data:Partial<Omit<companyComplete, 'ownerId'|'createdAt'>>, id:number)=>{
    const datas = {...data,id:id};
    const company = await api.put('/updateCompany', {data:datas});
    return company.data;
}