// Controllers -> Resolve o gerenciamento de requisições
// válida os dados de entrada, chama o service responsável pela lógica
// formata e envia a resposta http apropriada
// ). Se o campo nome não for enviado, o Controller nem deixa a requisição passar para o Service; ele já retorna um erro 400 Bad Request imediatamente.
import {  type Request, type Response } from 'express';
import {UserService, CompanyService,  TaskService} from './services';
import {z} from 'zod'
import dotenv from "dotenv";
import { createUserScheme, createCompanyScheme, loginScheme, completeSignUp,tratamentoErroZod, completeSignUpAdmin} from '../services/zod';
import { stat } from 'fs';

dotenv.config()


export class UserController{
    
    constructor(private readonly userService: UserService = new UserService()) {}
    
    //realizar o cadastro do usuário/ tem input
    async handleCadastro(req:Request, res:Response){
        try{
            const data = createUserScheme.parse(req.body);
            const result = await this.userService.create(data);
            
            // creates and sends cookies
            const cookies = await this.userService.createCookies(result.id);
            res.cookie(cookies.name,cookies.value,cookies.options)
            
            // return results msg
            const obj = {id:result.id};
            return res.status(201).json(obj)
        }catch(error:any)
        {
            if (error instanceof z.ZodError) {
                tratamentoErroZod(error,res);
            }
            console.log(error.Error);
            return res.status(400).json({
                mensagem:error.message
            })
        }
    }
    
    async completeSign(req:Request,res:Response){
        const token = req.cookies.token;
        const decode = this.userService.decodeToken(token);
        const id = decode.id;
        try{
            if(decode.companyId)
            {
                const data = completeSignUpAdmin.parse(req.body);
                const obj = {id:id, cpf:data.cpf, idade:data.idade};
                await this.userService.completeRegistration(obj)
            }else{
                const data = completeSignUp.parse(req.body);
                const obj = {id:id, cnpj:data.cnpj, cpf:data.cpf, idade:data.idade};
                await this.userService.completeRegistration(obj);
            }
            const deleteCookies = this.userService.resetCookies();
            res.clearCookie(deleteCookies.name, deleteCookies.options);
    
            const createCookies = await this.userService.createCookies(id);
            res.cookie(createCookies.name,createCookies.value,createCookies.options);
            res.status(200).json({message:'sign up completo'})
        }catch(e:any)
        {
            console.log(e);
            if(e instanceof z.ZodError)
            {
                tratamentoErroZod(e,res);
            }
            res.status(400).json({mensagem:e.message});
        }
        
    }


    async updateRole(req:Request,res:Response)
    {
        const {role,id } = req.body;
        try{
            const response = await this.userService.updateRole(role, id);
            return res.status(200).json('updated role');
        }catch(e)
        {
            console.log(e);
            return res.status(400).json(e);
        }
    }

    async handleLogIn(req:Request,res:Response)
    {
        try{
            const data = loginScheme.parse(req.body);
            const result = await this.userService.login(data.email,data.pass);
            if(result.test === true)
            {
                const cookies = await this.userService.createCookies(result.obj!.id);
                res.cookie(cookies.name,cookies.value,cookies.options);
                return res.status(200).json(result.obj?.id);
            }else{
                return res.status(400).json({message:'wrong pass'})
            }
        }catch(e:any)
        {
            if (e instanceof z.ZodError) {
                tratamentoErroZod(e,res);
            }
            console.log(e);
            return res.status(400).json({message:e.message})
        }
    }



    //LOGOUT
    async handleLogOut(req:Request,res:Response){

        const cookies = this.userService.resetCookies();
        res.clearCookie(cookies.name,cookies.options);
        return res.status(200).json({message:'log out ok'})
    }


    async handleGetAll(req:Request, res:Response)
    {
        try{
            const result = await this.userService.getAll();
            return res.status(200).json(result);
        }catch(e:any)
        {
            return res.status(400).json(e)
        }
    }


    async validateToken(req: Request, res: Response) {
        const token = req.cookies.token;
        try {
            const decode = this.userService.decodeToken(token);
            console.log(decode)
            return res.status(200).json({ 
                loggedIn: true, 
                user: decode
            });

        } catch (e) {
            return res.status(401).json({ loggedIn: false, message: "Token inválido" });
        }
    }

    async validateSuperUser(req:Request,res:Response){
        const token = req.cookies.token;
        if(!token) return res.status(401).json({logedIn:false,message:'não autorizado'});

        try{
            const decode = this.userService.decodeToken(token);
            if(decode.role !== 'SUPERUSER')
            {
                return res.status(401).json({logedIn:false,message:'não autorizado'});
            }else{
                return res.status(200).json({
                    superUser:true,
                    message:'autorizado'
                })
            }
        }catch(e)
        {
            console.log(e)
        }
    }

    returnCookies(req:Request,res:Response){
        const token = req.cookies.token;
        try {
            const decode = this.userService.decodeToken(token);
            return res.status(200).json(decode);
        } catch (e) {
            return res.status(401).json({ message: "Token inválido" });
        }
    }

    async getUserDataToLocalStorage(req:Request,res:Response, ){

        const token = req?.cookies.token;
        try{
            const decode = this.userService.decodeToken(token);
            const response = await this.userService.getUserToLocalStorage(decode.id);
            if(!response)throw new Error('nao teve resposta');
            const objLocalStorage = {nome:response.nome, idade:response.idade }
            return res.status(200).json({objLocalStorage})
        }catch(e)
        {
            console.log(e);
            return res.status(400).json({error:e});
        }
    }


    async activeUsersInCompany(req:Request,res:Response)
    {
        const token = req?.cookies.token;
        try{
            const decode = this.userService.decodeToken(token);
            const companyUsers = await this.userService.activeUsersInCompany(decode.companyId);
            return res.status(200).json(companyUsers);
        }catch(e){
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async offUsersInCompany(req:Request,res:Response)
    {
        const token = req?.cookies.token;
        try{
            const decode = this.userService.decodeToken(token);
            const companyUsers = await this.userService.offUsersInCompany(decode.companyId);
            return res.status(200).json(companyUsers);
        }catch(e){
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async changeStatus(req:Request,res:Response){
        try{
            const {status, id } = req.body;
            const updated = await this.userService.changeStatus(status,id);
            console.log(updated);
            return res.status(200).json('updated')
        }catch(e)
        {
            console.log(e);
            return res.status(400).json(e)
        }
    }


    async getCompanyUsers(req:Request,res:Response)
    {
        try{
            const cookies = req.cookies;
            const token = cookies.token;
            const decode = this.userService.decodeToken(token);
            const companyId = decode.companyId;
            const users =await this.userService.getCompanyUsers(companyId);
            return res.status(200).json(users);

        }catch(e){
            console.log(e);
            return res.status(400).json(e)
        }
    }
}

export class CompanyControler{
    constructor(private readonly userService: UserService = new UserService(), private readonly companyService:CompanyService = new CompanyService()) {}


    //realizar o cadastro da empresa
    // tem input
    async handleCadastro(req:Request,res:Response){
        try{
            const token = req.cookies.token;
            const decode = this.userService.decodeToken(token);

            const deleteCookies = this.userService.resetCookies();
            let data = createCompanyScheme.parse(req.body);
            data.ownerId = decode.id!
            
            const result =  await this.companyService.create(data);
            res.clearCookie(deleteCookies.name,deleteCookies.options);

            const createCookies = await this.userService.createCookies(decode.id);
            res.cookie(createCookies.name,createCookies.value,createCookies.options);

            return res.status(201).json(result);
        }catch(e:any)
        {
            if(e instanceof z.ZodError)
            {
                console.log(e)
                tratamentoErroZod(e,res);
            }else{
                console.log(e)
                return res.status(400).json({mensagem:e.message})
            }
        }
    }


    async getAllCompany(req:Request, res:Response)
    {
        try{
            const result = await this.companyService.getAll()
            return res.status(200).json(result)
        }catch(e:any){
            return res.status(400).json(e)
        }
    }
}


export class ChatController{
    // constructor(private readonly chatservice:chatService = new chatService(), private readonly userservice:UserService = new UserService()){}
    // async createChat(req:Request, res:Response)
    // {
    //     const token = req.cookies.token;
    //     const decoded = this.userservice.decodeToken(token);
    //     const companyId = decoded.companyId;
    //     const {nome, tipo} = req.body;
    //     try{
    //         const chat = await this.chatservice.createChat(nome,companyId, tipo)
    //         return res.status(200).json(chat);
    //     }catch(e)
    //     {
    //         return res.status(400).json(e)
    //     }
    // }
}

export class TaskController{
    constructor(private readonly taskservice:TaskService = new TaskService(), private readonly userservice:UserService = new UserService()){}

    async createTask(req:Request, res:Response){
        try{
            const token = req.cookies.token;
            const decoded = this.userservice.decodeToken(token);
            const {atarefadoId, status, dateLimit, tarefa, } = req.body;
            const task = this.taskservice.createTask(decoded.companyId, decoded.userId, atarefadoId, status, dateLimit, tarefa);
            return res.status(200).json(task)
        }catch(e)
        {
            console.log(e);
            return res.status(400).json(e)
        }
    }
}