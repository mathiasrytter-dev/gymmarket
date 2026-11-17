-- =============================================================
-- GymMarket – 003: klargøring til drift
--  * Låser funktionsrettigheder (kun de nødvendige er offentlige)
--  * Simpel spambeskyttelse: maks. antal oprettelser pr. e-mail pr. døgn
--  * Billeder: kun upload til egen mappe-struktur, maks. 3 MB, kun JPEG
-- Kan køres igen uden at slette data.
-- =============================================================

-- Spambeskyttelse: højst 10 annoncer og 5 efterlysninger pr. e-mail pr. døgn
create or replace function gm_rate_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if tg_table_name = 'listings' then
    select count(*) into n from listings where lower(contact_email) = lower(new.contact_email) and created_at > now() - interval '1 day';
    if n >= 10 then raise exception 'For mange annoncer fra samme e-mail i dag'; end if;
  elsif tg_table_name = 'wanted' then
    select count(*) into n from wanted where lower(contact_email) = lower(new.contact_email) and created_at > now() - interval '1 day';
    if n >= 5 then raise exception 'For mange efterlysninger fra samme e-mail i dag'; end if;
  elsif tg_table_name = 'reports' then
    select count(*) into n from reports where lower(reporter_email) = lower(new.reporter_email) and created_at > now() - interval '1 day';
    if n >= 20 then raise exception 'For mange anmeldelser fra samme e-mail i dag'; end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_rate_listings on listings; create trigger trg_rate_listings before insert on listings for each row execute function gm_rate_limit();
drop trigger if exists trg_rate_wanted on wanted;     create trigger trg_rate_wanted  before insert on wanted   for each row execute function gm_rate_limit();
drop trigger if exists trg_rate_reports on reports;   create trigger trg_rate_reports before insert on reports  for each row execute function gm_rate_limit();

-- Rettigheder: kun disse funktioner må kaldes fra hjemmesiden
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function create_listing(jsonb, uuid), my_listings(uuid[], uuid[]), mark_listing_sold(uuid, uuid),
  delete_listing(uuid, uuid), renew_listing(uuid, uuid), create_wanted(jsonb), create_report(jsonb) to anon, authenticated;
grant execute on function activate_paid_listing(uuid, int, text, text, text) to service_role;

-- Billeder: sikre bucket-grænser
update storage.buckets set public = true, file_size_limit = 3145728, allowed_mime_types = array['image/jpeg'] where id = 'annoncebilleder';

-- Lancering: gratis i alle lande
update settings set payments_enabled = false where id = 1;
update markets set payments_enabled = false;
