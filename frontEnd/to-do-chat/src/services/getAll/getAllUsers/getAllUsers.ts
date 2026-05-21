import { api } from "../../api/api";
import type { UserComplete } from "../../../interfaces/interfaces";
export const UserService = {
    getUsers:async (): Promise<UserComplete[]> =>{
        const response = await api.get<UserComplete[]>('/getAllUsers');
        return response.data;
    }
}