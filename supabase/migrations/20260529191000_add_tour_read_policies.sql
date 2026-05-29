CREATE POLICY "Enable read access for all users" ON "public"."tour" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."tour_stages" FOR SELECT USING (true);
