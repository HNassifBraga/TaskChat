import type {ErrorAlertProps} from '../../interfaces/interfaceError'

export function ErrorAlert({ error, errorDetails }: ErrorAlertProps) {
    if (!error && errorDetails.length === 0) return null;

    return (
        <div className="alert alert-danger py-2 m-0 shadow-sm mt-3">
            {errorDetails.length > 0 ? (
                errorDetails.map((err, index) => (
                    <p key={index} className="mb-1" style={{ fontSize: '0.85rem' }}>
                        • <strong>{err.campo}:</strong> {err.mensagem}
                    </p>
                ))
            ) : (
                <p className="mb-0">{error}</p>
            )}
        </div>
    );
}