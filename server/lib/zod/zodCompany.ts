import {email, z} from 'zod';
z.config(z.locales.pt());

export const createCompanyScheme = z.object({
    cnpj:z.string().length(14,"O CNPj deve ter 14 dígitos"),
    nome:z.string().min(1, "O nome deve ter pelo menos um dígito").max(150),
    email:z.email(),
    endereco:z.string(),
    telefone:z.string(),
    ownerId:z.number().optional()
}) 

export const updateCompanyScheme = createCompanyScheme
                            .omit({ownerId:true})
                            .partial()
                            .extend({
                                id:z.number()
                            });

export const vincularCompany = z.object({
    cnpj:z.string().length(14, "O CNPJ deve ter 14 dígitos").optional(),
})
