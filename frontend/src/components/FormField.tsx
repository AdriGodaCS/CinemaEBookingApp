import type { InputHTMLAttributes } from 'react'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string
    label: string
    error?: string
    hint?: string
}

// Labeled input used by the auth forms. `required` adds the asterisk and aria-required.
function FormField({ id, label, error, hint, required, ...inputProps }: FormFieldProps) {
    const describedBy =
        [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined

    return (
        <div className="form-field">
            <label htmlFor={id}>
                {label}
                {required && (
                    <span className="required-mark" aria-hidden="true">
                        {' '}*
                    </span>
                )}
            </label>
            <input
                id={id}
                required={required}
                aria-required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                {...inputProps}
            />
            {hint && !error && (
                <p className="field-hint" id={`${id}-hint`}>
                    {hint}
                </p>
            )}
            {error && (
                <p className="field-error" id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}

export default FormField