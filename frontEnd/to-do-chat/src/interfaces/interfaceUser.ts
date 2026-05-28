
export interface signUpUser {
    nome: string,
    cpf:string,
    email: string,
    idade:number,
    pass: string,}

export interface completeUserData {
    cnpj:string,
    cpf:string
    idade:number,
}

export interface UserLocalStorage {
    id:number,
    nome:string,
    email:string
}

export interface cookieUser {
    id:number,
    companyId:number,
    role:string
}



export interface UsersInCompany {
    id:number,
    nome:string,
    email:string,
    cpf:string|null,
    role:string,
    idade:string|null,

}


