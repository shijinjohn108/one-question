-- Optional local development seed. The auth UUID must be a real auth.users UUID in an actual project.
insert into public.questions (id,prompt,status,opens_at) values ('00000000-0000-0000-0000-000000000001','Would you erase your worst memory if you could?','live',now()) on conflict do nothing;
insert into public.question_options(question_id,label,position) values
('00000000-0000-0000-0000-000000000001','Yes — some pain does not deserve to stay.',0),
('00000000-0000-0000-0000-000000000001','No — it is part of who I became.',1) on conflict do nothing;
