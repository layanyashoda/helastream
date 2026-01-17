import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { User } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserActions } from "./_components/user-actions";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    let users: User[] = [];
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status || "active",
                createdAt: data.createdAt
            };
        });
    } catch (e) {
        console.error("Failed to fetch users", e);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Users Management</h1>
            <div className="bg-[#141519] rounded-lg shadow border border-[#23252b]">
                <Table>
                    <TableHeader>
                        <TableRow className="border-[#23252b] hover:bg-[#23252b]">
                            <TableHead className="text-muted-foreground w-[200px]">Name</TableHead>
                            <TableHead className="text-muted-foreground">Email</TableHead>
                            <TableHead className="text-muted-foreground">Role</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-[#23252b] hover:bg-[#23252b]">
                                <TableCell className="font-medium text-foreground">
                                    {user.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.email}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.role}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "active" ? "default" : "destructive"} className={user.status === "active" ? "bg-green-500/20 text-green-500 border-0" : "bg-red-500/20 text-red-500 border-0"}>
                                        {user.status || "active"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <UserActions userId={user.id} currentStatus={user.status || "active"} currentRole={user.role} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
