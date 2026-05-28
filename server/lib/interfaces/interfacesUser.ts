
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


interface completed {
    id:number,
    cnpj?:string,
    cpf:string,
    idade:number
}

export interface cleanUser {
    nome:string,
    email:string,
    cpf:string|null,
    role:string,
    idade:number|null
}