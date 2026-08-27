# Supabase deployment

1. Create a Supabase project and enable Email authentication.
2. Install the Supabase CLI, link the project, then run `supabase db push`. Alternatively paste `migrations/202608270001_one_question.sql` into its SQL Editor.
3. Create the first admin account through the site or Supabase Auth, then run the final bootstrap statement in the migration with that account's UUID.
4. Add the project URL plus **anon** key to the root `supabase-config.js`. Do not put the `service_role` key in browser code.

The database is intentionally privacy-first: client requests cannot read the profiles table or raw answer rows. Results and comments are exposed only through safe RPC functions after a user has answered. The identity lookup RPC requires an admin role and a reason; production should also write that request to an immutable audit-log table or Edge Function.
