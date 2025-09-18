import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string };

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, hint, className = "", ...props }, ref) {
    return (
        <label className="grid gap-1">
            {label && <span className="text-sm">{label}</span>}
            <input ref={ref} className={`input ${className}`} {...props} />
            {hint && <span className="muted text-xs">{hint}</span>}
        </label>
    );
});


