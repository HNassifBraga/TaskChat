import {z} from 'zod';
z.config(z.locales.pt());
export const createUserScheme = z.object({
    nome:z.string().min(3,{message:"O nome deve ter pelo menos 3 dígitos"}).max(100,{message:"O nome deve ter no máximo 100 dígitos"}),
    cpf:z.string().length(11, {message:'O CPF deve ter 11 digítos'}),
    email:z.email('Formato de email inválido.').max(100,{message:"O email deve ter no máximo 100 dígitos"}),
    idade:z.number(),
    pass:z.string().min(8,{message:"A senha deve ter no minimo 8 dígitos"}).max(100,{message:"A senha deve ter no máximo 100 dígitos"}).regex(/[0-9]/, "Precisa de pelo menos um número").regex(/[!@#$%^&*]/, "Precisa de um caractere especial"),
    cnpj:z.string().length(14,{message:'O CNPJ deve ter 14 digítos'}).optional()
});

export const loginScheme = z.object({
    email:z.email(),
    pass:z.string()
})
