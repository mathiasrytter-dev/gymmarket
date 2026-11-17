-- =============================================================
-- ENGANGS: Slet ALLE testdata før lancering.
-- ⚠️ Kør KUN én gang – lige før siden åbnes for rigtige brugere.
-- ⚠️ Kør den ALDRIG, når der er rigtige annoncer på siden.
-- Indstillinger, lande og priser bevares.
-- =============================================================
begin;
delete from payments;
delete from reports;
delete from wanted;
delete from listings;
delete from storage.objects where bucket_id = 'annoncebilleder';
commit;

-- Kontrol – alle skal give 0:
select (select count(*) from listings) as annoncer,
       (select count(*) from wanted)   as efterlysninger,
       (select count(*) from reports)  as anmeldelser;
