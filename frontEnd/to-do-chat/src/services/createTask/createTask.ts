import { api } from "../api/api";

export const createTaskService = async(data:{atarefadoId:number,dateLimit:Date, tarefa:string, status?:string})=>{
    try{

        const task = await api.post('createTask',data);
        return task.data
    }catch(e)
    {
        return e.response
    }
}

