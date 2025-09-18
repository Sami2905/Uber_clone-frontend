"use client";
import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };
    static getDerivedStateFromError(error: any): State { return { hasError: true, error }; }
    componentDidCatch(error: any, info: any) { console.error(error, info); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="card p-6">
                    <div className="font-semibold mb-1">Something went wrong</div>
                    <div className="muted text-sm">Please try again or refresh the page.</div>
                </div>
            );
        }
        return this.props.children;
    }
}


