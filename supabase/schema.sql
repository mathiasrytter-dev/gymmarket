-- =============================================================
-- GymMarket – database med brugere og EU-verificering (Supabase)
-- Kør i Supabase: SQL Editor -> New query -> Run.  Vælg EU-region.
-- Køres i BÅDE drifts- og testprojektet (samme skema).
-- Login: Supabase Auth. Slå "Confirm email" TIL (Authentication -> Providers -> Email).
-- =============================================================
create extension if not exists pgcrypto;

create table if not exists settings (id int primary key default 1 check (id = 1), payments_enabled boolean not null default false, listing_days int not null default 60);
insert into settings default values on conflict do nothing;

create table if not exists markets (country char(2) primary key, currency char(3) not null, payments_enabled boolean not null default false);
insert into markets (country, currency) values
 ('AT','EUR'),('BE','EUR'),('BG','EUR'),('HR','EUR'),('CY','EUR'),('CZ','CZK'),('DK','DKK'),('EE','EUR'),('FI','EUR'),
 ('FR','EUR'),('DE','EUR'),('GR','EUR'),('HU','HUF'),('IE','EUR'),('IT','EUR'),('LV','EUR'),('LT','EUR'),('LU','EUR'),
 ('MT','EUR'),('NL','EUR'),('PL','PLN'),('PT','EUR'),('RO','RON'),('SK','EUR'),('SI','EUR'),('ES','EUR'),('SE','SEK'),
 ('NO','NOK'),('IS','ISK'),('CH','CHF'),('GB','GBP')
on conflict (country) do nothing;

create table if not exists tier_prices (tier text not null, currency char(3) not null, min_price bigint not null, max_price bigint, amount int not null, primary key (tier, currency));
insert into tier_prices (tier, currency, min_price, max_price, amount)
select x.tier, x.cur, x.mn, x.mx, x.amt from (values
 ('DKK',1999,20000,29,79,149),('EUR',269,2699,4,11,20),('SEK',2999,29999,45,119,219),('NOK',2999,29999,45,119,219),
 ('PLN',1199,11999,19,49,89),('CZK',6999,69999,99,279,499),('HUF',99999,999999,1590,4290,7990),('RON',1299,12999,19,55,99),
 ('CHF',249,2499,4,10,19),('GBP',229,2299,4,9,17),('ISK',39999,399999,590,1590,2990)
) v(cur,a,b,p1,p2,p3)
cross join lateral (values ('small',v.cur,0::bigint,v.a::bigint,v.p1),('medium',v.cur,v.a+1,v.b::bigint,v.p2),('large',v.cur,v.b+1,null::bigint,v.p3)) x(tier,cur,mn,mx,amt)
on conflict do nothing;

-- GENERERET af tools/registries.py
create table if not exists id_formats (
  country char(2) not null, id_type text not null check (id_type in ('vat','company','assoc')),
  label text not null, pattern text not null, example text not null,
  registry_url text not null, vies boolean not null default false, vat_prefix text not null,
  primary key (country, id_type)
);
insert into id_formats (country, id_type, label, pattern, example, registry_url, vies, vat_prefix) values
('AT','vat','UID-Nummer','U\d{8}','ATU12345678','https://e-justice.europa.eu/',true,'AT'),
('AT','company','Firmenbuchnummer (FN)','(FN)?\d{1,6}[A-Z]','FN 123456a','https://e-justice.europa.eu/',false,'AT'),
('AT','assoc','ZVR-Zahl','\d{9}','123456789','https://e-justice.europa.eu/',false,'AT'),
('BE','vat','BTW/TVA','[01]\d{9}','BE0123456789','https://e-justice.europa.eu/',true,'BE'),
('BE','company','Ondernemingsnummer / N° d''entreprise','[01]\d{9}','0123.456.789','https://e-justice.europa.eu/',false,'BE'),
('BE','assoc','Ondernemingsnummer (VZW/ASBL)','[01]\d{9}','0123.456.789','https://e-justice.europa.eu/',false,'BE'),
('BG','vat','ДДС номер','\d{9,10}','BG123456789','https://e-justice.europa.eu/',true,'BG'),
('BG','company','ЕИК / BULSTAT','\d{9}|\d{13}','123456789','https://e-justice.europa.eu/',false,'BG'),
('BG','assoc','ЕИК / BULSTAT','\d{9}|\d{13}','123456789','https://e-justice.europa.eu/',false,'BG'),
('HR','vat','PDV ID','\d{11}','HR12345678901','https://e-justice.europa.eu/',true,'HR'),
('HR','company','OIB','\d{11}','12345678901','https://e-justice.europa.eu/',false,'HR'),
('HR','assoc','OIB (udruga)','\d{11}','12345678901','https://e-justice.europa.eu/',false,'HR'),
('CY','vat','ΦΠΑ / VAT','\d{8}[A-Z]','CY12345678X','https://e-justice.europa.eu/',true,'CY'),
('CY','company','Αριθμός Εγγραφής (HE)','(HE)?\d{1,6}','HE123456','https://e-justice.europa.eu/',false,'CY'),
('CY','assoc','Αριθμός Εγγραφής Σωματείου','[A-Z0-9]{3,12}','1234','https://e-justice.europa.eu/',false,'CY'),
('CZ','vat','DIČ','\d{8,10}','CZ12345678','https://e-justice.europa.eu/',true,'CZ'),
('CZ','company','IČO','\d{8}','12345678','https://e-justice.europa.eu/',false,'CZ'),
('CZ','assoc','IČO (spolek)','\d{8}','12345678','https://e-justice.europa.eu/',false,'CZ'),
('DK','vat','SE-/momsnummer','\d{8}','DK12345678','https://datacvr.virk.dk/',true,'DK'),
('DK','company','CVR-nummer','\d{8}','12345678','https://datacvr.virk.dk/',false,'DK'),
('DK','assoc','CVR-nummer (forening)','\d{8}','12345678','https://datacvr.virk.dk/',false,'DK'),
('EE','vat','KMKR number','\d{9}','EE123456789','https://e-justice.europa.eu/',true,'EE'),
('EE','company','Registrikood','\d{8}','12345678','https://e-justice.europa.eu/',false,'EE'),
('EE','assoc','Registrikood (MTÜ)','8\d{7}','80123456','https://e-justice.europa.eu/',false,'EE'),
('FI','vat','ALV-numero','\d{8}','FI12345678','https://www.ytj.fi/',true,'FI'),
('FI','company','Y-tunnus','\d{8}','1234567-8','https://www.ytj.fi/',false,'FI'),
('FI','assoc','Y-tunnus / Yhdistysrekisterinumero','\d{1,8}','1234567-8','https://www.ytj.fi/',false,'FI'),
('FR','vat','N° TVA intracommunautaire','[0-9A-Z]{2}\d{9}','FR12345678901','https://annuaire-entreprises.data.gouv.fr/',true,'FR'),
('FR','company','SIREN / SIRET','\d{9}|\d{14}','123 456 789','https://annuaire-entreprises.data.gouv.fr/',false,'FR'),
('FR','assoc','RNA','W\d{9}','W123456789','https://annuaire-entreprises.data.gouv.fr/',false,'FR'),
('DE','vat','USt-IdNr.','\d{9}','DE123456789','https://www.handelsregister.de/',true,'DE'),
('DE','company','Handelsregisternummer','HR[AB]\d{1,6}[A-Z]{0,2}','HRB 12345','https://www.handelsregister.de/',false,'DE'),
('DE','assoc','Vereinsregisternummer','VR\d{1,6}','VR 1234','https://www.handelsregister.de/',false,'DE'),
('GR','vat','ΑΦΜ (EL)','\d{9}','EL123456789','https://e-justice.europa.eu/',true,'EL'),
('GR','company','ΓΕΜΗ','\d{9,12}','123456789000','https://e-justice.europa.eu/',false,'EL'),
('GR','assoc','ΑΦΜ σωματείου','\d{9}','123456789','https://e-justice.europa.eu/',false,'EL'),
('HU','vat','Közösségi adószám','\d{8}','HU12345678','https://e-justice.europa.eu/',true,'HU'),
('HU','company','Cégjegyzékszám','\d{10}','01-09-123456','https://e-justice.europa.eu/',false,'HU'),
('HU','assoc','Nyilvántartási szám','\d{5,13}','01-02-0001234','https://e-justice.europa.eu/',false,'HU'),
('IE','vat','VAT number','\d{7}[A-Z]{1,2}|\d[A-Z+*]\d{5}[A-Z]','IE1234567T','https://e-justice.europa.eu/',true,'IE'),
('IE','company','CRO number','\d{5,6}','123456','https://e-justice.europa.eu/',false,'IE'),
('IE','assoc','CRO / Charity number','\d{5,6}|\d{11}','123456','https://e-justice.europa.eu/',false,'IE'),
('IT','vat','Partita IVA','\d{11}','IT12345678901','https://e-justice.europa.eu/',true,'IT'),
('IT','company','Partita IVA / Codice fiscale','\d{11}','12345678901','https://e-justice.europa.eu/',false,'IT'),
('IT','assoc','Codice fiscale associazione','\d{11}|[A-Z0-9]{16}','91234567890','https://e-justice.europa.eu/',false,'IT'),
('LV','vat','PVN numurs','\d{11}','LV12345678901','https://e-justice.europa.eu/',true,'LV'),
('LV','company','Reģistrācijas numurs','\d{11}','40001234567','https://e-justice.europa.eu/',false,'LV'),
('LV','assoc','Reģistrācijas numurs (biedrība)','\d{11}','40008123456','https://e-justice.europa.eu/',false,'LV'),
('LT','vat','PVM kodas','\d{9}|\d{12}','LT123456789','https://e-justice.europa.eu/',true,'LT'),
('LT','company','Įmonės kodas','\d{9}','123456789','https://e-justice.europa.eu/',false,'LT'),
('LT','assoc','Juridinio asmens kodas','\d{9}','123456789','https://e-justice.europa.eu/',false,'LT'),
('LU','vat','N° TVA','\d{8}','LU12345678','https://e-justice.europa.eu/',true,'LU'),
('LU','company','RCS','B\d{1,6}','B123456','https://e-justice.europa.eu/',false,'LU'),
('LU','assoc','RCS (ASBL)','F\d{1,6}','F1234','https://e-justice.europa.eu/',false,'LU'),
('MT','vat','VAT number','\d{8}','MT12345678','https://e-justice.europa.eu/',true,'MT'),
('MT','company','Company registration','C\d{1,6}','C 12345','https://e-justice.europa.eu/',false,'MT'),
('MT','assoc','VO number','(VO)?\d{1,5}','VO/1234','https://e-justice.europa.eu/',false,'MT'),
('NL','vat','Btw-identificatienummer','\d{9}B\d{2}','NL123456789B01','https://www.kvk.nl/',true,'NL'),
('NL','company','KvK-nummer','\d{8}','12345678','https://www.kvk.nl/',false,'NL'),
('NL','assoc','KvK-nummer (vereniging)','\d{8}','40123456','https://www.kvk.nl/',false,'NL'),
('PL','vat','NIP (VAT UE)','\d{10}','PL1234567890','https://e-justice.europa.eu/',true,'PL'),
('PL','company','KRS / NIP','\d{10}','0000123456','https://e-justice.europa.eu/',false,'PL'),
('PL','assoc','KRS (stowarzyszenie)','\d{10}','0000123456','https://e-justice.europa.eu/',false,'PL'),
('PT','vat','NIF / NIPC','\d{9}','PT123456789','https://e-justice.europa.eu/',true,'PT'),
('PT','company','NIPC','\d{9}','512345678','https://e-justice.europa.eu/',false,'PT'),
('PT','assoc','NIPC (associação)','\d{9}','512345678','https://e-justice.europa.eu/',false,'PT'),
('RO','vat','Cod TVA','\d{2,10}','RO1234567','https://e-justice.europa.eu/',true,'RO'),
('RO','company','CUI / CIF','\d{2,10}','1234567','https://e-justice.europa.eu/',false,'RO'),
('RO','assoc','CIF (asociație)','\d{2,10}','1234567','https://e-justice.europa.eu/',false,'RO'),
('SK','vat','IČ DPH','\d{10}','SK1234567890','https://e-justice.europa.eu/',true,'SK'),
('SK','company','IČO','\d{8}','12345678','https://e-justice.europa.eu/',false,'SK'),
('SK','assoc','IČO (občianske združenie)','\d{8}','12345678','https://e-justice.europa.eu/',false,'SK'),
('SI','vat','ID za DDV','\d{8}','SI12345678','https://e-justice.europa.eu/',true,'SI'),
('SI','company','Matična številka','\d{7}(\d{3})?','1234567000','https://e-justice.europa.eu/',false,'SI'),
('SI','assoc','Matična številka (društvo)','\d{7}(\d{3})?','1234567','https://e-justice.europa.eu/',false,'SI'),
('ES','vat','NIF-IVA','[A-Z0-9]\d{7}[A-Z0-9]','ESB12345678','https://e-justice.europa.eu/',true,'ES'),
('ES','company','NIF / CIF','[A-Z]\d{7}[A-Z0-9]','B12345678','https://e-justice.europa.eu/',false,'ES'),
('ES','assoc','NIF (asociación)','G\d{8}','G12345678','https://e-justice.europa.eu/',false,'ES'),
('SE','vat','Momsregistreringsnummer','\d{10}01','SE556123456701','https://e-justice.europa.eu/',true,'SE'),
('SE','company','Organisationsnummer','\d{10}','556123-4567','https://e-justice.europa.eu/',false,'SE'),
('SE','assoc','Organisationsnummer (förening)','\d{10}','802123-4567','https://e-justice.europa.eu/',false,'SE'),
('NO','vat','MVA-nummer','\d{9}(MVA)?','NO 123456789 MVA','https://www.brreg.no/',false,'NO'),
('NO','company','Organisasjonsnummer','\d{9}','123 456 789','https://www.brreg.no/',false,'NO'),
('NO','assoc','Organisasjonsnummer (lag/forening)','\d{9}','912 345 678','https://www.brreg.no/',false,'NO'),
('IS','vat','VSK-númer','\d{5,6}','12345','https://e-justice.europa.eu/',false,'IS'),
('IS','company','Kennitala','\d{10}','123456-7890','https://e-justice.europa.eu/',false,'IS'),
('IS','assoc','Kennitala (félag)','\d{10}','123456-7890','https://e-justice.europa.eu/',false,'IS'),
('CH','vat','MWST/TVA/IVA-Nr.','(CHE)?\d{9}(MWST|TVA|IVA)?','CHE-123.456.789 MWST','https://www.uid.admin.ch/',false,'CH'),
('CH','company','UID','(CHE)?\d{9}','CHE-123.456.789','https://www.uid.admin.ch/',false,'CH'),
('CH','assoc','UID (Verein)','(CHE)?\d{9}','CHE-123.456.789','https://www.uid.admin.ch/',false,'CH'),
('GB','vat','VAT registration number','\d{9}|\d{12}','GB123456789','https://find-and-update.company-information.service.gov.uk/',false,'GB'),
('GB','company','Companies House number','[A-Z0-9]{8}','01234567','https://find-and-update.company-information.service.gov.uk/',false,'GB'),
('GB','assoc','Charity number','\d{6,8}(-\d)?|SC\d{6}','1234567','https://find-and-update.company-information.service.gov.uk/',false,'GB')
on conflict (country, id_type) do update set label = excluded.label, pattern = excluded.pattern, example = excluded.example,
  registry_url = excluded.registry_url, vies = excluded.vies, vat_prefix = excluded.vat_prefix;

create or replace function norm_id(p_country text, p_type text, p_number text) returns text language plpgsql immutable as $$
declare s text := upper(regexp_replace(coalesce(p_number,''), '[\s./-]', '', 'g')); pre text;
begin
  if p_type = 'vat' then
    pre := case when p_country = 'GR' then 'EL' else p_country end;
    if left(s, length(pre)) = pre then s := substr(s, length(pre) + 1);
    elsif left(s, 2) = p_country then s := substr(s, 3); end if;
  end if;
  return s;
end $$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  email text not null, name text not null,
  user_type text not null check (user_type in ('club','school','venue','dealer','private')),
  org_name text, country char(2) references markets(country), phone text,
  is_trader boolean not null default false,
  trader_company text, trader_vat text, trader_address text,
  check (not is_trader or (trader_company is not null and trader_vat is not null and trader_address is not null)),
  org_status text not null default 'none' check (org_status in ('none','pending','approved','rejected')),
  org_country char(2) references markets(country),
  org_id_type text check (org_id_type in ('vat','company','assoc')),
  org_number text, org_note text,
  vies_valid boolean, vies_name text, vies_checked_at timestamptz,
  org_verified_at timestamptz, org_reject_reason text,
  is_admin boolean not null default false
);

create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb); tr boolean := coalesce((m->>'is_trader')::boolean,false) or m->>'user_type' = 'dealer';
begin
  insert into profiles (id, email, name, user_type, org_name, country, phone, is_trader, trader_company, trader_vat, trader_address)
  values (new.id, new.email, coalesce(nullif(trim(m->>'name'),''), split_part(new.email,'@',1)),
          coalesce(nullif(m->>'user_type',''),'private'), nullif(trim(m->>'org_name'),''), nullif(upper(m->>'country'),''),
          nullif(trim(m->>'phone'),''), tr,
          case when tr then coalesce(nullif(trim(m->>'trader_company'),''), m->>'org_name', '-') end,
          case when tr then coalesce(nullif(trim(m->>'trader_vat'),''), '-') end,
          case when tr then coalesce(nullif(trim(m->>'trader_address'),''), '-') end);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

do $$ begin create type listing_status as enum ('kladde','afventer_betaling','aktiv','udloebet','solgt');
exception when duplicate_object then null; end $$;

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(), lang text not null default 'en',
  title text not null check (char_length(title) between 3 and 80),
  category text not null check (category in ('trampolin','airtrack','teamgym','ag','rg','skum','andet')),
  brand text, year int, condition text not null check (condition in ('new','like_new','good','fair')),
  price bigint not null check (price >= 0), currency char(3) not null, new_price bigint check (new_price is null or new_price >= 0),
  city text not null, postcode text, country char(2) not null references markets(country),
  description text check (char_length(description) <= 3000), transport boolean not null default false,
  images text[] not null default '{}' check (cardinality(images) <= 6),
  status listing_status not null default 'kladde', price_tier text, fee_charged int not null default 0, fee_currency char(3),
  published_at timestamptz, expires_at timestamptz
);
create index if not exists listings_active_idx on listings (status, expires_at);
create index if not exists listings_owner_idx on listings (owner_id);

create or replace function find_tier(p_currency text, p_price bigint) returns tier_prices language sql stable as $$
  select * from tier_prices where currency = case when exists (select 1 from tier_prices where currency = p_currency) then p_currency else 'EUR' end
   and p_price >= min_price and (max_price is null or p_price <= max_price) order by min_price desc limit 1; $$;
create or replace function market_paid(p_country text) returns boolean language sql stable as $$
  select coalesce((select payments_enabled from markets where country = p_country), (select payments_enabled from settings where id = 1)); $$;
create or replace function listings_apply_pricing() returns trigger language plpgsql security definer set search_path = public as $$
declare t tier_prices; d int;
begin
  t := find_tier(new.currency, new.price); select listing_days into d from settings where id = 1;
  new.price_tier := t.tier; new.fee_currency := t.currency;
  if market_paid(new.country) then new.status := 'afventer_betaling'; new.fee_charged := t.amount; new.expires_at := null;
  else new.status := 'aktiv'; new.fee_charged := 0; new.published_at := now(); new.expires_at := now() + make_interval(days => d); end if;
  return new;
end $$;
drop trigger if exists trg_listings_pricing on listings;
create trigger trg_listings_pricing before insert on listings for each row execute function listings_apply_pricing();

create or replace view listings_public as
  select l.id, l.created_at, l.lang, l.title, l.category, l.brand, l.year, l.condition, l.price, l.currency, l.new_price,
         l.city, l.postcode, l.country, l.description, l.transport, l.images, l.status, l.expires_at,
         case when p.user_type <> 'private' and p.org_name is not null then p.org_name else p.name end as seller_name,
         p.user_type as seller_type, p.email as contact_email, p.phone as contact_phone,
         p.is_trader, p.trader_company, p.trader_vat, p.trader_address,
         (p.org_status = 'approved') as seller_verified,
         case when p.org_status = 'approved' then p.org_country end as org_country,
         case when p.org_status = 'approved' then p.org_id_type end as org_id_type
  from listings l join profiles p on p.id = l.owner_id
  where l.status = 'aktiv' and l.expires_at > now();

create table if not exists wanted (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(), title text not null check (char_length(title) between 3 and 80),
  budget text, area text, expires_at timestamptz not null default now() + interval '90 days'
);
create or replace view wanted_public as
  select w.id, w.created_at, w.title, w.budget, w.area, w.expires_at,
         case when p.user_type <> 'private' and p.org_name is not null then p.org_name else p.name end as name,
         p.email as contact_email, (p.org_status = 'approved') as verified
  from wanted w join profiles p on p.id = w.owner_id where w.expires_at > now();

create table if not exists reports (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  listing_id uuid references listings(id) on delete set null, reporter_id uuid references profiles(id) on delete set null,
  reason text not null check (reason in ('illegal','unsafe','misleading','ip','other')),
  details text not null check (char_length(details) between 10 and 2000),
  reporter_email text not null, good_faith boolean not null check (good_faith), lang text,
  status text not null default 'ny', decision text, decided_at timestamptz
);
create table if not exists payments (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
  listing_id uuid references listings(id) on delete set null, amount int not null, currency char(3) not null,
  country char(2), provider text not null, provider_ref text unique, status text not null default 'gennemfoert'
);

create or replace view verification_queue as
  select p.id, p.created_at, p.name, p.org_name, p.email, p.user_type, p.org_country, p.org_id_type, f.label as id_label,
         p.org_number, p.org_note, p.vies_valid, p.vies_name, p.vies_checked_at, f.registry_url,
         case when f.vies then 'https://ec.europa.eu/taxation_customs/vies/' end as vies_url
  from profiles p left join id_formats f on f.country = p.org_country and f.id_type = p.org_id_type
  where p.org_status = 'pending' order by p.created_at;

alter table settings enable row level security; alter table markets enable row level security;
alter table tier_prices enable row level security; alter table id_formats enable row level security;
alter table profiles enable row level security; alter table listings enable row level security;
alter table wanted enable row level security; alter table reports enable row level security; alter table payments enable row level security;
revoke all on settings, markets, tier_prices, id_formats, profiles, listings, wanted, reports, payments from anon, authenticated;
revoke all on verification_queue from anon, authenticated;

grant select on settings, markets, tier_prices, id_formats to anon, authenticated;
drop policy if exists r_settings on settings; create policy r_settings on settings for select using (true);
drop policy if exists r_markets on markets;   create policy r_markets on markets for select using (true);
drop policy if exists r_tiers on tier_prices; create policy r_tiers on tier_prices for select using (true);
drop policy if exists r_idf on id_formats;    create policy r_idf on id_formats for select using (true);
grant select on listings_public, wanted_public to anon, authenticated;

create or replace function require_user() returns uuid language plpgsql stable as $$
begin if auth.uid() is null then raise exception 'Log ind'; end if; return auth.uid(); end $$;

create or replace function my_profile() returns json language sql security definer set search_path = public as $$
  select to_json(p) from (select id, email, name, user_type, org_name, country, phone, is_trader, trader_company, trader_vat, trader_address,
    org_status, org_country, org_id_type, org_number, vies_valid, created_at from profiles where id = auth.uid()) p; $$;

create or replace function request_verification(p_country text, p_type text, p_number text, p_note text) returns void
language plpgsql security definer set search_path = public as $$
declare f id_formats; n text;
begin
  perform require_user();
  select * into f from id_formats where country = upper(p_country) and id_type = p_type;
  if not found then raise exception 'Ugyldigt format'; end if;
  n := norm_id(upper(p_country), p_type, p_number);
  if n !~ ('^(' || f.pattern || ')$') then raise exception 'Ugyldigt format'; end if;
  update profiles set org_country = upper(p_country), org_id_type = p_type, org_number = n, org_note = left(p_note, 500),
         org_status = 'pending', vies_valid = null, vies_name = null, vies_checked_at = null
   where id = auth.uid() and org_status in ('none','rejected');
end $$;

create or replace function set_vies_result(p_user uuid, p_valid boolean, p_name text) returns void
language sql security definer set search_path = public as $$
  update profiles set vies_valid = p_valid, vies_name = left(p_name, 200), vies_checked_at = now() where id = p_user; $$;

create or replace function decide_verification(p_user uuid, p_approve boolean, p_reason text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.role() <> 'service_role' and not exists (select 1 from profiles where id = auth.uid() and is_admin) then raise exception 'Ingen adgang'; end if;
  update profiles set org_status = case when p_approve then 'approved' else 'rejected' end,
         org_verified_at = case when p_approve then now() end, org_reject_reason = case when p_approve then null else p_reason end
   where id = p_user and org_status = 'pending';
end $$;

create or replace function create_listing(p jsonb) returns json language plpgsql security definer set search_path = public as $$
declare r listings;
begin
  insert into listings (owner_id, lang, title, category, brand, year, condition, price, currency, new_price, city, postcode, country, description, transport, images)
  values (require_user(), coalesce(nullif(p->>'lang',''),'en'), trim(p->>'title'), p->>'category', nullif(trim(p->>'brand'),''), nullif(p->>'year','')::int,
    p->>'condition', (p->>'price')::bigint, upper(p->>'currency'), nullif(p->>'new_price','')::bigint,
    trim(p->>'city'), nullif(trim(p->>'postcode'),''), upper(p->>'country'), p->>'description', coalesce((p->>'transport')::boolean,false),
    coalesce(array(select jsonb_array_elements_text(coalesce(p->'images','[]'::jsonb))),'{}'))
  returning * into r;
  return json_build_object('id', r.id, 'status', r.status);
end $$;
create or replace function my_listings() returns setof json language sql security definer set search_path = public as $$
  select (to_jsonb(l) || jsonb_build_object('status', case when l.status = 'aktiv' and l.expires_at < now() then 'udloebet' else l.status::text end))::json
  from listings l where l.owner_id = auth.uid() order by l.created_at desc; $$;
create or replace function mark_listing_sold(p_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin update listings set status = 'solgt' where id = p_id and owner_id = require_user(); if not found then raise exception 'Ingen adgang'; end if; end $$;
create or replace function delete_listing(p_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin delete from listings where id = p_id and owner_id = require_user(); if not found then raise exception 'Ingen adgang'; end if; end $$;
create or replace function renew_listing(p_id uuid) returns json language plpgsql security definer set search_path = public as $$
declare t tier_prices; r listings; d int;
begin
  select * into r from listings where id = p_id and owner_id = require_user(); if not found then raise exception 'Ingen adgang'; end if;
  t := find_tier(r.currency, r.price); select listing_days into d from settings where id = 1;
  if market_paid(r.country) then update listings set status = 'afventer_betaling', fee_charged = t.amount, fee_currency = t.currency where id = p_id returning * into r;
  else update listings set status = 'aktiv', fee_charged = 0, published_at = now(), expires_at = now() + make_interval(days => d) where id = p_id returning * into r; end if;
  return json_build_object('status', r.status);
end $$;
create or replace function create_wanted(p jsonb) returns json language plpgsql security definer set search_path = public as $$
declare r wanted;
begin insert into wanted (owner_id, title, budget, area) values (require_user(), trim(p->>'title'), nullif(trim(p->>'budget'),''), nullif(trim(p->>'area'),'')) returning * into r;
  return json_build_object('id', r.id); end $$;
create or replace function create_report(p jsonb) returns json language plpgsql security definer set search_path = public as $$
declare r reports;
begin
  insert into reports (listing_id, reporter_id, reason, details, reporter_email, good_faith, lang)
  values (nullif(p->>'listing_id','')::uuid, auth.uid(), p->>'reason', trim(p->>'details'), trim(p->>'reporter_email'), coalesce((p->>'good_faith')::boolean,false), p->>'lang')
  returning * into r; return json_build_object('id', r.id);
end $$;
create or replace function activate_paid_listing(p_id uuid, p_amount int, p_currency text, p_provider text, p_ref text) returns void
language plpgsql security definer set search_path = public as $$
declare r listings; d int;
begin
  select * into r from listings where id = p_id for update;
  if not found or r.status <> 'afventer_betaling' then raise exception 'Annoncen afventer ikke betaling'; end if;
  if upper(p_currency) <> r.fee_currency or p_amount < r.fee_charged then raise exception 'Forkert beløb'; end if;
  select listing_days into d from settings where id = 1;
  insert into payments (listing_id, amount, currency, country, provider, provider_ref) values (p_id, p_amount, upper(p_currency), r.country, p_provider, p_ref);
  update listings set status = 'aktiv', published_at = now(), expires_at = now() + make_interval(days => d) where id = p_id;
end $$;

revoke execute on all functions in schema public from public, anon;
grant execute on function create_report(jsonb), norm_id(text, text, text) to anon, authenticated;
grant execute on function my_profile(), request_verification(text, text, text, text), create_listing(jsonb), my_listings(),
  mark_listing_sold(uuid), delete_listing(uuid), renew_listing(uuid), create_wanted(jsonb), require_user(), decide_verification(uuid, boolean, text) to authenticated;
grant execute on function activate_paid_listing(uuid, int, text, text, text), set_vies_result(uuid, boolean, text), decide_verification(uuid, boolean, text) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('annoncebilleder', 'annoncebilleder', true, 3145728, array['image/jpeg']) on conflict (id) do nothing;
drop policy if exists "upload annoncebilleder" on storage.objects;
create policy "upload annoncebilleder" on storage.objects for insert to authenticated
  with check (bucket_id = 'annoncebilleder' and (storage.foldername(name))[1] = auth.uid()::text);

-- DAGLIG BRUG
--   select * from verification_queue;
--   select decide_verification('<bruger-id>', true);
--   select decide_verification('<bruger-id>', false, 'Nummeret findes ikke i registret');
