export function TextField({ label, error, hint, id, type = 'text', className = '', ...rest }) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <input id={fieldId} type={type} className={`input ${error ? 'invalid' : ''}`} aria-invalid={!!error} {...rest} />
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

export function SelectField({ label, error, hint, id, options = [], className = '', ...rest }) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <select id={fieldId} className={`select ${error ? 'invalid' : ''}`} aria-invalid={!!error} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

export function TextAreaField({ label, error, hint, id, className = '', ...rest }) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <textarea id={fieldId} className={`textarea ${error ? 'invalid' : ''}`} aria-invalid={!!error} {...rest} />
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}
