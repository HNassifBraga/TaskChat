// Services -> Contém as regras de negócios. 


import jwt from 'jsonwebtoken';
import {UserRepository, CompanyRepository} from './repositories'
import type {CreateCompanyDTO} from './repositories'
import { hash, compareSync } from 'bcrypt';
import 'dotenv/config';
import { ChatRepositorie } from './repositories';

 // Nível de segurança/complexidade
interface CreateUserDTO {
    // cnpj:string,
    // cpf:string,
    // idade?:number
    User:string,
    nome:string,
    email:string,
    pass:string,
}
interface completed {
    id:number,
    cnpj?:string,
    cpf:string,
    idade:number
}

interface cleanUser {
    user:string,
    nome:string,
    email:string,
    cpf:string|null,
    role:string,
    idade:number|null
}

export class UserService{
    
    private userRepository = new UserRepository();
    private companyRepository = new CompanyRepository();
    

    //valida os dados e chama a funçao da file repository para cadastrar o usuário
    async create(data:CreateUserDTO)
    {
        const userExists = await this.userRepository.isUnique('user', data.User);
        if(userExists)throw new Error('Usuário existente, escolha um outro nome.')
        const emailExists = await this.userRepository.isUnique('email', data.email);
        if(emailExists)throw new Error('email já cadastrado, digite um novo ou faça login.')

            
        const name = data.nome.toUpperCase();

        const hashedPassword = await hash(data.pass, Number(process.env.saltRounds));

        // const CompanyId:number = (await this.companyRepository.getCompany(data.cnpj))!;
        const obj = {User:data.User, name:name, email:data.email,  hashedPassword:hashedPassword, }
        return await this.userRepository.create(obj) 
    }

    // autenticar os usuários
    async login(email:string,pass:string){

        const obj = await this.userRepository.login(email);//pega os dados do usuário pelo email
        if(obj === null || obj === undefined || !obj)throw new Error('Não achamos esse email no db')//caso nao ache o email, throw erro de que nao existe
        if(compareSync(pass, obj.Pass ) === true){
            return {test:true, obj:obj}//se a senha do db = senha digitada retorne 
        }else{
            return {test:false}
        }
    }

    //pega todos os usuários
    async getAll()
    {
        // if()
        const users =  await this.userRepository.getAll();
        const obj:any[] = [];
        users.map((user)=>{
            const u = {id:user.id, nome:user.nome, user:user.user, email:user.email, pass:user.Pass, companyId:user.companyId, cpf:user.cpf, createdAt:user.createdAt, idade:user.idade, role:user.role, status:user.status};
            obj.push(u);
        })
        return obj;
    }

    
    // acaba de registrar o usuário
    async completeRegistration(data:completed)
    {
        if(!data.cpf) throw new Error('Preencha o campo cpf')
        if(!data.idade) throw new Error('Preencha o campo idade')
        const cpfExists = await this.userRepository.isUnique('cpf', data.cpf);
        if(cpfExists)throw new Error('CPF existente, digite um novo ou faça login.')
        const user = await this.userRepository.getUser(data.id);
        if(data.cnpj)
        {
            console.log(!(user?.companyId), data.cnpj.length);
            if(!(user?.companyId) && data.cnpj.length == 0)throw new Error('Preencha o campo cnpj');
            const companyExists = await this.companyRepository.existsCompany(data.cnpj);
            if(!companyExists)throw new Error('Empresa não existe, fale com o responsável para se comunicar com a gente.');
            const obj = {cpf:data.cpf, companyId:companyExists.id, idade:data.idade, id:data.id}
            return await this.userRepository.completeData(obj)
        }else{
            if(!(user?.companyId))throw new Error('Preencha o campo cnpj');
            const obj = {cpf:data.cpf, idade:data.idade, id:data.id}
            return await this.userRepository.completeData(obj)
        }


    }

    async createCookies (id:number)
    {

        const getUser = async(id:number)=>{
            return await this.userRepository.getUser(id)
        }
        const result = await getUser(id);
        const token = jwt.sign(
        {
            id:result!.id,
            companyId:result!.companyId,
            role:result!.role,
        },
        process.env.JWT_SECRET as string,
        {expiresIn:'1d'});

        return{name:'token',
            value:token,
            options:
            {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'lax' as const,
            maxAge:1000*60*60*24
            }
        }
    }

    resetCookies()
    {
        return{name:'token',
            options:
            {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'lax' as const,
            }
        }
    }


    decodeToken(token:any){
        const decode = jwt.verify(token, process.env.JWT_SECRET as string)as any
        return decode;
    }   

    async getUserToLocalStorage(id:number){
        return await this.userRepository.getUser(id)
    }


    async activeUsersInCompany(companyId:number)
    {
        const users = await this.userRepository.activeUsersInCompany(companyId);
        const cleanUser:cleanUser[] = [];
        users.map((u)=>{
            const obj = {user:u.user, nome:u.nome, email:u.email, cpf:u.cpf, idade:u.idade, role:u.role,id:u.id};
            cleanUser.push(obj);
        })
        return cleanUser;
    }

    async offUsersInCompany(companyId:number)
    {
        const users = await this.userRepository.offUsersInCompany(companyId);
        const cleanUser:cleanUser[] = [];
        users.map((u)=>{
            const obj = {user:u.user, nome:u.nome, email:u.email, cpf:u.cpf, idade:u.idade, role:u.role, id:u.id};
            cleanUser.push(obj);
        });
        return cleanUser;
    }

    async changeStatus(status:'APROVADO'|'NEGADO', id:number){
        return await this.userRepository.changeStatus(status,id);
    }

    async updateRole(role:'ADMIN'|'USER',id:number)
    {
        const updated = await this.userRepository.updateRole(id, role);
        return updated;
    }

    
    async getCompanyUsers(companyId:number)
    {
        const users = await this.userRepository.getCompanyUsers(companyId);
        return users
    }
}





export class CompanyService{
    private companyRepository = new CompanyRepository();
    private userRep = new UserRepository();
    //valida os dados e chama a funçao da file repository para cadastrar a company
    async create(data:CreateCompanyDTO)
    {
        const cnpj = await this.companyRepository.isUnique('cnpj', data.cnpj);
        if(cnpj) throw new Error('Empresa já existe');
        const obj = {cnpj:data.cnpj, nome:data.nome, ownerId:data.ownerId};
        const result =  await this.companyRepository.create(obj);

        await this.userRep.updateCompIdRole(result.ownerId,result.id);
        await this.userRep.changeStatus('APROVADO', result.ownerId);
        return result;
    }


    async getAll()
    {
        return await this.companyRepository.getAll()
    }


}





export class chatService{
    constructor(private readonly chatRep:ChatRepositorie = new ChatRepositorie()){}
    async createChat(nome:string, companyId:number, tipo:'DIRECT'|'GROUP')
    {
        const chat =await this.chatRep.createChat(nome, companyId, tipo);
        return chat;

    }
}