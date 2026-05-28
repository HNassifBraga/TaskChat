import { useState } from 'react';
import axios from 'axios';
import type {ErrorDetail} from '../interfaces/interfaceError'


export function useErrorHandler() {
    const [error, setError] = useState<string>('');
    const [errorDetails, setErrorDetails] = useState<ErrorDetail[]>([]);

    const handleApiError = (e: unknown) => {
        if (axios.isAxiosError(e)) {
            const data = e.response?.data;
            console.log(data)
            console.log(e.response)
            
            setError(data?.mensagem || 'Erro inesperado');
            setErrorDetails(data.details || []);
            
        }
    };

    const clearErrors = () => {
        setError('');
        setErrorDetails([]);
    };

    return { error, errorDetails, handleApiError, clearErrors };
}