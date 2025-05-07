# 🏪 versator • next.js ecommerce starter

[demo](https://versator.relivator.com) — [sponsor](https://github.com/sponsors/blefnk) — [discord](https://discord.gg/Pb8uKbwpsJ) — [github](https://github.com/blefnk/versator) — [docs](https://deepwiki.com/blefnk/versator-nextjs-template)

> **versator** template serves as the foundation for your ecommerce platform, helping you create efficient, engaging, and profitable online stores. versator enhances any ecommerce with the power of modern tech stack.

## stack

1. 🧱 **core**: [nextjs 15.3](https://nextjs.org) + [react 19.1](https://react.dev) + [ts 5.8](https://typescriptlang.org)
2. 🎨 **ui**: [tailwind 4.1](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
3. 🔒 **auth**: [clerk](https://clerk.com)
4. 🎬 **anims**: [motion](https://motion.dev)
5. 📦 **storage**: [uploadthing](https://uploadthing.com)
6. 📊 **analytics**: [vercel](https://vercel.com/docs/analytics)
7. 🧬 **db**: [drizzle-orm](https://orm.drizzle.team) ([pg](https://neon.tech/postgresql/tutorial)) + [neon](https://neon.tech)/(🤔🔜)[supabase](https://supabase.com)
8. 🏗️ **dx**: [eslint](https://eslint.org) + [biome](https://biomejs.dev) + [knip](https://knip.dev)
9. 📝 **forms**: [react-hook-form](https://react-hook-form.com) + [zod](https://zod.dev) _(🔜 w.i.p)_
10. 📅 **tables**: [react-table](https://tanstack.com/table) + [bazza/ui](https://ui.bazza.dev)
11. 🌐 **i18n**: [next-intl](https://next-intl.dev) _(🔜 w.i.p)_
12. 💌 **email**: [resend](https://resend.com) _(🔜 w.i.p)_
13. 💳 **payments**: [stripe](https://stripe.com) _(🔜 w.i.p)_
14. 🔑 **api**: [trpc](https://trpc.io) _(🔜 w.i.p)_
15. 🧩 **webhooks**: [svix](https://docs.svix.com/receiving/verifying-payloads/why) _(🔜 w.i.p)_
16. 🔃 **redis**: [upstash](https://upstash.com)
17. 🛡️ **env**: [fatima](https://fatimajs.vercel.app/docs) _(🔜 w.i.p)_

> these features define the secondary reliverse stack. for an alternative setup—featuring better-auth, polar, orpc, and more—check out [relivator](https://github.com/blefnk/relivator).

## quick start

1. install [git](https://git-scm.com), [node.js](https://nodejs.org), [bun](https://bun.sh).
2. run:

   ```bash
   git clone https://github.com/blefnk/versator.git
   cd versator
   bun install
   copy .env.example .env
   ```

3. fill in the required environment variables in the `.env` file.
4. optionally, edit the `src/app.ts` file to make the app yours.
5. run:

   ```bash
   bun db:push # populate db with schema
   bun dev:stripe # start stripe webhook server
   bun dev # start app development server
   bun run build # build production version
   ```

6. edit something in the code manually or ask ai to help you.
7. done. seriously. you're building now.

<!-- 
2. run:
   ```bash
   bun i -g @reliverse/cli
   reliverse cli
   ```
3. select **"create a new project"**.
4. follow prompts to configure your store.
-->

### commands

| command         | description                    |
|-----------------|--------------------------------|
| `bun dev`       | start local development        |
| `bun build`     | create a production build      |
| `bun latest`    | install latest deps            |
| `bun ui`        | add shadcn components          |
| `bun db:push`   | apply db schema changes        |
| `bun db:studio` | open visual db editor          |

## notes

- versator 1.1.0+ is ai-ready — optimized for ai-powered ides like cursor, making onboarding effortless even for beginners.

## stand with ukraine

- 💙 help fund drones, medkits, and victory.
- 💛 every dollar helps stop [russia's war crimes](https://war.ukraine.ua/russia-war-crimes) and saves lives.
- ‼️ please, [donate now](https://u24.gov.ua), it matters.

## stand with reliverse

- ⭐ [star the repo](https://github.com/blefnk/versator) to help the reliverse community grow.
- 😉 follow this project's author, [nazar kornienko](https://github.com/blefnk) and his [reliverse](https://github.com/reliverse) ecosystem, to get updates about new projects faster.
- 🦄 [become a sponsor](https://github.com/sponsors/blefnk) and power the next wave of tools that _just feel right_.

> every bit of support helps keep the dream alive: dev tools that don't suck.

## license

mit © 2025 [nazar kornienko (blefnk)](https://github.com/blefnk), [reliverse](https://github.com/reliverse)
