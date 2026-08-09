# express-cli

A command-line tool that generates Node.js/Express project boilerplate — interactively configured with the features you need.

## Features

- Scaffolds a ready-to-run Express project in seconds
- Optional MongoDB (Mongoose) setup
- Optional JWT authentication (register/login routes, auth middleware, bcrypt password hashing)
- Optional Socket.io real-time setup
- Optional Docker setup (Dockerfile + docker-compose)
- Optional ESLint configuration
- Optional Prettier configuration
- Automatic `npm install`
- Automatic `git init` with an initial commit
- Clean, colorful terminal output

## Installation

Clone the repository and link it globally:

```bash
git clone https://github.com/mateussobucki/express-cli.git
cd express-cli
npm install
npm link
```

This makes the `express-cli` command available anywhere on your machine.

## Usage

```bash
express-cli create <project-name>
```

You'll be walked through a few prompts:

```
✔ Want to include MongoDB configuration? Yes
✔ Want to include JWT configuration? Yes
✔ Want to include Socket.io configuration? No
✔ Want to include Docker configuration? Yes
✔ Want to include ESLint configuration? Yes
✔ Want to include Prettier configuration? Yes
✔ Install dependencies now (npm install)? Yes
✔ Initialize a git repository? Yes
```

Based on your answers, `express-cli` generates a complete project structure, installs dependencies, and initializes git — ready to run.

```bash
cd <project-name>
npm run dev
```

## Generated project structure

```
<project-name>/
├── src/
│   ├── routes/
│   │   └── authRoutes.js         # only if JWT is selected
│   ├── models/
│   │   └── User.js               # only if MongoDB is selected
│   ├── controllers/
│   │   └── authController.js     # only if JWT is selected
│   └── middlewares/
│       └── authMiddleware.js     # only if JWT is selected
├── server.js
├── package.json
├── eslint.config.js              # only if ESLint is selected
├── .prettierrc                   # only if Prettier is selected
├── .prettierignore               # only if Prettier is selected
├── Dockerfile                    # only if Docker is selected
├── docker-compose.yml            # only if Docker is selected
├── .dockerignore                 # only if Docker is selected
├── .env.example
└── .gitignore
```

## Options

| Option | What it adds |
|---|---|
| MongoDB | Mongoose connection setup, `User` model, `MONGO_URI` in `.env.example` |
| JWT | `/auth/register` and `/auth/login` routes (controller + routes split), password hashing with bcrypt, auth middleware, `JWT_SECRET` in `.env.example` |
| Socket.io | HTTP server wrapped with Socket.io, basic connection handler |
| Docker | `Dockerfile`, `docker-compose.yml` (with a MongoDB service if MongoDB is also selected), and `.dockerignore` |
| ESLint | `eslint.config.js` (flat config), `eslint` and `@eslint/js` added as dev dependencies, `lint` script added to `package.json` |
| Prettier | `.prettierrc`, `.prettierignore`, `prettier` added as a dev dependency, `format` script added to `package.json` |

## Tech stack

Built with:

- [Commander](https://github.com/tj/commander.js) — command-line argument parsing
- [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js) — interactive prompts
- [Chalk](https://github.com/chalk/chalk) — terminal styling
- [Ora](https://github.com/sindresorhus/ora) — terminal spinners

## License

MIT
