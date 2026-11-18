// Supabase Edge Function: slår brugerens EU-momsnummer op i EU's VIES-register.
// Udrul:  supabase functions deploy vies-check
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const VIES = "https://ec.europa.eu/taxation_customs/vies/rest-api/ms";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const jwt = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  const { data: { user } } = await admin.auth.getUser(jwt);
  if (!user) return new Response("Log ind", { status: 401, headers: cors });
  const { data: p } = await admin.from("profiles").select("org_country, org_id_type, org_number").eq("id", user.id).single();
  if (!p || p.org_id_type !== "vat") return new Response(JSON.stringify({ skipped: true }), { headers: cors });
  const { data: f } = await admin.from("id_formats").select("vies, vat_prefix").eq("country", p.org_country).eq("id_type", "vat").single();
  if (!f?.vies) return new Response(JSON.stringify({ skipped: true }), { headers: cors });
  try {
    const r = await fetch(`${VIES}/${f.vat_prefix}/vat/${encodeURIComponent(p.org_number)}`);
    const j = await r.json();
    const valid = j.isValid === true || j.valid === true;
    await admin.rpc("set_vies_result", { p_user: user.id, p_valid: valid, p_name: j.name || "" });
    return new Response(JSON.stringify({ valid, name: j.name || "" }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "VIES utilgængelig" }), { status: 502, headers: cors });
  }
});
