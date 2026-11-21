# Quiz spin API

Backend API for Quiz spin, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Jemy Anne Genodia (genodiajemyanne-bot), BSCS 3-1 
- Group and game concept: Group 7

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |
| Validation and logging | express-validator, morgan |
| API testing | Postman |

## Setup

```
git clone https://github.com/genodiajemyanne-bot/Quiz-spin-api.git
cd Quiz-spin-api
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints

Base URL: `http://localhost:3001/api/v1`

### Hub Contract v1.2

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

### Module 1: question sets (Week 11)

Until login is built in Week 12, a caller says who they are with the `X-Demo-User` header, which holds the school ID of a seeded account. This is not security.

| Method | Path | Purpose | Who may call it | Success |
|---|---|---|---|---|
| GET | /question-sets | List question sets | A host (own sets) or an admin (all sets) | 200 |
| POST | /question-sets | Create a question set | A host or an admin | 201 |
| GET | /question-sets/{id} | Read one question set | The owner or an admin | 200 |
| PATCH | /question-sets/{id} | Change a question set | The owner or an admin | 200 |
| DELETE | /question-sets/{id} | Delete a question set | The owner or an admin | 204 |

### Module 2: sessions and joining (Week 11)

A game is found by its six-digit join code, never by its id.

| Method | Path | Purpose | Who may call it | Success |
|---|---|---|---|---|
| POST | /sessions | Start a game. The server makes the code. | The owner of the question set, or an admin | 201 |
| GET | /sessions/{code} | Read one game | Anyone | 200 |
| PATCH | /sessions/{code} | Change the status (waiting to active to completed) | The host of that game, or an admin | 200 |
| POST | /sessions/{code}/players | Join a game, or rejoin it | Any known account | 201 (new seat), 200 (rejoin) |
| GET | /sessions/{code}/players | List nicknames and scores | Anyone | 200 |

### Error format

Every failure answers in one shape:

```
{ "error": { "code": "NICKNAME_TAKEN", "message": "That nickname is already used in this game." } }
```

| Status | When |
|---|---|
| 400 | The request is malformed or breaks a validation rule |
| 401 | No account was named in the request |
| 403 | The account may not do this |
| 404 | The row named in the URL does not exist |
| 409 | The request clashes with the current state, for example a taken nickname |

## Testing with Postman

The collection is in `postman/QuizSpin-API-Week11.postman_collection.json`.

1. Run `npm run db:reset`, then `npm run dev`.
2. In Postman, import the collection file.
3. Open the collection's Variables tab and check that `baseUrl` is `http://localhost:3001/api/v1`. The variables `host`, `otherHost` and `player` hold school IDs from the seed data.
4. Click the three dots beside the collection, choose Run collection, then Run. Every test passes.

## What "completed" means in my game

A player completed the game when they answered every question in the question set. A game is finished when its status is `completed` and `ended_at` is filled in.

## Tables

| Table | What it stores |
|---|---|
| users | Accounts of hosts and players (school_id, full_name, email, password_hash, role of host or player) |
| question_sets | A quiz made by a host (host_id, title, description) |
| questions | Multiple-choice questions in a set (question_text, choice_a to choice_d, correct_choice A to D, points) |
| game_sessions | One play of a question set (join_code, status of waiting, active or completed, started_at, ended_at) |
| players | A user's seat in one game (session_id, user_id, nickname, score, joined_at) |
| answers | One player's answer to one question (player_id, question_id, submitted_choice, is_correct, points_awarded) |

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
