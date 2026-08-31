import { useState } from 'react';

export default function Button({
  as: As = 'button', variant = 'primary', size = 'md', icon: Icon, iconOnly = false,
  loading = false, disabled = false, block = false, className = '', children, onClick, ...rest
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (loading || disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 550);
    onClick?.(e);
  };

  const classes = [
    'btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', block ? 'btn-block' : '',
    iconOnly ? 'btn-icon' : '', className,
  ].filter(Boolean).join(' ');

  return (
    <As className={classes} onClick={handleClick} disabled={disabled || loading} {...rest}>
      {loading ? <span className={`spinner ${variant === 'outline' || variant === 'ghost' ? 'spinner-dark' : ''}`} /> : Icon ? <Icon size={16} /> : null}
      {!iconOnly && children}
      {ripples.map((r) => (
        <span key={r.id} className="ripple" style={{ left: r.x, top: r.y, width: r.size, height: r.size }} />
      ))}
    </As>
  );
}
