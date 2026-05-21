import type { UsersInCompany } from "../../interfaces/interfaces";
import { api } from "../api/api";

export const getAllActiveUsersInCompany = async():Promise<UsersInCompany[]>=>{
    const response = await api.get<UsersInCompany[]>('/getActiveUsersCompany');
    console.log(response);
    return response.data;
}