// repositories -> camada que acessa os dados


import { prisma } from '../src/database'
import type { CreateUserDTO, UpdateData } from './interfaces/interfacesUser';
import type { CreateCompanyDTO, UpdateCompanyDTO} from './interfaces/interfacesCompany';


export class UserRepository{

    
    //sign up page

    async create(data:CreateUserDTO){

        const user = await prisma.user.create({
        data:{
            nome:data.nome,
            cpf:data.cpf,
            email:data.email,
            idade:data.idade,
            Pass:data.pass,
            }
        });
        return user;
    }

    async isUnique(fields:'cpf'|'email', value:string)
    {
        return await prisma.user.findFirst({
            where:{
                [fields]:value
            }
        })
    }

// ________________________________________________________________________________________


// login
    async login(email:string)
    {
        return await prisma.user.findUnique({
            where:{
                email:email
            }
        });
    }
// ___________________________________________________________________________________________


// get all users for superuser
    async getAll()
    {
        const users = await prisma.user.findMany();
        return users;
    }

// ___________________________________________________________________________________________


// acho que vou alterar isso
    async vincularCompany(companyId:number, id:number) {
        const user = await prisma.user.update({
            data:{
                companyId:companyId,
                status:'PENDENTE'
            },where:{
                id:id
            }
        })

        return user;
    }
// ___________________________________________________________________________________________
// caso o usuário seja negado remove o id da empresa
    async desvincularCompany( id:number) {
        const user = await prisma.user.update({
            data:{
                companyId:null
            },where:{
                id:id
            }
        })

        return user;
    }
// ___________________________________________________________________________________________


// atualizar o role para quando o usuário registrar a empresa
    async updateCompIdRole(userId:number,companyId:number){
        const updated = await prisma.user.update({
            where:{
                id:userId
            },data:{
                role:'CEO',
                companyId:companyId
            }
        });
        return updated;
    }
    
// ___________________________________________________________________________________________


// transformar o usuário em admin ou user usando uma conta ceo
    async updateRole(id:number,role:'ADMIN'|'USER')
    {
        const updated = await prisma.user.update({
            where:{
                id:id
            },data:{
                role:role
            }
        });
        return updated;
    }

// ___________________________________________________________________________________________


// nao sei para o que é isso
    async getUser(id:number)
    {
        const user =  await prisma.user.findUnique({
            where:{
                id:id
            }
        })
        return user;
    }
// ___________________________________________________________________________________________

// aceitar ou negar um usuário que quer ser colaborador
    async changeStatus(status:'PENDENTE'|'APROVADO'|'NEGADO', id:number){
        const updated = await prisma.user.update({
            where:{
                id:id
            },data:{
                status:status
            }
        });
        return updated;
    }

// ___________________________________________________________________________________________

// pegar usuários que são aprovados na empresa 
async activeUsersInCompany(companyId:number)
{
    const users = await prisma.user.findMany({
            where:{
                status:'APROVADO',
                companyId:companyId,
            }
        });
        return users;
    }

// ___________________________________________________________________________________________

// usuários que estão para serem aprovados ou negados na empresa
    async offUsersInCompany(companyId:number)
    {
        const users = await prisma.user.findMany({
            where:{
                companyId:companyId,
                status:'PENDENTE'
            }
        });
        return users;
    }
// ___________________________________________________________________________________________

// pegar usuários que são vinculados a empresa independente se são aprovados ou negados nao. sei dessa nao em acho que vou apagar
    async getCompanyUsers(companyId:number)
    {
        const users = await prisma.user.findMany({
            where:{
                companyId:companyId
            }
        });
        return users;
    }



}


export class CompanyRepository{
// usado para ver se a empresa existe na hora de um usuário se registrar a uma empresa ou na hora de um ceo registrar a empresa
    async existsCompany(cnpj:string)
    {
        return await prisma.company.findFirst({
            where:{
                cnpj:cnpj
            }
        })
    }
// ___________________________________________________________________________________________
// pegar o id da empresa
    async getCompany(cnpj:string)
    {
        const company = await prisma.company.findUniqueOrThrow({
            where:{
                cnpj:cnpj
            },
        })
        return company.id
    }
// ___________________________________________________________________________________________

    
// acho que essa funçao ja existe. provavelmente mudaaaaaa!!!!!!!!!!! 
    async isUnique(fields:'cnpj'|'email'|'telefone', value:string)
    {
        return await prisma.company.findFirst({
            where:{
                [fields]:value
            }
        })
    }
// ___________________________________________________________________________________________

    async isUniqueNot(fields:'cnpj'|'email'|'telefone', value:string,id:number)
    {
        return await prisma.company.findFirst({
            where:{
                [fields]:value,
                NOT:{
                    id:id
                }
            }
        })
    }

    //cria company
    async create(data:CreateCompanyDTO)
    {
        const company = await prisma.company.create({
            data:{
                cnpj:data.cnpj,
                nome:data.nome,
                email:data.email,
                endereco:data.endereco,
                telefone:data.telefone,
                ownerId:data.ownerId!
            }
        })
        return company;
    }
// ___________________________________________________________________________________________
// deletar empresa
    async deleteComp(id:number){
        const company = await prisma.company.delete({
            where:{
                id:id
            }
        }
        )
    }
// ___________________________________________________________________________________________

// pegar todas as empresas para o superUser
    async getAll()
    {
        const companys = await prisma.company.findMany();
        return companys;
    }
    // ___________________________________________________________________________________________

    async getCompanyById(id:number)
    {
        const company = await prisma.company.findUnique({
            where:{
                id:id
            }
        });
        return company;
    }
    async updateCompany(data:Partial<Omit<UpdateCompanyDTO,'ownerId'>>)
    {
        const company = await prisma.company.update({
            where:{
                id:data.id
            },data:{
                cnpj:data.cnpj,
                nome:data.nome,
                email:data.email,
                endereco:data.endereco,
                telefone:data.telefone
            }
        });
        return company;
    }
}



export class ChatRepositorie{
    async createChat( Nome:string, CompanyId:number, Tipo:'DIRECT'|'GROUP'){
        const chat = await prisma.chat.upsert({
            where:{nome:Nome},
            update:{},
            create:{
                nome:Nome,
                companyId:CompanyId,
                tipo:Tipo
            },
            include:{
                message:{
                    orderBy:{createdAt:'asc'},
                    take:50
                }
            }
        });
        return chat;
    }

    async addMessage(userId:number, chatId:number, content:string)
    {
        const message  = await prisma.message.create({
            data:{
                userId:userId,
                chatId:chatId,
                content:content
            }
        });
        return message;
    }

    async getChat(nome:string)
    {
        const chat = await prisma.chat.findUnique({
            where:{
                nome:nome
            }
        });
        return chat;
    }

}

export class TaskRepository
{
    async createTask(companyId:number, autorId:number, atarefadoId:number, chatId:number, status:string, dateLimit:Date, tarefa:string){
        const task = await prisma.tasks.create({
            data:{
                companyId:companyId,
                autorId:autorId,
                atarefadoId:atarefadoId,
                chatId:chatId, 
                status:status,
                dateLimit:dateLimit,
                task:tarefa
            }
        });
        return task;
    }
}

// model Tasks{
//   id Int @id @default(autoincrement())
  
//   company Company @relation(fields: [companyId],references: [id])
//   companyId Int

//   autor User @relation("tarefaPassada",fields: [autorId],references: [id])
//   autorId Int

//   atarefado User? @relation("tarefaRecebida", fields: [atarefadoId],references: [id])
//   atarefadoId Int?

//   chat Chat @relation(fields: [chatId],references: [id])
//   chatId Int

//   task String
//   status String
//   createdAt DateTime @default(now())
//   dateLimit DateTime?
// }