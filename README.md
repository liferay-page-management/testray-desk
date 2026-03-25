<div align="center">

<img width="150px" alt="Testray Desk logo" src="public/logo.svg">

# Testray Desk

**Testray Desk** is a lightweight tool for managing and analyzing test results from Liferay’s Testray.

[![typescript_badge_url]][typescript_url]
[![next_badge_url]][next_url]
[![shadcn_badge_url]][shadcn_url]
[![tailwind_badge_url]][tailwind_url]

</div>

## 🔧 Setup

1. Clone the repository:

```bash
git clone git@github.com:liferay-page-management/testray-desk.git
```

2. In the root of the repository, create a `.env.local` file with the following variables for Testray credentials:

```dotenv
TESTRAY_CLIENT_ID=your-id
TESTRAY_CLIENT_SECRET=your-secret
```

3. Go to the repository directory and install dependencies (only needed the first time):

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open the app in your browser at:

```text
http://localhost:3000
```

<!-- Links -->

[next_badge_url]: https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white

[tailwind_badge_url]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white

[typescript_badge_url]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white

[shadcn_badge_url]: https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white

[next_url]: https://nextjs.org/
[tailwind_url]: https://tailwindcss.com/
[typescript_url]: https://www.typescriptlang.org/
[shadcn_url]: https://ui.shadcn.com/