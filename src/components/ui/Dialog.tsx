"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

export function Dialog({ children, open, onOpenChange }: { children: ReactNode; open?: boolean; onOpenChange?: (o: boolean) => void; }) {
    return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>{children}</DialogPrimitive.Root>;
}

export function DialogTrigger({ children }: { children: ReactNode }) {
    return <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>;
}

export function DialogContent({ children }: { children: ReactNode }) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
            <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 card p-4 w-[90vw] max-w-md">
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}

export function DialogHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-3">
            <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>
            {description && (
                <DialogPrimitive.Description className="muted text-sm">{description}</DialogPrimitive.Description>
            )}
        </div>
    );
}

export function DialogClose() {
    return (
        <DialogPrimitive.Close asChild>
            <button className="btn absolute right-3 top-3" aria-label="Close">
                <X size={16} />
            </button>
        </DialogPrimitive.Close>
    );
}


