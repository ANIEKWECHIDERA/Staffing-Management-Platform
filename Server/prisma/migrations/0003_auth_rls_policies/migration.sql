GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  "User",
  "Worker",
  "WorkerRole",
  "WorkerDocument",
  "WorkerReference",
  "Guarantor",
  "Employer",
  "JobRequest",
  "Match",
  "Placement",
  "AuditLog"
TO authenticated;

REVOKE ALL ON TABLE
  "User",
  "Worker",
  "WorkerRole",
  "WorkerDocument",
  "WorkerReference",
  "Guarantor",
  "Employer",
  "JobRequest",
  "Match",
  "Placement",
  "AuditLog"
FROM anon;

CREATE OR REPLACE FUNCTION public.skillbridge_internal_access()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'app_role', '') IN ('owner', 'staff')
    AND COALESCE((auth.jwt() -> 'app_metadata' ->> 'deactivated')::boolean, false) = false;
$$;

DROP POLICY IF EXISTS "User internal read" ON "User";
CREATE POLICY "User internal read"
ON "User"
FOR SELECT
TO authenticated
USING (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "User owner write" ON "User";
CREATE POLICY "User owner write"
ON "User"
FOR ALL
TO authenticated
USING (
  COALESCE(auth.jwt() -> 'app_metadata' ->> 'app_role', '') = 'owner'
  AND COALESCE((auth.jwt() -> 'app_metadata' ->> 'deactivated')::boolean, false) = false
)
WITH CHECK (
  COALESCE(auth.jwt() -> 'app_metadata' ->> 'app_role', '') = 'owner'
  AND COALESCE((auth.jwt() -> 'app_metadata' ->> 'deactivated')::boolean, false) = false
);

DROP POLICY IF EXISTS "Worker internal access" ON "Worker";
CREATE POLICY "Worker internal access"
ON "Worker"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "WorkerRole internal access" ON "WorkerRole";
CREATE POLICY "WorkerRole internal access"
ON "WorkerRole"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "WorkerDocument internal access" ON "WorkerDocument";
CREATE POLICY "WorkerDocument internal access"
ON "WorkerDocument"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "WorkerReference internal access" ON "WorkerReference";
CREATE POLICY "WorkerReference internal access"
ON "WorkerReference"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "Guarantor internal access" ON "Guarantor";
CREATE POLICY "Guarantor internal access"
ON "Guarantor"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "Employer internal access" ON "Employer";
CREATE POLICY "Employer internal access"
ON "Employer"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "JobRequest internal access" ON "JobRequest";
CREATE POLICY "JobRequest internal access"
ON "JobRequest"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "Match internal access" ON "Match";
CREATE POLICY "Match internal access"
ON "Match"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "Placement internal access" ON "Placement";
CREATE POLICY "Placement internal access"
ON "Placement"
FOR ALL
TO authenticated
USING (public.skillbridge_internal_access())
WITH CHECK (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "AuditLog internal read" ON "AuditLog";
CREATE POLICY "AuditLog internal read"
ON "AuditLog"
FOR SELECT
TO authenticated
USING (public.skillbridge_internal_access());

DROP POLICY IF EXISTS "AuditLog owner write" ON "AuditLog";
CREATE POLICY "AuditLog owner write"
ON "AuditLog"
FOR INSERT
TO authenticated
WITH CHECK (
  COALESCE(auth.jwt() -> 'app_metadata' ->> 'app_role', '') = 'owner'
  AND COALESCE((auth.jwt() -> 'app_metadata' ->> 'deactivated')::boolean, false) = false
);
