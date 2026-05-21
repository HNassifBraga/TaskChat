// repositories -> camada que acessa os dados


import { prisma } from '../src/database'


interface CreateUserDTO {
    
    User:string,
    name:string,
    email:string,
    hashedPassword:string,
}

interface UpdateData {
    id:number,
    companyId?:number,
    cpf:string,
    idade?:number
}

export interface CreateCompanyDTO{
    cnpj:string,
    nome:string,
    ownerId?:number
}

export class UserRepository{

    async login(email:string)
    {
        return await prisma.user.findUnique({
            where:{
                email:email
            }
        });
    }



    //funçao usada para verificar se o cpf/user/email ja esta cadastrado no db
    async isUnique(fields:'user'|'cpf'|'email', value:string)
    {
        return await prisma.user.findFirst({
            where:{
                [fields]:value
            }
        })
    }
    
    //criar usuário
    async create(data:CreateUserDTO){
        const user = await prisma.user.create({
            data:{
                // idade:data.idade,
                // cpf:data.cpf,
                // companyId:data.companyId,
                user:data.User,
                nome:data.name,
                email:data.email,
                Pass:data.hashedPassword,
            }
        })
        return user;
    }

    //pegar todos os usuários
    async getAll()
    {
        const users = await prisma.user.findMany();
        return users;
    }

    async completeData(data: UpdateData) {
        const dataToUpdate: any = {
            cpf: data.cpf,
            idade: data.idade,
        };

        if (data.companyId) {
            dataToUpdate.companyId = data.companyId;
        }

        const user = await prisma.user.update({
            where: { id: data.id },
            data: dataToUpdate
        });

        return user;
    }

    async updateCompIdRole(userId:number,companyId:number){
        const updated = await prisma.user.update({
            where:{
                id:userId
            },data:{
                role:'CEO',
                companyId:companyId
            }
        })
    }
    

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
    async getUser(id:number)
    {
        const user =  await prisma.user.findUnique({
            where:{
                id:id
            }
        })
        return user;
    }


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
    /////////////////////////////////////////////////////////////////
    // usado para registrar usuários
    async existsCompany(cnpj:string)
    {
        return await prisma.company.findFirst({
            where:{
                cnpj:cnpj
            }
        })
    }
    async getCompany(cnpj:string)
    {
        const company = await prisma.company.findUniqueOrThrow({
            where:{
                cnpj:cnpj
            },
        })
        return company.id
    }
    /////////////////////////////////////////////////////////////////
    

    //verifica se ja existe o cnpj que sera cadastrao no db
    async isUnique(fields:'cnpj', value:string)
    {
        return await prisma.company.findFirst({
            where:{
                [fields]:value
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
                ownerId:data.ownerId!
            }
        })
        return company;
    }
    async deleteComp(){
        const company = await prisma.company.delete({
            where:{
                id:1
            }
        }
        )
    }

    async getAll()
    {
        const companys = await prisma.company.findMany();
        return companys;
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


}

// model Chat{
//   id Int @id @default(autoincrement())
//   nome String
//   createdAt DateTime @default(now())

//   company Company @relation(fields: [companyId],references: [id])//uma empresa pode ter varios chats
//   companyId Int 

//   chatparticipant ChatParticipant[]//um chat pode conter varios participantes
//   message Message[]//um chat tem varias mensages
//   tipo Tipo
//   tasks Tasks[]
// }

// model Message{
//   id Int @id @default(autoincrement())
//   content String
//   createdAt DateTime @default(now())  
  
//   user User @relation(fields: [userId],references: [id])//um usuario pode ter varias mensages
//   userId Int

//   chat Chat @relation(fields: [chatId],references: [id])//um chat pode ter varias mensagens
//   chatId Int
// }


// model ChatParticipant{
//   id Int @id @default(autoincrement())
//   joinedAt DateTime @default(now())

//   chat Chat @relation(fields: [chatId],references: [id])//um chat pode ter varios participantes
//   chatId Int

//   user User @relation(fields: [userId],references: [id])//um participante pode ter varios chats
//   userId Int

//   @@unique([chatId,userId])
// }