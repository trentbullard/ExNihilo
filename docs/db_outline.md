Users
id
username
authProvider (e.g., Google, Apple)
dateCreated
dateUpdated
(Future: profile picture, bio, measurements, etc.)

Routines
id
name
dateCreated
dateUpdated

UserRoutines
id
userId
routineId
isActive
morningEvening (enum: morning, evening, or any)
lastAccessed
dateCreated
dateUpdated

Muscles
id
name
dateCreated
dateUpdated

Movements
id
name
type (e.g., plyometric, strength, cardio)
equipment (e.g., dumbbell, barbell, bodyweight)
difficulty (e.g., beginner, intermediate, advanced)
url (to instructional video or resource)
creator (nullable, references Users)
isVerified (boolean for static/pre-vetted movements)
dateCreated
dateUpdated

MovementMuscles
id
movementId
muscleId
priority (e.g., 1 for primary, 2 for secondary)
dateCreated
dateUpdated

Workouts
id
name (e.g., "Push Day")
day (integer: 0-6 for Sunday-Saturday)
dateCreated
dateUpdated

WorkoutMovements
id
workoutId
movementId
order
setsReps (JSON: { "sets": 3, "reps": [10, 8, 6] })
restDuration
dateCreated
dateUpdated

CompletedWorkouts
id
userId
workoutId
startTime
endTime
duration (calculated from timestamps)
rating (enum: sad, neutral, happy)
comments (nullable, user notes)
dateCreated
dateUpdated

RoutineWorkouts
id
routineId
workoutId
dateCreated
dateUpdated

Comments (Social Features)
id
userId
content
parentCommentId (nullable for nested replies)
movementId (nullable, if tied to a specific movement)
dateCreated
dateUpdated

Flags (Social Moderation)
id
userId (who flagged)
contentType (e.g., movement, comment)
contentId (ID of flagged item)
reason (e.g., unsafe, inappropriate)
resolutionStatus (enum: pending, resolved, dismissed)
dateCreated
dateUpdated

Achievements/Badges (Gamification)
Placeholder for future implementation.