import type { Response } from 'express';
import {z} from 'zod';

export const createUserScheme = z.object({
    nome:z.string().min(3,{message:"O nome deve ter pelo menos 3 dígitos"}).max(100,{message:"O nome deve ter no máximo 100 dígitos"}),
    User:z.string().min(3, {message:"O nome deve ter pelo menos 3 dígitos"}).max(50,{message:"O user deve ter no máximo 50 dígitos"}),
    email:z.email('Formato de email inválido.').max(100,{message:"O email deve ter no máximo 100 dígitos"}),
    pass:z.string().min(8,{message:"A senha deve ter no minimo 8 dígitos"}).max(100,{message:"A senha deve ter no máximo 100 dígitos"}).regex(/[0-9]/, "Precisa de pelo menos um número").regex(/[!@#$%^&*]/, "Precisa de um caractere especial"),
});

export const createCompanyScheme = z.object({
    cnpj:z.string().length(14,"O CNPj deve ter 14 dígitos"),
    nome:z.string().min(1, "O nome deve ter pelo menos um dígito").max(150),
    ownerId:z.number().optional()
}) 

export const loginScheme = z.object({
    email:z.email(),
    pass:z.string()
})

export const completeSignUp = z.object({
    cnpj:z.string().length(14, "O CNPJ deve ter 14 dígitos").optional(),
    cpf:z.string().length(11, "O CPF deve ter 11 dígitos"),
    idade:z.number()
})

export const completeSignUpAdmin = z.object({
    cpf:z.string().length(11, "O CPF deve ter 11 dígitos"),
    idade:z.number()
})




export const tratamentoErroZod=(e:any,res:Response)=>{
        const formattedErrors = e.issues.map((issue:any) => ({
            campo: issue.path.join(),//.join('.'), // Pega o nome do campo (ex: 'pass')
            mensagem: issue.message      // Pega a mensagem amigável do Zod
        }));

        return res.status(400).json({
            message: "Erro de validação",
            details: formattedErrors // Retorna a lista tratada
        });
}