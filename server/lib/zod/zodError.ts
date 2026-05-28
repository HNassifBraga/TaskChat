import type { Response } from 'express';
import {z} from 'zod';
z.config(z.locales.pt());






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