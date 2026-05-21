import { api } from "../../api/api";
import type{ companyComplete } from "../../../interfaces/interfaces";
export const getAllCompny=async():Promise<companyComplete[]>=>
{
    const response = await api.get<companyComplete[]>('/getAllCompany');
    console.log(response.data);
    return response.data;
}