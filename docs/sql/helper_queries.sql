insert into users (username, auth_provider) values ('rowan_the_sigma', 'local');
insert into routines (name) values ('laurels SUPER DUPER routine for getting SWOLE');
insert into user_routines (user_id, routine_id, is_active) values (1, 3, TRUE);
insert into workouts (name) values ('cardio 🤮');
insert into routine_workouts (routine_id, workout_id, day) values (3, 4, 5);
insert into movements (name, type, equipment, difficulty) values ('weighted squats', 'strength', 'barbell', 'intermediate');
insert into workout_movements (workout_id, movement_id, order_num, sets_reps, weight, rest_duration) values (3, 4, 1, '{"sets": 3, "reps": 10}', 90, 30);
insert into muscles (name) values ('gluteus minimus');
insert into movement_muscles (movement_id, muscle_id, priority) values (4, 19, 3);

select * from users;
select * from auth_providers;
select * from user_routines;
select * from routines;
select * from workouts;
select * from routine_workouts;
select * from movements;
select * from workout_movements;
select * from muscles;
select * from movement_muscles;

select
    users.username as user,
    routines.id as routine_id,
    routines.name as routine,
    routine_workouts.day,
    workouts.id as workout_id,
    workouts.name as workout,
    movements.name as movement,
    movements.id as movement_id,
    movements.equipment as equipment,
    workout_movements.weight as weight,
    muscles.name as muscle,
    movement_muscles.priority as muscle_priority
from user_routines
    join routines on user_routines.routine_id = routines.id
    join users on user_routines.user_id = users.id
    join routine_workouts on routines.id = routine_workouts.routine_id
    join workouts on routine_workouts.workout_id = workouts.id
    join workout_movements on workouts.id = workout_movements.workout_id
    join movements on workout_movements.movement_id = movements.id
    left join movement_muscles on movements.id = movement_muscles.movement_id
    left join muscles on movement_muscles.muscle_id = muscles.id
where
    user_routines.user_id = 2
    and user_routines.is_active = TRUE
    and routine_workouts.day = 0;

update user_routines set is_active = FALSE where user_id = 2 and routine_id = 1;
update user_routines set is_active = FALSE where user_id = 2 and routine_id = 1;
update routine_workouts set day = 0 where id = 1;
update movements set name = 'pushup' where id = 1;
update workout_movements set movement_id = 2 where id = 1;

alter table users add first_name VARCHAR(128);
alter table users add last_name VARCHAR(128);
alter table users add email VARCHAR(255) UNIQUE NOT NULL;
alter table users add profile_picture text;

drop DATABASE exnihilo;

delete from users;
