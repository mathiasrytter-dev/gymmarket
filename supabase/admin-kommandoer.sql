-- Nyttige kommandoer (kør enkeltvis efter behov – IKKE en migration)

-- Slå betaling til i ét land / alle lande
-- update markets set payments_enabled = true where country = 'DK';
-- update markets set payments_enabled = true;

-- Ændr en annoncepris
-- update tier_prices set amount = 99 where tier = 'medium' and currency = 'DKK';

-- Nye anmeldelser
-- select * from reports where status = 'ny' order by created_at;

-- Hvor mange annoncer kommer fra Facebook?
-- select count(*) filter (where source_url is not null) as fra_facebook, count(*) as i_alt from listings;
