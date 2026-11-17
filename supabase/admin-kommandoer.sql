-- Nyttige kommandoer – kør enkeltvis efter behov (ikke en migration)

-- Nye anmeldelser
-- select * from reports where status = 'ny' order by created_at;
-- Afgør en anmeldelse og fjern annoncen (giv sælger besked med begrundelsen)
-- update reports set status = 'behandlet', decision = 'Fjernet: ...', decided_at = now() where id = '...';
-- update listings set status = 'udloebet' where id = '...';

-- Seneste annoncer
-- select created_at, title, country, price, currency, seller_name, contact_email from listings order by created_at desc limit 50;

-- Hvor mange annoncer kommer fra Facebook?
-- select count(*) filter (where source_url is not null) as fra_facebook, count(*) as i_alt from listings;

-- Slå betaling til i ét land / alle lande (varsl brugerne 30 dage før)
-- update markets set payments_enabled = true where country = 'DK';
-- update markets set payments_enabled = true;

-- Ændr en annoncepris
-- update tier_prices set amount = 99 where tier = 'medium' and currency = 'DKK';

-- Ændr hvor længe en annonce er aktiv
-- update settings set listing_days = 60 where id = 1;
