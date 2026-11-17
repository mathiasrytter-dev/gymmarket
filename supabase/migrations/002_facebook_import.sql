-- =============================================================
-- GymMarket – 002: Facebook-import (link til opslag) + create_listing
-- Kan køres igen uden at slette data.
-- =============================================================
alter table listings add column if not exists source_url text;
do $$ begin
  alter table listings add constraint listings_source_url_fb
    check (source_url is null or source_url ~* '^https://([a-z0-9-]+\.)*(facebook\.com|fb\.com|fb\.me|fb\.watch)/');
exception when duplicate_object then null; end $$;
grant select (source_url) on listings to anon, authenticated;

create or replace function create_listing(p jsonb, p_token uuid) returns json
language plpgsql security definer set search_path = public as $$
declare r listings; tr boolean := coalesce((p->>'is_trader')::boolean, false) or p->>'seller_type' = 'dealer';
begin
  insert into listings (lang, title, category, brand, year, condition, price, currency, new_price, city, postcode, country,
    seller_type, seller_name, contact_email, contact_phone, description, transport, images,
    is_trader, trader_company, trader_vat, trader_address, source_url, owner_token)
  values (
    coalesce(nullif(p->>'lang',''),'en'), trim(p->>'title'), p->>'category', nullif(trim(p->>'brand'),''), nullif(p->>'year','')::int,
    p->>'condition', (p->>'price')::bigint, upper(p->>'currency'), nullif(p->>'new_price','')::bigint,
    trim(p->>'city'), nullif(trim(p->>'postcode'),''), upper(p->>'country'),
    p->>'seller_type', trim(p->>'seller_name'), trim(p->>'contact_email'), nullif(trim(p->>'contact_phone'),''), p->>'description',
    coalesce((p->>'transport')::boolean,false),
    coalesce(array(select jsonb_array_elements_text(coalesce(p->'images','[]'::jsonb))),'{}'),
    tr, case when tr then nullif(trim(p->>'trader_company'),'') end, case when tr then nullif(trim(p->>'trader_vat'),'') end,
    case when tr then nullif(trim(p->>'trader_address'),'') end,
    nullif(trim(p->>'source_url'),''), p_token)
  returning * into r;
  return json_build_object('id', r.id, 'status', r.status, 'fee_charged', r.fee_charged, 'fee_currency', r.fee_currency);
end $$;
