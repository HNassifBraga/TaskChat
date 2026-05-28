

export interface ErrorAlertProps {
    error: string;
    errorDetails: { campo: string; mensagem: string }[];
}    



// Definindo a interface para o TypeScript (baseado no seu Zod) errorHandler.ts
export interface ErrorDetail {
    campo: string;
    mensagem: string;
}