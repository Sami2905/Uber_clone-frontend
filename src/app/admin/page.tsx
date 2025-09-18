import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
const user = await currentUser();
const role = (user?.publicMetadata as any)?.role;
if (role !== "admin") redirect("/");
return <AdminClient />;
}
