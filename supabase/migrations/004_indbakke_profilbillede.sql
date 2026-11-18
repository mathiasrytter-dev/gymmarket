-- =============================================================
-- GymMarket – 004: indbakke (henvendelser), profilbillede og skjult e-mail
-- Kør i Supabase: SQL Editor -> New query -> Run.
-- Forudsætter, at supabase/schema.sql (version 3) allerede er kørt.
-- Kør denne fil, LIGE FØR du lægger den nye version af siden online.
-- =============================================================

-- ---------- Profilbillede ----------
alter table profiles add column if not exists avatar_url text
  check (avatar_url is null or char_length(avatar_url) < 500);

create or replace function my_profile() returns json language sql security definer set search_path = public as $$
  select to_json(p) from (select id, email, name, user_type, org_name, country, phone, is_trader, trader_company, trader_vat, trader_address,
    avatar_url, org_status, org_country, org_id_type, org_number, vies_valid, created_at from profiles where id = auth.uid()) p; $$;

-- Gemmer kun adresser, der peger på brugerens egen mappe i bucket "avatars"
create or replace function set_avatar(p_url text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform require_user();
  if p_url is null or p_url = '' then
    update profiles set avatar_url = null where id = auth.uid();
  elsif p_url like 'https://%' and p_url like ('%/storage/v1/object/public/avatars/' || auth.uid()::text || '/%') then
    update profiles set avatar_url = p_url where id = auth.uid();
  else
    raise exception 'Ugyldigt format';
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 524288, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "avatars laes" on storage.objects;
create policy "avatars laes" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "avatars upload" on storage.objects;
create policy "avatars upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars slet" on storage.objects;
create policy "avatars slet" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- Offentlige visninger uden e-mail ----------
drop view if exists listings_public;
create view listings_public as
  select l.id, l.created_at, l.lang, l.title, l.category, l.brand, l.year, l.condition, l.price, l.currency, l.new_price,
         l.city, l.postcode, l.country, l.description, l.transport, l.images, l.status, l.expires_at,
         l.owner_id as seller_id, p.avatar_url as seller_avatar,
         case when p.user_type <> 'private' and p.org_name is not null then p.org_name else p.name end as seller_name,
         p.user_type as seller_type, p.phone as contact_phone,
         p.is_trader, p.trader_company, p.trader_vat, p.trader_address,
         (p.org_status = 'approved') as seller_verified,
         case when p.org_status = 'approved' then p.org_country end as org_country,
         case when p.org_status = 'approved' then p.org_id_type end as org_id_type
  from listings l join profiles p on p.id = l.owner_id
  where l.status = 'aktiv' and l.expires_at > now();

drop view if exists wanted_public;
create view wanted_public as
  select w.id, w.created_at, w.title, w.budget, w.area, w.expires_at,
         w.owner_id as seller_id, p.avatar_url as seller_avatar,
         case when p.user_type <> 'private' and p.org_name is not null then p.org_name else p.name end as name,
         (p.org_status = 'approved') as verified
  from wanted w join profiles p on p.id = w.owner_id where w.expires_at > now();

grant select on listings_public, wanted_public to anon, authenticated;

-- ---------- Indbakke ----------
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete set null,
  wanted_id uuid references wanted(id) on delete set null,
  subject text not null,
  starter_id uuid not null references profiles(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  check ((listing_id is not null)::int + (wanted_id is not null)::int <= 1)
);
create unique index if not exists conv_listing_uq on conversations (starter_id, listing_id) where listing_id is not null;
create unique index if not exists conv_wanted_uq on conversations (starter_id, wanted_id) where wanted_id is not null;
create index if not exists conv_owner_idx on conversations (owner_id);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists msg_conv_idx on messages (conversation_id, created_at);
create index if not exists msg_sender_idx on messages (sender_id, created_at);

alter table conversations enable row level security;
alter table messages enable row level security;
revoke all on conversations, messages from anon, authenticated;   -- adgang kun via funktionerne herunder

create or replace function send_message(p_listing uuid, p_wanted uuid, p_body text) returns json
language plpgsql security definer set search_path = public as $$
declare me uuid := require_user(); b text := trim(coalesce(p_body, '')); o uuid; subj text; c conversations;
begin
  if char_length(b) = 0 then raise exception 'Tom besked'; end if;
  if (p_listing is null) = (p_wanted is null) then raise exception 'Ikke fundet'; end if;
  if (select count(*) from messages where sender_id = me and created_at > now() - interval '1 hour') >= 20 then raise exception 'For mange beskeder'; end if;
  if p_listing is not null then
    select owner_id, title into o, subj from listings where id = p_listing and status = 'aktiv' and expires_at > now();
  else
    select owner_id, title into o, subj from wanted where id = p_wanted and expires_at > now();
  end if;
  if not found then raise exception 'Ikke fundet'; end if;
  if o = me then raise exception 'Egen annonce'; end if;
  select * into c from conversations where starter_id = me and ((p_listing is not null and listing_id = p_listing) or (p_wanted is not null and wanted_id = p_wanted));
  if not found then
    insert into conversations (listing_id, wanted_id, subject, starter_id, owner_id) values (p_listing, p_wanted, left(subj, 80), me, o) returning * into c;
  end if;
  insert into messages (conversation_id, sender_id, body) values (c.id, me, left(b, 2000));
  update conversations set last_message_at = now() where id = c.id;
  return json_build_object('conversation_id', c.id);
end $$;

create or replace function reply_message(p_id uuid, p_body text) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := require_user(); b text := trim(coalesce(p_body, '')); c conversations;
begin
  if char_length(b) = 0 then raise exception 'Tom besked'; end if;
  select * into c from conversations where id = p_id and (starter_id = me or owner_id = me);
  if not found then raise exception 'Ingen adgang'; end if;
  if (select count(*) from messages where sender_id = me and created_at > now() - interval '1 hour') >= 20 then raise exception 'For mange beskeder'; end if;
  insert into messages (conversation_id, sender_id, body) values (p_id, me, left(b, 2000));
  update conversations set last_message_at = now() where id = p_id;
end $$;

create or replace function my_conversations() returns setof json
language sql security definer set search_path = public as $$
  select json_build_object(
    'id', c.id, 'subject', c.subject, 'listing_id', c.listing_id, 'wanted_id', c.wanted_id,
    'other_name', case when o.user_type <> 'private' and o.org_name is not null then o.org_name else o.name end,
    'other_avatar', o.avatar_url, 'other_verified', (o.org_status = 'approved'),
    'last_body', lm.body, 'last_at', c.last_message_at, 'last_from_me', (lm.sender_id = auth.uid()),
    'unread', (select count(*) from messages m where m.conversation_id = c.id and m.sender_id <> auth.uid() and m.read_at is null))
  from conversations c
  join profiles o on o.id = case when c.starter_id = auth.uid() then c.owner_id else c.starter_id end
  left join lateral (select body, sender_id from messages where conversation_id = c.id order by created_at desc limit 1) lm on true
  where c.starter_id = auth.uid() or c.owner_id = auth.uid()
  order by c.last_message_at desc;
$$;

create or replace function conversation_thread(p_id uuid) returns json
language plpgsql security definer set search_path = public as $$
declare me uuid := require_user(); c conversations; o profiles; res json;
begin
  select * into c from conversations where id = p_id and (starter_id = me or owner_id = me);
  if not found then raise exception 'Ingen adgang'; end if;
  select * into o from profiles where id = case when c.starter_id = me then c.owner_id else c.starter_id end;
  update messages set read_at = now() where conversation_id = p_id and sender_id <> me and read_at is null;
  select json_build_object(
    'id', c.id, 'subject', c.subject, 'listing_id', c.listing_id, 'wanted_id', c.wanted_id,
    'other_name', case when o.user_type <> 'private' and o.org_name is not null then o.org_name else o.name end,
    'other_avatar', o.avatar_url, 'other_verified', (o.org_status = 'approved'),
    'messages', coalesce((select json_agg(json_build_object('id', m.id, 'mine', (m.sender_id = me), 'body', m.body, 'created_at', m.created_at) order by m.created_at)
                          from messages m where m.conversation_id = p_id), '[]'::json)) into res;
  return res;
end $$;

create or replace function unread_count() returns int
language sql security definer set search_path = public as $$
  select count(*)::int from messages m join conversations c on c.id = m.conversation_id
   where (c.starter_id = auth.uid() or c.owner_id = auth.uid()) and m.sender_id <> auth.uid() and m.read_at is null;
$$;

-- Nye funktioner er som standard åbne for alle: luk dem, og giv kun indloggede adgang
revoke execute on function send_message(uuid, uuid, text), reply_message(uuid, text), my_conversations(),
  conversation_thread(uuid), unread_count(), set_avatar(text), my_profile() from public, anon;
grant execute on function send_message(uuid, uuid, text), reply_message(uuid, text), my_conversations(),
  conversation_thread(uuid), unread_count(), set_avatar(text), my_profile() to authenticated;
