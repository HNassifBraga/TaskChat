
export interface CreateUserDTO {
    nome:string,
    cpf:string,
    email:string,
    idade:number
    pass:string,
    company?:number|string
}

export interface UpdateData {
    id:number,
    companyId?:number,
    cpf:string,
    idade?:number
}



export interface cleanUser {
    nome:string,
    email:string,
    cpf:string|null,
    role:string,
    idade:number|null,
    id:number
}

export interface Cookies{
    id:number,
    companyId:number,
    role:string,
    iat:number,
    exp:number
}