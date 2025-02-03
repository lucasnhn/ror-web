import { authGuard } from "@/app/auth-guard";
import { rorApiClient } from "@/services/ror-api";

export default async function DashboardPage() {
  const session = await authGuard();
  const self = await rorApiClient(session.accessToken).users.self();
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(self, null, 2)}</pre>
    </div>
  );
}
