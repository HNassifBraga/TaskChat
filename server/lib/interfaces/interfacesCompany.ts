export interface CreateCompanyDTO{
    cnpj:string,
    nome:string,
    ownerId?:number,
    email:string,
    endereco:string,
    telefone:string
}

export interface UpdateCompanyDTO extends CreateCompanyDTO{
    id:number
}