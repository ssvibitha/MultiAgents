# MultiAgents

This repository is a Next.js + Prisma e-commerce sample app using PostgreSQL.

## Prerequisites

- Node.js 18 or newer
- npm
- A PostgreSQL database (Neon is recommended for a cloud database)

## Local setup

1. Clone the repository and install dependencies:

```bash
cd MultiAgents
npm install
```

2. Create a `.env` file from the example:

```bash
copy .env.example .env
```

3. Configure your database connection:

- If you use Neon, create a new project and branch.
- In the Neon dashboard, click `Create project`, choose a name, and then create a branch.
- From the branch details page, copy the PostgreSQL connection string.
- Paste that string into `.env` as `DATABASE_URL`.

Example `DATABASE_URL` format:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?schema=public
```

### Neon specific setup

If you are connecting to Neon, follow these steps:

1. Sign in at https://neon.tech and create a project.
2. Create a new branch for your local development database.
3. Open the branch and click `Connect`.
4. Copy the `PostgreSQL` connection string.
5. Paste the value into your `.env` file as `DATABASE_URL`.

Neon connection strings often look like this:

```env
DATABASE_URL=postgresql://user:password@ep-branch-name.adb.neon.tech:5432/dbname?schema=public
```

4. Set a session secret and local app URL in `.env`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some-long-random-string-without-spaces
```

5. Optional Google auth settings:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Prisma setup

Run Prisma commands to generate the client, apply schema migrations, and seed the database.

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

If you prefer to create the schema directly without migrations (for a fresh database), use:

```bash
npx prisma db push
npx prisma db seed
```

## Seed database

The repository already includes a seed script at `scripts/seed.js` and a Prisma seed configuration in `package.json`.

The seed command will create categories, tags, products, and product images.

```bash
npx prisma db seed
```

## Run the app locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Notes

- If you change the Prisma schema, run `npx prisma generate` again.
- If the DB is empty, use `npx prisma migrate deploy` first, then `npx prisma db seed`.
- For Neon, use a dedicated database branch and keep your `DATABASE_URL` secret.

