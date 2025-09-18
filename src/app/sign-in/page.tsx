"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
	const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			{hasClerk ? (
			<SignIn
				routing="path"
				path="/sign-in"
				signUpUrl="/sign-up"
				appearance={{
					variables: {
						colorBackground: "var(--bg)",
						colorPrimary: "var(--primary)",
						colorText: "var(--text)",
						colorTextSecondary: "var(--text-muted)",
						colorInputBackground: "var(--bg-elev-1)",
						colorInputText: "var(--text)",
						colorShimmer: "var(--primary)",
						borderRadius: "8px",
					},
					elements: {
						card: "card p-6",
						formFieldInput: "input",
						formButtonPrimary: "btn btn-primary",
						footerAction__signIn: "muted",
						headerTitle: "text-lg font-semibold",
						headerSubtitle: "muted",
						socialButtonsBlockButton: "btn",
					},
				}}
			/>) : (
				<div className="card p-6 text-center">
					<div className="text-lg font-semibold mb-2">Sign-in disabled</div>
					<div className="muted">Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable authentication.</div>
				</div>
			)}
		</div>
	);
}

