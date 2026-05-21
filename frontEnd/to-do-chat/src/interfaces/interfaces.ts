
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

export interface signUpUser {
    User: string,
    nome: string,
    email: string,
    pass: string,
}

export interface UsersInCompany {
    id:number,
    user:string,
    nome:string,
    email:string,
    cpf:string|null,
    role:string,
    idade:string|null,

}

export interface UserComplete extends signUpUser{
    id:string,
    idade?:string|null,
    cpf:string|null,
    companyId:number|null,
    role?:string,
    status?:string
}


export interface ErrorAlertProps {
    error: string;
    errorDetails: { campo: string; mensagem: string }[];
}    


export interface companyData {
    cnpj:string,
    nome:string
}


export interface companyComplete extends companyData{
    id:number,
    ownerId:number,
    createdAt:string,
}

// Definindo a interface para o TypeScript (baseado no seu Zod) errorHandler.ts
export interface ErrorDetail {
    campo: string;
    mensagem: string;
}