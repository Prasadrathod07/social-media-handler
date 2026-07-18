"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { listUsers, setUserRole } from "@/lib/adminApi";
import { PlatformUser } from "@/types";

const PAGE_SIZE = 20;

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function load(p: number) {
    queueMicrotask(() => setLoading(true));
    try {
      const data = await listUsers(p, PAGE_SIZE);
      setUsers(data.users);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, []);

  async function toggleRole(user: PlatformUser) {
    const nextRole = user.role === "admin" ? "user" : "admin";
    const updated = await setUserRole(user._id, nextRole);
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      <p className="mt-1 text-sm text-muted">{total} total accounts.</p>

      <div className="mt-6">
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {users.map((u) => (
              <Tr key={u._id} onClick={() => router.push(`/users/${u._id}`)} className="cursor-pointer">
                <Td className="font-medium">{u.name}</Td>
                <Td className="text-muted">{u.email}</Td>
                <Td className="capitalize">{u.subscription.cadence ?? "—"}</Td>
                <Td>
                  <Badge
                    label={u.subscription.status}
                    tone={u.subscription.status === "active" ? "success" : "neutral"}
                  />
                </Td>
                <Td>
                  <Badge label={u.role} tone={u.role === "admin" ? "brand" : "neutral"} />
                </Td>
                <Td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRole(u);
                    }}
                  >
                    {u.role === "admin" ? "Revoke admin" : "Make admin"}
                  </Button>
                </Td>
              </Tr>
            ))}
            {!loading && users.length === 0 ? (
              <Tr>
                <Td colSpan={7} className="text-center text-muted">
                  No users found.
                </Td>
              </Tr>
            ) : null}
          </Tbody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => load(page - 1)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => load(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
