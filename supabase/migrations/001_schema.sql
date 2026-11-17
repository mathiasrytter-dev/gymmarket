-- =============================================================
-- GymMarket – 001: grundskema (EU-version)
-- Kør i Supabase: SQL Editor -> New query -> Run. Vælg en EU-region.
-- Filen kan køres igen uden at slette data.
-- =============================================================
create extension if not exists pgcrypto;

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  payments_enabled boolean not null default false,
  listing_days int not null default 60,
  founder_free_listings int not null default 3
);
insert into settings default values on conflict do nothing;

create table if not exists markets (
  country char(2) primary key,
  currency char(3) not null,
  payments_enabled boolean not null default false,
  launched boolean not null default true
);
insert into markets (country, currency) values
 ('AT','EUR'),('BE','EUR'),('BG','EUR'),('HR','EUR'),('CY','EUR'),('CZ','CZK'),('DK','DKK'),('EE','EUR'),('FI','EUR'),
 ('FR','EUR'),('DE','EUR'),('GR','EUR'),('HU','HUF'),('IE','EUR'),('IT','EUR'),('LV','EUR'),('LT','EUR'),('LU','EUR'),
 ('MT','EUR'),('NL','EUR'),('PL','PLN'),('PT','EUR'),('RO','RON'),('SK','EUR'),('SI','EUR'),('ES','EUR'),('SE','SEK'),
 ('NO','NOK'),('IS','ISK'),('CH','CHF'),('GB','GBP')
on conflict (country) do nothing;

create table if not exists tier_prices (
  tier text not null check (tier in ('small','medium','large')),
  currency char(3) not null,
  min_price bigint not null,
  max_price bigint,
  amount int not null,
  primary key (tier, currency)
);
insert into tier_prices (tier, currency, min_price, max_price, amount)
select x.tier, x.cur, x.mn, x.mx, x.amt from (values
 ('DKK',1999,20000,29,79,149),('EUR',269,2699,4,11,20),('SEK',2999,29999,45,119,219),('NOK',2999,29999,45,119,219),
 ('PLN',1199,11999,19,49,89),('CZK',6999,69999,99,279,499),('HUF',99999,999999,1590,4290,7990),('RON',1299,12999,19,55,99),
 ('CHF',249,2499,4,10,19),('GBP',229,2299,4,9,17),('ISK',39999,399999,590,1590,2990)
) v(cur,a,b,p1,p2,p3)
cross join lateral (values ('small',v.cur,0::bigint,v.a::bigint,v.p1),('medium',v.cur,v.a+1,v.b::bigint,v.p2),('large',v.cur,v.b+1,null::bigint,v.p3)) x(tier,cur,mn,mx,amt)
on conflict do nothing;

do $$ begin
  create type listing_status as enum ('kladde','afventer_betaling','aktiv','udloebet','solgt');
exception when duplicate_object then null; end $$;

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lang text not null default 'en',
  title text not null check (char_length(title) between 3 and 80),
  category text not null check (category in ('spring','trampolin','airtrack','maatter','teamgym','ag','rg','skum','reservedele','andet')),
  brand text, year int,
  condition text not null check (condition in ('new','like_new','good','fair')),
  price bigint not null check (price >= 0),
  currency char(3) not null,
  new_price bigint check (new_price is null or new_price >= 0),
  city text not null, postcode text,
  country char(2) not null references markets(country),
  seller_type text not null check (seller_type in ('club','school','venue','dealer','private')),
  seller_name text not null,
  contact_email text not null check (contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  contact_phone text,
  description text check (char_length(description) <= 3000),
  transport boolean not null default false,
  images text[] not null default '{}' check (cardinality(images) <= 6),
  is_trader boolean not null default false,
  trader_company text, trader_vat text, trader_address text,
  check (not is_trader or (trader_company is not null and trader_vat is not null and trader_address is not null)),
  status listing_status not null default 'kladde',
  price_tier text, fee_charged int not null default 0, fee_currency char(3),
  published_at timestamptz, expires_at timestamptz,
  owner_token uuid not null
);
create index if not exists listings_active_idx on listings (status, expires_at);
create index if not exists listings_country_idx on listings (country);

create or replace function find_tier(p_currency text, p_price bigint) returns tier_prices
language sql stable as $$
  select * from tier_prices
   where currency = case when exists (select 1 from tier_prices where currency = p_currency) then p_currency else 'EUR' end
     and p_price >= min_price and (max_price is null or p_price <= max_price)
   order by min_price desc limit 1;
$$;

create or replace function market_paid(p_country text) returns boolean
language sql stable as $$
  select coalesce((select payments_enabled from markets where country = p_country),
                  (select payments_enabled from settings where id = 1));
$$;

create or replace function listings_apply_pricing() returns trigger
language plpgsql security definer set search_path = public as $$
declare t tier_prices; d int;
begin
  t := find_tier(new.currency, new.price);
  select listing_days into d from settings where id = 1;
  new.price_tier := t.tier; new.fee_currency := t.currency;
  if market_paid(new.country) then
    new.status := 'afventer_betaling'; new.fee_charged := t.amount; new.published_at := null; new.expires_at := null;
  else
    new.status := 'aktiv'; new.fee_charged := 0; new.published_at := now(); new.expires_at := now() + make_interval(days => d);
  end if;
  return new;
end $$;
drop trigger if exists trg_listings_pricing on listings;
create trigger trg_listings_pricing before insert on listings for each row execute function listings_apply_pricing();

create table if not exists wanted (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null check (char_length(title) between 3 and 80),
  budget text, area text, name text not null,
  contact_email text not null check (contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  expires_at timestamptz not null default now() + interval '90 days'
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  listing_id uuid references listings(id) on delete set null,
  reason text not null check (reason in ('illegal','unsafe','misleading','ip','other')),
  details text not null check (char_length(details) between 10 and 2000),
  reporter_email text not null,
  good_faith boolean not null check (good_faith),
  lang text,
  status text not null default 'ny',
  decision text, decided_at timestamptz
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  listing_id uuid references listings(id) on delete set null,
  amount int not null, currency char(3) not null,
  country char(2),
  provider text not null, provider_ref text unique,
  status text not null default 'gennemfoert'
);

alter table settings enable row level security;  alter table markets enable row level security;
alter table tier_prices enable row level security; alter table listings enable row level security;
alter table wanted enable row level security;    alter table reports enable row level security;
alter table payments enable row level security;
revoke all on settings, markets, tier_prices, listings, wanted, reports, payments from anon, authenticated;

grant select on settings, markets, tier_prices to anon, authenticated;
drop policy if exists r_settings on settings;  create policy r_settings on settings for select using (true);
drop policy if exists r_markets on markets;    create policy r_markets on markets for select using (true);
drop policy if exists r_tiers on tier_prices;  create policy r_tiers on tier_prices for select using (true);

grant select (id, created_at, lang, title, category, brand, year, condition, price, currency, new_price, city, postcode, country,
  seller_type, seller_name, contact_email, contact_phone, description, transport, images, is_trader, trader_company, trader_vat,
  trader_address, status, price_tier, fee_charged, fee_currency, published_at, expires_at) on listings to anon, authenticated;
drop policy if exists r_listings on listings;
create policy r_listings on listings for select using (status = 'aktiv' and expires_at > now());

grant select on wanted to anon, authenticated;
drop policy if exists r_wanted on wanted; create policy r_wanted on wanted for select using (expires_at > now());

create or replace function my_listings(p_ids uuid[], p_tokens uuid[]) returns setof json
language sql security definer set search_path = public as $$
  select ((to_jsonb(l) - 'owner_token') || jsonb_build_object('status',
    case when l.status = 'aktiv' and l.expires_at < now() then 'udloebet' else l.status::text end))::json
  from listings l join unnest(p_ids, p_tokens) as k(id, token) on l.id = k.id and l.owner_token = k.token
  order by l.created_at desc;
$$;

create or replace function mark_listing_sold(p_id uuid, p_token uuid) returns void
language plpgsql security definer set search_path = public as $$
begin update listings set status = 'solgt' where id = p_id and owner_token = p_token;
  if not found then raise exception 'Ingen adgang'; end if; end $$;

create or replace function delete_listing(p_id uuid, p_token uuid) returns void
language plpgsql security definer set search_path = public as $$
begin delete from listings where id = p_id and owner_token = p_token;
  if not found then raise exception 'Ingen adgang'; end if; end $$;

create or replace function renew_listing(p_id uuid, p_token uuid) returns json
language plpgsql security definer set search_path = public as $$
declare t tier_prices; r listings; d int;
begin
  select * into r from listings where id = p_id and owner_token = p_token;
  if not found then raise exception 'Ingen adgang'; end if;
  if not (r.status = 'udloebet' or (r.status = 'aktiv' and r.expires_at < now())) then raise exception 'Kun udløbne annoncer kan fornyes'; end if;
  t := find_tier(r.currency, r.price);
  select listing_days into d from settings where id = 1;
  if market_paid(r.country) then
    update listings set status = 'afventer_betaling', fee_charged = t.amount, fee_currency = t.currency where id = p_id returning * into r;
  else
    update listings set status = 'aktiv', fee_charged = 0, published_at = now(), expires_at = now() + make_interval(days => d) where id = p_id returning * into r;
  end if;
  return json_build_object('status', r.status, 'fee_charged', r.fee_charged, 'fee_currency', r.fee_currency);
end $$;

create or replace function create_wanted(p jsonb) returns json
language plpgsql security definer set search_path = public as $$
declare r wanted;
begin
  insert into wanted (title, budget, area, name, contact_email)
  values (trim(p->>'title'), nullif(trim(p->>'budget'),''), nullif(trim(p->>'area'),''), trim(p->>'name'), trim(p->>'contact_email'))
  returning * into r;
  return json_build_object('id', r.id);
end $$;

create or replace function create_report(p jsonb) returns json
language plpgsql security definer set search_path = public as $$
declare r reports;
begin
  insert into reports (listing_id, reason, details, reporter_email, good_faith, lang)
  values (nullif(p->>'listing_id','')::uuid, p->>'reason', trim(p->>'details'), trim(p->>'reporter_email'),
          coalesce((p->>'good_faith')::boolean,false), p->>'lang')
  returning * into r;
  return json_build_object('id', r.id);
end $$;

create or replace function activate_paid_listing(p_id uuid, p_amount int, p_currency text, p_provider text, p_ref text) returns void
language plpgsql security definer set search_path = public as $$
declare r listings; d int;
begin
  select * into r from listings where id = p_id for update;
  if not found or r.status <> 'afventer_betaling' then raise exception 'Annoncen afventer ikke betaling'; end if;
  if upper(p_currency) <> r.fee_currency or p_amount < r.fee_charged then raise exception 'Forkert beløb eller valuta'; end if;
  select listing_days into d from settings where id = 1;
  insert into payments (listing_id, amount, currency, country, provider, provider_ref) values (p_id, p_amount, upper(p_currency), r.country, p_provider, p_ref);
  update listings set status = 'aktiv', published_at = now(), expires_at = now() + make_interval(days => d) where id = p_id;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('annoncebilleder', 'annoncebilleder', true, 3145728, array['image/jpeg'])
on conflict (id) do nothing;
drop policy if exists "upload annoncebilleder" on storage.objects;
create policy "upload annoncebilleder" on storage.objects for insert to anon, authenticated with check (bucket_id = 'annoncebilleder');
