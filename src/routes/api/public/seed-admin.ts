import { createFileRoute } from "@tanstack/react-router";

const ADMIN_EMAIL = "admin@lendflowafrica.com";
const ADMIN_PASSWORD = "Admin@2026!";

/**
 * One-shot bootstrap for the back-office account.
 * Does nothing once an admin already exists, so it is safe to leave deployed.
 */
export const Route = createFileRoute("/api/public/seed-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: existing, error: roleErr } = await supabaseAdmin
          .from("user_roles").select("id").eq("role", "admin").limit(1);
        if (roleErr) return Response.json({ error: roleErr.message }, { status: 500 });
        if (existing && existing.length > 0) {
          return Response.json({ seeded: false, message: "Admin already exists" });
        }

        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { first_name: "LendFlow", last_name: "Manager" },
        });

        let userId = created?.user?.id;
        if (createErr || !userId) {
          const { data: list } = await supabaseAdmin.auth.admin.listUsers();
          userId = list?.users.find(u => u.email === ADMIN_EMAIL)?.id;
          if (!userId) return Response.json({ error: createErr?.message ?? "create failed" }, { status: 500 });
        }

        const { error: grantErr } = await supabaseAdmin
          .from("user_roles").insert({ user_id: userId, role: "admin" });
        if (grantErr) return Response.json({ error: grantErr.message }, { status: 500 });

        return Response.json({ seeded: true, email: ADMIN_EMAIL });
      },
    },
  },
});
