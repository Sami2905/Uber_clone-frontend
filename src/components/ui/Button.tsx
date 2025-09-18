import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "default" | "primary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button({ variant = "default", className = "", ...props }, ref) {
    const base = "btn inline-flex items-center justify-center";
    const styles = variant === "primary" ? "btn-primary" : variant === "ghost" ? "btn-ghost" : "btn";
    return <button ref={ref} className={`${base} ${styles} ${className}`} {...props} />;
});


