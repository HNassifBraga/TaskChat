// Services -> Contém as regras de negócios. 


import jwt from 'jsonwebtoken';
import {UserRepository, CompanyRepository, TaskRepository, ChatRepositorie} from './repositories'
import type {CreateCompanyDTO, UpdateCompanyDTO} from './interfaces/interfacesCompany'
import { hash, compareSync } from 'bcrypt';
import 'dotenv/config';
import type { CreateUserDTO, cleanUser } from './interfaces/interfacesUser';

 // Nível de segurança/complexidade


export class UserService{
    
    private userRepository = new UserRepository();
    private companyRepository = new CompanyRepository();
    

    //cadastra o usuário
    async create(data:CreateUserDTO)
    {
        const emailExists = await this.userRepository.isUnique('email', data.email);
        if(emailExists)throw new Error('email já cadastrado, digite um novo ou faça login.');
        const cpfExists = await this.userRepository.isUnique('cpf', data.cpf);
        if(cpfExists)throw new Error('cpf já cadastrado, digite um novo ou faça login.')

            
        const name = data.nome.toUpperCase();

        const hashedPassword = await hash(data.pass, Number(process.env.saltRounds));

        if(data.company && typeof(data.company) == 'string')
        {
            const companyId:number = (await this.companyRepository.getCompany(data.company))!;
            const obj = {nome:name,cpf:data.cpf,  email:data.email, idade:data.idade, pass:hashedPassword, company:companyId };
            return await this.userRepository.create(obj);
        }else{
            const obj = {nome:name,cpf:data.cpf,  email:data.email, idade:data.idade, pass:hashedPassword };
            return await this.userRepository.create(obj);
        }
    }

// _____________________________________________________________________________________________________________________________________



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
// _____________________________________________________________________________________________________________________________________


    //pega todos os usuários
    async getAll()
    {
        // if()
        const users =  await this.userRepository.getAll();
        const obj:any[] = [];
        users.map((user)=>{
            const u = {id:user.id, nome:user.nome, email:user.email, pass:user.Pass, companyId:user.companyId, cpf:user.cpf, createdAt:user.createdAt, idade:user.idade, role:user.role, status:user.status};
            obj.push(u);
        })
        return obj;
    }
// _____________________________________________________________________________________________________________________________________

    
    // acaba de registrar o usuário
    async vincularCompany(id:number, cnpj:string)
    {
        const company =  await this.companyRepository.getCompany(cnpj); 
        const user = this.userRepository.vincularCompany(company, id);
        return user;    
    }
// _____________________________________________________________________________________________________________________________________

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

// _____________________________________________________________________________________________________________________________________

    decodeToken(token:any){
        const decode = jwt.verify(token, process.env.JWT_SECRET as string)as any
        return decode;
    }   
// _____________________________________________________________________________________________________________________________________

    async getUserToLocalStorage(id:number){
        return await this.userRepository.getUser(id)
    }

// _____________________________________________________________________________________________________________________________________

    async activeUsersInCompany(companyId:number)
    {
        const users = await this.userRepository.activeUsersInCompany(companyId);
        const cleanUser:cleanUser[] = [];
        users.map((u)=>{
            const obj = { nome:u.nome, email:u.email, cpf:u.cpf, idade:u.idade, role:u.role,id:u.id};
            cleanUser.push(obj);
        })
        return cleanUser;
    }
// _____________________________________________________________________________________________________________________________________

    async offUsersInCompany(companyId:number)
    {
        const users = await this.userRepository.offUsersInCompany(companyId);
        const cleanUser:cleanUser[] = [];
        users.map((u)=>{
            const obj = { nome:u.nome, email:u.email, cpf:u.cpf, idade:u.idade, role:u.role, id:u.id};
            cleanUser.push(obj);
        });
        return cleanUser;
    }
// _____________________________________________________________________________________________________________________________________

    async changeStatus(status:'APROVADO'|'NEGADO', id:number, companyId:number){
        const companyBosses = this
        return await this.userRepository.changeStatus(status,id);
    }
// _____________________________________________________________________________________________________________________________________

    async updateRole(role:'ADMIN'|'USER',id:number)
    {
        const updated = await this.userRepository.updateRole(id, role);
        return updated;
    }
// _____________________________________________________________________________________________________________________________________

    //provavelmente vou mudar isso
    async getCompanyUsers(companyId:number)
    {
        const users = await this.userRepository.getCompanyUsers(companyId);
        return users
    }
// _____________________________________________________________________________________________________________________________________

}





export class CompanyService{
    private companyRepository = new CompanyRepository();
    private userRep = new UserRepository();
    //valida os dados e chama a funçao da file repository para cadastrar a company
    async create(data:CreateCompanyDTO)
    {
        const cnpj = await this.companyRepository.isUnique('cnpj', data.cnpj);
        if(cnpj) throw new Error('Empresa já existe');
        const email = await this.companyRepository.isUnique('email', data.email);
        if(email) throw new Error('Empresa já existe');
        const telefone = await this.companyRepository.isUnique('telefone', data.telefone);
        if(telefone) throw new Error('Empresa já existe');
        const obj = {cnpj:data.cnpj, nome:data.nome, ownerId:data.ownerId, email:data.email, endereco:data.endereco, telefone:data.telefone};
        const result =  await this.companyRepository.create(obj);

        await this.userRep.updateCompIdRole(result.ownerId,result.id);
        await this.userRep.changeStatus('APROVADO', result.ownerId);
        return result;
    }


    async getAll()
    {
        return await this.companyRepository.getAll()
    }


    async getCompany(id:number)
    {
        return await this.companyRepository.getCompanyById(id);
    }

    async updateCompany(data:Partial<Omit<UpdateCompanyDTO, 'ownerId'>>)
    {
        const cnpj = await this.companyRepository.isUniqueNot('cnpj', data.cnpj!, data.id!);
        if(cnpj) throw new Error('Outra empresa com esse cnpj já existe');
        const email = await this.companyRepository.isUniqueNot('email', data.email!, data.id!);
        if(email) throw new Error('Outra empresa com esse email já existe');
        const telefone = await this.companyRepository.isUniqueNot('telefone', data.telefone!,data.id!);
        if(telefone) throw new Error('Outra empresa com esse telefone já existe');
        return await this.companyRepository.updateCompany(data);
    }
}





export class chatService{
    constructor(private readonly chatRep:ChatRepositorie = new ChatRepositorie()){}
    async createChat(nome:string, companyId:number, tipo:'DIRECT'|'GROUP')
    {
        try{
            const chat =await this.chatRep.createChat(nome, companyId, tipo);
            const msgs:{userId:number, content:string }[] = [];
            if(!chat.message)return;
            chat.message.map((msg)=>{
                const obj = {userId:msg.userId, content:msg.content, data:msg.createdAt};
                msgs.push(obj);
            })
            return msgs
        }catch(e)
        {
            console.log(e)
        }

    }

    async createMessage(userId:number, content:string, chatName:string)
    {
        try{
            const chat = await this.chatRep.getChat(chatName);
            if(!chat) throw new Error('Não existe nenhum chat com esse nome');
    
            const message = await this.chatRep.addMessage(userId, chat.id, content);
            return message;
        }catch(e)
        {
            console.log(e);
        }
    }
}

export class TaskService{
    constructor(private readonly taskrepo:TaskRepository = new TaskRepository(), private readonly chatrepo:ChatRepositorie = new ChatRepositorie()){}

    async createTask(companyId:number, autorId:number, atarefadoId:number, status:string, dateLimit:Date, tarefa:string)
    {

        const sortedIds = [autorId, atarefadoId].sort((a, b) => a - b);
        const privateRoomId = `dm_${sortedIds[0]}_${sortedIds[1]}`;
        const chat = await this.chatrepo.getChat(privateRoomId);
        if(!chat) throw new Error('esse chat não existe');
        const chatId = chat.id;

        const task = this.taskrepo.createTask(companyId, autorId, atarefadoId, chatId, status, dateLimit, tarefa);
        return task;
    }
}  