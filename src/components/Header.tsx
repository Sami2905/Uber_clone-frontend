"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/support", label: "Support" },
];

export function Header() {
  const pathname = usePathname();
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <nav className="px-6 py-3 border-b flex items-center justify-between text-sm">
      <div className="flex items-center gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link key={href} href={href} className={`px-3 py-1 rounded transition-colors ${active ? "" : "opacity-80 hover:opacity-100"}`}>
              <span className="relative inline-flex items-center">
                {label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-[2px] w-full"
                    style={{ background: "var(--primary)" }}
                  />
                )}
              </span>
            </Link>
          );
        })}
        {hasClerk && (
          <SignedIn>
            <Link href="/admin" className={`px-3 py-1 rounded transition-colors ${pathname?.startsWith("/admin") ? "" : "opacity-80 hover:opacity-100"}`}>Admin</Link>
          </SignedIn>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {hasClerk ? (
          <>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn">Sign in</button>
              </SignInButton>
            </SignedOut>
          </>
        ) : null}
      </div>
    </nav>
  );
}


