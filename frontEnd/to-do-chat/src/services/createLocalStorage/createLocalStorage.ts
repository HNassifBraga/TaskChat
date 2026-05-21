import { api } from "../api/api";


export const createLocalStorage= async()=>{
    const response = await api.get('/getLocalStorage',{withCredentials:true})
    console.log(response.data.objLocalStorage)
    localStorage.setItem('nome',response.data.objLocalStorage.nome);
    localStorage.setItem('idade',response.data.objLocalStorage.idade);
}


