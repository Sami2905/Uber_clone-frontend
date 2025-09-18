import { forwardRef, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string };

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea({ label, hint, className = "", ...props }, ref) {
    return (
        <label className="grid gap-1">
            {label && <span className="text-sm">{label}</span>}
            <textarea ref={ref} className={`textarea ${className}`} {...props} />
            {hint && <span className="muted text-xs">{hint}</span>}
        </label>
    );
});


