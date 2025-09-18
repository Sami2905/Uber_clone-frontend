import { forwardRef, SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string };

export const Select = forwardRef<HTMLSelectElement, Props>(function Select({ label, hint, className = "", children, ...props }, ref) {
    return (
        <label className="grid gap-1">
            {label && <span className="text-sm">{label}</span>}
            <div className="select">
                <select ref={ref} className={`bg-transparent outline-none ${className}`} {...props}>
                    {children}
                </select>
            </div>
            {hint && <span className="muted text-xs">{hint}</span>}
        </label>
    );
});


