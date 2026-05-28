
export interface companyData {
    cnpj:string,
    nome:string,
    email:string,
    telefone:string,
    endereco:string
}


export interface companyComplete extends companyData{
    id:number,
    ownerId:number,
    createdAt:string,
}