Setup CratzCode Stack

Tech Stack:
Next.js
tRPC
Tanstack Query
Drizzle ORM
Postgres
Better-Auth
Tailwind CSS
Shadcn
Expo

Stack Components
Below is an overview of the project structure and its key components:
```
apps
  ├─ docs
  |   ├─ Next.js 15
  |   ├─ React 19
  |   ├─ Tailwind CSS
  |   └─ E2E Typesafe API Server & Client
  └─ web
  |   ├─ Next.js 15
  |   ├─ React 19
  |   ├─ Tailwind CSS
  |   └─ E2E Typesafe API Server & Client
  ├─ mobile
  |   ├─ Expo SDK 51
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using NativeWind
  |   └─ Typesafe API calls using tRPC
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Better-Auth
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Neon Tech
  └─ ui
  |   └─ UI package for the webapp using shadcn-ui
config
  ├─ eslint-config
  │    └─ Shared, fine-grained ESLint presets
  ├─ prettier-config
  │    └─ Shared Prettier configuration
  ├─ tailwind-config
  │    └─ Shared Tailwind CSS configuration
  └─ typescript-config
       └─ Shared TSConfig to extend from
```
# Package Managers in Turborepo: pnpm vs Bun

Turborepo works with various package managers, with pnpm and Bun being popular choices for monorepo management. This document explains their differences, particularly regarding dependency hoisting and `node_modules` structure.

## pnpm in Turborepo

### Basic Usage

```bash
# Install all dependencies in all workspaces
pnpm install

# Install a specific dependency in all workspaces
pnpm add -w lodash

# Install dependencies in a specific workspace
pnpm --filter=my-app install

# Add a specific dependency to a specific workspace
pnpm --filter=my-app add react

# Run a specific task across all packages
pnpm turbo run build
```

### Dependency Structure

pnpm uses a unique "symlinked" structure:

- Dependencies are stored in a global store (`.pnpm` folder)
- Each package has its own `node_modules` folder
- Dependencies are symlinked from the store to each package's `node_modules`
- By default, pnpm uses strict isolation with a "phantom" dependency prevention

```
project/
├── node_modules/
│   ├── .pnpm/ (content store)
│   └── [symlinks to direct dependencies]
├── packages/
│   ├── app1/
│   │   ├── node_modules/ (symlinks to app1's deps)
│   │   └── package.json
│   └── app2/
│       ├── node_modules/ (symlinks to app2's deps)
│       └── package.json
└── package.json
```

## Bun in Turborepo

### Basic Usage

```bash
# Install all dependencies in all workspaces
bun install

# Install a specific dependency in all workspaces
bun add -w lodash

# Install dependencies in a specific workspace
bun install --cwd packages/my-app

# Add a specific dependency to a specific workspace
bun add react --cwd packages/my-app

# Run a specific task across all packages
bun turbo run build
```

### Dependency Structure

Bun uses a full hoisting approach to dependency management by default:

- All dependencies are hoisted to the root `node_modules` folder
- Packages typically don't have their own `node_modules` directories
- This creates a flat dependency structure similar to npm's hoisting

```
project/
├── node_modules/ (all hoisted dependencies)
├── packages/
│   ├── app1/
│   │   └── package.json
│   └── app2/
│       └── package.json
└── package.json
```

## Key Differences

| Feature | pnpm | Bun |
|---------|------|-----|
| Default hoisting | None (strict isolation) | Full (all deps hoisted to root) |
| Disk efficiency | Very high (content-addressable store) | Good (hoisting reduces duplication) |
| Installation speed | Fast | Very fast (often 2-5x faster than pnpm) |
| Node modules structure | Symlinked from central store | Single root node_modules |
| Phantom dependency prevention | Built-in protection | Less strict (like npm/Yarn) |
| Configuration complexity | More options, more complex | Simpler options |

## Practical Implications

### When to Choose pnpm in Turborepo

- When strict dependency isolation is critical
- When you need guaranteed prevention of phantom dependencies
- When disk space efficiency is a primary concern
- When you require fine-grained control over hoisting behavior

### When to Choose Bun in Turborepo

- When installation speed is the top priority
- When you prefer a simpler configuration with fewer options
- When you want familiar npm/Yarn-like behavior but with better performance
- When your project already works well with traditional hoisting approaches

## Performance Comparison

Bun generally offers faster installation times, while pnpm provides better disk space efficiency:

- Bun: Optimized for speed, often 2-5x faster than pnpm for installations
- pnpm: Optimized for disk usage, can save significant space in large monorepos

## Conclusion

Both package managers work well with Turborepo, but they take different approaches to dependency management:

- **pnpm** prioritizes correctness and isolation with its unique symlink structure
- **Bun** prioritizes speed and simplicity with a more traditional but highly optimized approach

Your choice between them should depend on your project's specific needs regarding dependency isolation, installation speed, and disk space efficiency.

1.  Create Turborepo Project
    - Install `turbo` globally [Turbo Installation](https://turbo.build/repo/docs/getting-started/installation#installing-turbo)
    - CLI: `pnpm dlx create-turbo@latest craftzcode-stack`
    - Package Manager: `Bun`
    - Update Dependencies in all Workspace: `bun update`
  
2. Protect the main branch
   - Option 1: Add Husky (Pre-Commit) for Automation of Git Commit
     - CLI: `bun add --dev husky`
     - Init Husky: `bunx husky init`
     - Add this script inside of `.husky/pre-commit`.
       ```sh
       # Get the current branch name
       current_branch=$(git rev-parse --abbrev-ref HEAD)

       if [ "$current_branch" = "main" ]; then
         echo "Warning: You are about to commit on the 'main' branch."
         read -p "Would you like to create a new branch for these changes? (y/n): " answer

         if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
           # Prompt for a new branch name; generate one if none is provided.
           read -p "Enter the new branch name (or leave empty for a generated name): " new_branch
           if [ -z "$new_branch" ]; then
             new_branch="feature-$(date +%Y%m%d%H%M%S)"
             echo "No branch name provided. Using generated branch name: $new_branch"
           fi
           # Create and switch to the new branch
           git checkout -b "$new_branch"
           echo "Switched to new branch '$new_branch'. Please run your commit again on the new branch."
           exit 1  # Abort the commit so you can commit on the new branch
         else
           # Extra security confirmation before committing on main branch
           echo "You chose to commit on the 'main' branch."
           read -p "Are you absolutely sure you want to commit on main? Type 'confirm' to proceed: " confirm
           if [ "$confirm" != "confirm" ]; then
             echo "Commit aborted. Please create a new branch or type 'confirm' to commit on main."
             exit 1  # Abort the commit
           fi
           echo "Proceeding with commit on 'main'."
         fi
       fi
  
       exit 0
       ```
       
   - Option 2: Go to the  `Preferences > VS Code Settings` search for the `Git Branch Protection` and add the `main` in the list.

3.  Remove bolierplates and add script for `clean` and running dev with filtering both `docs` and `web`
    - Remove boilerplates
      - Delete `page.module.css` and all of code inside of `page.tsx` both on `docs and web`.
      - GIT COMMIT: `git commit -m "refactor(docs, web): delete boilerplates"`

    - Add `paths` in `compilerOptions` of `tsconfig.json` both `docs` and `web`
      ```json
      "paths": {
        "@/*": ["./src/*"]
      }
      ```
      - GIT COMMIT: `git commit -m "refactor(docs, web): add paths in compilerOptions of tsconfig"`

    - Add clean script
      - Add the clean script in all workspace `package.json`.
        ```json
        "clean": "git clean -xdf .cache .turbo node_modules"
        ```
      - Add this clean scripts in the root `package.json` of your turborepo there's three options.
        - Option 1: When using `pnpm` package manager.
          ```json
          "scripts": {
            "clean": "git clean -xdf node_modules",
            "clean:workspaces": "turbo run clean"
          }
          ```
        - Option 2: When using `bun` package manager.
          ```json
          "scripts": {
            "clean": "bunx turbo run clean && git clean -xdf .cache .turbo node_modules"
          }
          ```
          - Option 3: Install `turbo` globally [Turbo Installation](https://turbo.build/repo/docs/getting-started/installation#installing-turbo) to work the `turbo` command properly. 
      - Also add the clean script in `turbo.json`.
        ```json
        "tasks": {
          "clean": {
            "cache": false
          },
        }
        ```
      - GIT COMMIT: `git commit -m "chore(package): add clean script to all workspaces"`
      - Add the script for running dev with filtering `docs` or `web`
        ```json
        "dev:docs": "turbo run dev -F docs",
        "dev:web": "turbo run dev -F web",
        ```
      - GIT COMMIT: `git commit -m "chore(package): add workspace-specific dev scripts"`

4.  Create a Github Repository
    - Add the github repository to the project and push the main branch.

5.  Add Cursor Rules, Rename Workspace, Configure Typescript & Eslint
    - GIT BRANCH: `git checkout -b infrastructure/chore/1-cursor-alias-config`
      
    - Add Cursor Rules
      - Copy all of my cursor rules in `.cursor/rules/{rules}.mdc`.
      - GIT COMMIT: `feat(cursor): add custom rules for Cursor AI Editor`

    - Rename Package Imports
      - Rename all instances of `@repo` to `@craftzcode` in the project. This ensures that imports will look like `@craftzcode/ui`.
      - GIT COMMIT: `git commit -m "refactor(alias): rename @repo to @craftzcode"`

    - Configure TypeScript & ESLint
      - Create a new folder named `config` in the root of your project.
      - Move the `typescript-config` and `eslint-config` into the `config` folder.
      - Create a `internal-library.json` in `config/typescript-config` directory to centralize custom TypeScript settings for internal libraries.
        ```json
        {
          "$schema": "https://json.schemastore.org/tsconfig",
          "extends": "./base.json",
          "compilerOptions": {
            // Use this path mapping to automatically generate compiled files in the correct location.
            // All compiled TypeScript files for a package will be output into the `dist` folder of that specific package (e.g., packages/api/dist).
            "outDir": "${configDir}/dist",
            "module": "Preserve",
            "moduleResolution": "Bundler"
          }
        }
        ```
      - Add the `config` folder to `workspaces` in the `package.json` of the root of your project.
        ```json
        "workspaces": [
          "apps/*",
          "packages/*",
          "config/*"
        ]
        ```
      - Reinstall packages.
        - CLI: `bun install`
    
      - GIT COMMIT: `git commit -m "chore(config): move typescript and eslint configs to config folder"`

    - PULL REQUEST TITLE: `chore(infrastructure): add cursor rules, update aliases, and reorganize configs`

6.  Setup Prettier, Tailwind CSS, and Shadcn UI Shared Configs
    ```
    craftzcode-stack/
    ├── config/
    │ ├── prettier-config/
    │ │ ├── index.js
    │ │ └── package.json
    │ └── tailwind-config/
    │ ├── package.json
    │ ├── postcss.config.mjs
    │ └── style.css
    ├── packages/
    │ └── ui/ (shared shadcn-ui package)
    │ ├── package.json
    │ ├── tsconfig.json
    │ └── src/
    │ ├── lib/
    │ │ └── utils.ts
    │ ├── components/ (all existing components here should be deleted)
    │ └── hooks/ (if any)
    ├── turbo.json (with additional commands: ui-add & clean)
    └── package.json (root, with shared scripts)
    ```

    - GIT BRANCH: `git checkout -b infrastructure/chore/2-shared-config`

    - Create the Prettier Config Package
      - Create a folder called `prettier-config` inside the `config` folder.
      - Inside `config/prettier-config`, create a `package.json` file with the following content.
        ```json
        {
          "name": "@craftzcode/prettier-config",
          "version": "0.0.0",
          "private": true,
          "type": "module",
          "exports": {
            ".": "./index.js"
          },
          "scripts": {
            "lint": "next lint --max-warnings 0",
            "clean": "git clean -xdf .cache .turbo node_modules"
          },
          "devDependencies": {
            "@craftzcode/eslint-config": "*"
          },
          "prettier": "@craftzcode/prettier-config"
        }
        ```
      - Go to the location of your `prettier-config` folder in shell then install `prettier` and `plugins`.
        ```shell
        bun add -D prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss
        ```
      - Inside the `config/prettier-config` folder, create an `index.js` file with the following content.
        ```js
        /** @typedef {import("prettier").Config} PrettierConfig */
        /** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
        /** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

        /** @type {PrettierConfig|SortImportsConfig|TailwindConfig} */
        const config = {
          arrowParens: "avoid",
          bracketSpacing: true,
          endOfLine: "lf",
          jsxSingleQuote: true,
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          trailingComma: "none",
          printWidth: 100,
          proseWrap: "preserve",
          quoteProps: "as-needed",
          plugins: [
            "@ianvs/prettier-plugin-sort-imports",
            "prettier-plugin-tailwindcss",
          ],
          importOrder: [
            // React imports
            "^(react/(.*)$)|^(react$)",
            "",
            // Next.js imports
            "^(next/(.*)$)|^(next$)",
            "",
            // React Native imports
            "^(react-native(.*)$)",
            // Expo imports
            "^(expo(.*)$)|^(expo$)",
            "",
            // Third-party modules
            "<THIRD_PARTY_MODULES>",
            "",
            // tRPC and TanStack libraries
            "^(@trpc/(.*)$)|^(@trpc$)|^(@tanstack/(.*)$)|^(@tanstack$)",
            "",
            // Database-related imports (Drizzle ORM)
            "^(drizzle-orm/(.*)$)|^(drizzle-orm$)|^(@/db/(.*)$)|^(@/db$)",
            "",
            // Project API modules
            "^@@craftzcode/api/(.*)$",
            "",
            // Project DB modules
            "^@@craftzcode/db/(.*)$",
            "",
            // Project auth modules
            "^@@craftzcode/auth/(.*)$",
            "",
            // Project module imports
            "@/modules(.*)$",
            "",
            // Project feature imports
            "^@/features/(.*)$",
            "",
            // Project utility libraries
            "^@/lib/(.*)$",
            "",
            // Project hooks
            "^@/hooks/(.*)$",
            "",
            // Form-related libraries
            "react-hook-form$",
            "zod$",
            "@hookform$",
            "",
            // UI components
            "^@@craftzcode/ui/(.*)$",
            "^@/components/(.*)$",
            "",
            // Public assets
            "^@/public/(.*)$",
            "",
            // Relative imports
            "^[./]",
          ],
          importOrderSeparation: false,
          importOrderSortSpecifiers: true,
          importOrderBuiltinModulesToTop: true,
          importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
          importOrderMergeDuplicateImports: true,
          importOrderCombineTypeAndValueImports: true,
        };

        export default config;
        ```
      - Add `"@craftzcode/prettier-config": "*"` in the `devDependencies` of `package.json` where workspace are you currently working on it.
      - Add `"prettier": "@craftzcode/prettier-config"` in the `package.json` where workspace are you currently working on it.
      - GIT COMMIT: `git commit -m "chore(prettier): add shared prettier config for all workspaces"`

    - Create the Tailwind CSS Config Package
      - Inside the `config` folder, create a new folder named `tailwind-config`.
      - Inside `config/tailwind-config`, create a `package.json` file with the following content.
        ```json
        {
          "name": "@craftzcode/tailwind-config",
          "version": "0.1.0",
          "private": true,
          "type": "module",
          "exports": {
            "./style.css": "./style.css",
            "./postcss.config.mjs": "./postcss.config.mjs"
          },
          "scripts": {
            "lint": "next lint --max-warnings 0",
            "clean": "git clean -xdf .cache .turbo node_modules"
          },
          "devDependencies": {
            "@craftzcode/eslint-config": "*",
            "@craftzcode/prettier-config": "*",
            "eslint": "^9.22.0"
          },
          "prettier": "@craftzcode/prettier-config"
        }
        ```
      - Go to the location of your `tailwind-config` folder in shell then install `tailwind`.
        ```shell
        bun add -D tailwindcss @tailwindcss/postcss
        bun add tw-animate-css
        ```
      - Inside the `config/tailwind-config` folder, create a file named `postcss.config.mjs` with the following content.
        ```js
        const config = {
          plugins: ["@tailwindcss/postcss"],
        };

        export default config;
        ```
      - Inside the same `config/tailwind-config` folder, create a file named `style.css` and copy and paste the content of `globals.css` in the existing next.js project with a latest shadcn and add also this `@source '../../packages/ui';` to include the shadcn shared config in `packages/ui`.
      - Add `"@craftzcode/tailwind-config": "*"` in the `devDependencies` of `package.json` where web apps are you currently working on it.
      - Add `@import "@craftzcode/tailwind-config/style.css";` in the `globals.css` where web apps are you currently working on it.
      - GIT COMMIT: `git commit -m "chore(tailwind): add shared tailwind css config for all workspaces"`

    - Setup shared shadcn-ui
      - Delete all files inside the `packages/ui/src/components` folder to prepare for shadcn-ui’s generated components.
      - Replace the contents of `packages/ui/package.json` with the following code.
        ```json
        {
          "name": "@craftzcode/ui",
          "version": "0.0.0",
          "private": true,
          "exports": {
            "./lib/*": "./src/lib/*.ts",
            "./components/*": "./src/components/*.tsx",
            "./hooks/*": "./src/hooks/*.ts"
          },
          "scripts": {
            "ui-add": "bunx --bun shadcn@latest add",
            "postui-add": "prettier src --write --list-different",
            "generate:component": "turbo gen react-component",
            "lint": "eslint . --max-warnings 0",
            "clean": "git clean -xdf .cache .turbo node_modules"
            "check-types": "tsc --noEmit"
          },
          "devDependencies": {
            "@craftzcode/eslint-config": "*",
            "@craftzcode/typescript-config": "*",
            "@craftzcode/tailwind-config": "*",
            "@craftzcode/prettier-config": "*",
            "@turbo/gen": "^2.4.4",
            "@types/node": "^22.13.10",
            "@types/react": "19.0.10",
            "@types/react-dom": "19.0.4",
            "eslint": "^9.22.0",
            "typescript": "5.8.2"
          },
          "dependencies": {
            "react": "^19.0.0",
            "react-dom": "^19.0.0"
          },
          "prettier": "@craftzcode/prettier-config"
        }
        ```
      - Go to the location of your `packages/ui` folder in shell then install shadcn-ui additional dependencies
        ```shell
        bun add class-variance-authority clsx tailwind-merge lucide-react
        ```
      - Edit (or create) the `tsconfig.json` file inside `packages/ui` with the following content.
        ```json
        {
          "extends": "@craftzcode/typescript-config/react-library.json",
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@craftzcode/ui/*": ["./src/*"]
            }
          },
          "include": ["."],
          "exclude": ["node_modules", "dist"]
        }
        ```
      - Inside `packages/ui/src/lib`, create a file named `utils.ts` with the following content.
        ```ts
        import { clsx, type ClassValue } from "clsx";
        import { twMerge } from "tailwind-merge";

        export function cn(...inputs: ClassValue[]) {
          return twMerge(clsx(inputs));
        }
        ```
      - Inside the `packages/ui` folder, create a file named `components.json` with the following content.
        ```json
        {
          "$schema": "https://ui.shadcn.com/schema.json",
          "style": "new-york",
          "rsc": true,
          "tsx": true,
          "tailwind": {
            "config": "",
            "css": "../../config/tailwind-config/style.css",
            "baseColor": "neutral",
            "cssVariables": true,
            "prefix": ""
          },
          "aliases": {
            "components": "@craftzcode/ui/components",
            "utils": "@craftzcode/ui/lib/utils",
            "ui": "@craftzcode/ui/components",
            "lib": "@craftzcode/ui/lib",
            "hooks": "@craftzcode/ui/hooks"
          },
          "iconLibrary": "lucide"
        }
        ```
      - Add the ui-add script to your root `package.json` of your turborepo.
        ```json
        "scripts": {
          "ui-add": "turbo run ui-add -F @craftzcode/ui --",
        }
        ```
      - Add the ui-add script to your turbo.json.
        ```json
        "tasks": {
          "ui-add": {
            "cache": false,
            "interactive": true
            },
          }
        }
        ```
      - GIT COMMIT: `git commit -m "chore(turbo): add ui-add script both root turbo.json and packages.json"`
      - Add all shadcn components.
        - CLI: `bun run ui-add`
        - Select all.
      - GIT COMMIT: `git commit -m "chore(shadcn): remove original files in packages/ui and setup shadcn"`

    - PULL REQUEST TITLE: `chore(infrastructure): add shared prettier & tailwind configs and setup shadcn in packages/ui`

    - How to use all shared config
      - Prettier Shared Config
        1. Always add `"@craftzcode/prettier-config": "*"` in the `devDependencies` of `package.json` where workspace are you currently working on it.
        2. Always add `"prettier": "@craftzcode/prettier-config"` in the `package.json` where workspace are you currently working on it.
      - Tailwind CSS Shared Config
        1. Always add `"@craftzcode/tailwind-config": "*"` in the `devDependencies` of `package.json` where web apps are you currently working on it.
        2. Always add `@import "@craftzcode/tailwind-config/style.css";` in the `globals.css` where web apps are you currently working on it.
      - Typescript and Eslint Shared Config
        - Always add `typescript`, `"@craftzcode/typescript-config": "*"` and `eslint`, `"@craftzcode/eslint-config": "*"` on the `package.json` where workspace are you currently working on it.

7.  Add full `metadata` and change `font family`
    - GIT BRANCH: `git checkout -b frontend/feat/3-metadata-manifest-font-family`
      
    - Update both root `layout.tsx` of `docs` and `web` to add a full `metadata` and change `font family`.
      ```js
      import type { Metadata } from 'next'

      import './globals.css'

      import { Open_Sans } from 'next/font/google'

      const openSans = Open_Sans({
        variable: '--font-open-sans',
        display: 'swap',
        subsets: ['latin']
      })

      export const metadata: Metadata = {
        title: {
          template: `%s - RHU II System`,
          default: 'RHU II System'
        },
      description:
        'A comprehensive management system for Rural Health Units providing free healthcare services including checkups, medicine, and more.',
        keywords:
        'RHU, rural health unit, healthcare management, patient management, medicine inventory, government healthcare, free medical services',
      authors: [
        {
          name: 'Ivan Gregor Tabalno'
        }
      ],
      creator: 'Ivan Gregor Tabalno',
      publisher: 'Ivan Gregor Tabalno',
      applicationName: 'RHU II System',
      category: 'Healthcare',
      colorScheme: 'light dark',
      themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
      ],
      formatDetection: {
        telephone: true,
        email: true,
        address: true
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://craftzcode-system.gov.ph/',
        title: 'RHU II System',
        description: 'Comprehensive healthcare management system for Rural Health Units offering free medical services, patient management, and inventory tracking.',
        siteName: 'RHU II System',
        images: [
          {
            url: '/images/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'RHU II System'
          }
        ]
        },
        twitter: {
          card: 'summary_large_image',
          title: 'RHU II System',
          description:
            'Government healthcare management system for Rural Health Units providing free medical services.',
            images: ['/images/twitter-image.jpg']
          },
          manifest: '/manifest.json',
          icons: {
            icon: [
                  { url: '/favicon.ico' },
                  { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
                  { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' }
                ],
                apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
                other: [
                  { url: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                  { url: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
               ]
              },
             appleWebApp: {
               title: 'RHU II System',
               statusBarStyle: 'black-translucent',
                capable: true
             },
             verification: {
                google: 'google-site-verification-code'
              },
              robots: {
                index: true,
                follow: true,
                googleBot: {
                  index: true,
                  follow: true
                }
              }
            }

            export default function RootLayout({
             children
            }: Readonly<{
             children: React.ReactNode
            }>) {
              return (
               <html lang='en'>
                  <body className={`${openSans.variable} antialiased`}>{children}</body>
                </html>
              )
            }

            ```
      
    - Update `style.css` in the `config/tailwind-config/style.css` to change the `font family`.
      ```css
      --font-sans: var(--font-open-sans);
      ```

    - GIT COMMIT: `git commit -m "feat(layout): add full metadata and change font family"`
  
    - Copy existing `manifest.json` on any repo to `public` folder both of `docs` and `web`.
  
    - GIT COMMIT: `git commit -m "feat(manifest): add manifest.json for metadata"`
  
    - PULL REQUEST TITLE: `feat(frontend): update docs/web layout with full metadata also change font family and add manifest.json`
     
8. Create the Navigation Menu and Main Component
   - GIT BRANCH: `git checkout -b frontend/feat/4-navigation-menu-main-layout`

   - Navigation Menu
     - GIT COMMIT: `git commit -m "feat(nav): add responsive navigation menu"`

   - Main Layout
     - GIT COMMIT: `git commit -m "feat(layout): add responsive main component for all routes"`

   - PULL REQUEST TITLE: `feat(frontend): install remix icon, add responsive navigation & main layout`

9. Setup DB package for Drizzle ORM and Neon Database
   - GIT BRANCH: `git checkout -b backend/feat/5-db`

   - Setup `db` package
     - Create a folder called `db` inside the `packages` folder.
     - Go to the location of your `db` folder in shell then init the `package.json`
       - Add `package.json` in `packages/db` with the following code.
          ```json
          {
            "name": "@craftzcode/db",
            "version": "0.0.0",
            "type": "module",
            "exports": {
              ".": {
                "types": "./dist/index.d.ts",
                "default": "./dist/index.js"
              },
              "./schema": {
                "types": "./dist/schema/index.d.ts",
                "default": "./dist/schema/index.js"
              }
            },
            "scripts": {
              "build": "tsc",
              "dev": "tsc",
              "push": "bunx drizzle-kit push",
              "studio": "bunx drizzle-kit studio",
              "lint": "eslint . --max-warnings 0",
              "check-types": "tsc --noEmit",
              "clean": "git clean -xdf .cache .turbo dist node_modules"
            },
            "devDependencies": {
              "@craftzcode/eslint-config": "*",
              "@craftzcode/prettier-config": "*",
              "@craftzcode/typescript-config": "*",
              "eslint": "^9.22.0",
              "typescript": "5.8.2"
            },
            "prettier": "@craftzcode/prettier-config"
          }
          ```
       - GIT COMMIT: `git commit -m "chore(db): add package.json for db package"`
       - Add this two db scripts in the `package.json` of the root your turbrepo.
         ```json
         "scripts": {
           "db:push": "turbo -F @craftzcode/db push",
           "db:studio": "turbo -F @craftzcode/db studio"
         }
         ```
       - Also add the db scripts in `turbo.json`
         ```json
         "tasks": {
           "push": {
             "cache": false,
             "interactive": true
            },
            "studio": {
              "cache": false,
              "persistent": true
            }
          }
          ```
         - GIT COMMIT: `git commit -m "chore(turbo): add db push and studio scripts both root turbo.json and packages.json"`
     - Add `eslint.config.js` in `packages/db` with the following code
       ```js
       import baseConfig from "@craftzcode/eslint-config/base";

       /** @type {import('typescript-eslint').Config} */
       export default [
         {
           ignores: ["dist/**"],
         },
         ...baseConfig,
       ];
       ```
     - Add `tsconfig.json` in `packages/db` with the following code.
       ```json
       {
       "extends": "@craftzcode/typescript-config/internal-library.json",
       "include": ["src"],
       "exclude": ["node_modules", "dist"]
       }
       ```
     - GIT COMMIT: `git commit -m "chore(db): configure TS and ESLint"`

   - Setup Neon Database
     - Create a database in [Neon Tech](https://console.neon.tech/).
     - Create `.env.local` on the root of package `packages/db/.env.local`.
     - Copy the connection string and paste it to `.env.local`
       ```
       DATABASE_URL="connection-string"
       ```
   - Setup Drizzle ORM
     - Option 1: Follow their official [Drizzle ORM Documentation](https://orm.drizzle.team/docs/get-started/neon-new).
     - Option 2: Follow this guide.
       - Go to the `packages/db` folder in your shell then install `Drizzle ORM` and `Neon Database` packages.
         ```shell
         bun add drizzle-orm @neondatabase/serverless dotenv
         bun add -D drizzle-kit tsx
         ```
         - GIT COMMIT `git commit -m "chore(db): install drizzle ORM and neon database packages"`
       - Create a `src` folder in `packages/db` and create a `index.ts` file in the `packages/db/src` directory and initialize the connection.
         ```ts
         import { drizzle } from 'drizzle-orm/neon-http'

         // Retrieve the database URL from environment variables
         const DATABASE_URL = process.env.DATABASE_URL

         // Ensure that the DATABASE_URL is defined
         if (!DATABASE_URL) {
           throw new Error('DATABASE_URL is not defined')
         }

         /**
           * Establishes a database connection using Drizzle ORM with Neon serverless PostgreSQL.
          *
           * @description
           * This module creates a singleton database connection that can be imported
           * and used across the application. It uses the Neon HTTP driver for Drizzle ORM.
           *
          * @throws {Error} Throws an error if DATABASE_URL environment variable is not defined
          *
          * @example
          * // Basic usage with schema
          * // Importing the database connection
          * import { db } from './db'
          * import { users } from './schema'
           *
          * // Using the database connection to query
          * const users = await db.select().from(usersTable)
          *
          * @requires process.env.DATABASE_URL - PostgreSQL connection string
          * @see {@link https://orm.drizzle.team/docs/overview|Drizzle ORM Documentation}
          * @see {@link https://neon.tech|Neon Serverless PostgreSQL}
          */
         export const db = drizzle(DATABASE_URL)
         ```
         - GIT COMMIT: `git commit -m "feat(db): initialize database connection"`
       - Create a `schema` folder in `packages/db/src` and create a `auth.ts` file in the `packages/db/src/schema` directory and add this schema.
         ```ts
         import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

         export const user = pgTable('user', {
           id: uuid('id').primaryKey().defaultRandom(),
           name: text('name').notNull(),
           email: text('email').notNull().unique(),
           emailVerified: boolean('email_verified').notNull(),
           image: text('image'),
           createdAt: timestamp('created_at').notNull(),
           updatedAt: timestamp('updated_at').notNull()
         })

         export const session = pgTable('session', {
           id: uuid('id').primaryKey().defaultRandom(),
           expiresAt: timestamp('expires_at').notNull(),
           token: text('token').notNull().unique(),
           createdAt: timestamp('created_at').notNull(),
           updatedAt: timestamp('updated_at').notNull(),
           ipAddress: text('ip_address'),
           userAgent: text('user_agent'),
           userId: text('user_id')
             .notNull()
             .references(() => user.id, { onDelete: 'cascade' })
         })

         export const account = pgTable('account', {
           id: uuid('id').primaryKey().defaultRandom(),
           accountId: text('account_id').notNull(),
           providerId: text('provider_id').notNull(),
           userId: text('user_id')
             .notNull()
             .references(() => user.id, { onDelete: 'cascade' }),
           accessToken: text('access_token'),
           refreshToken: text('refresh_token'),
           idToken: text('id_token'),
           accessTokenExpiresAt: timestamp('access_token_expires_at'),
           refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
           scope: text('scope'),
           password: text('password'),
           createdAt: timestamp('created_at').notNull(),
           updatedAt: timestamp('updated_at').notNull()
         })

         export const verification = pgTable('verification', {
           id: uuid('id').primaryKey().defaultRandom(),
           identifier: text('identifier').notNull(),
           value: text('value').notNull(),
           expiresAt: timestamp('expires_at').notNull(),
           createdAt: timestamp('created_at'),
           updatedAt: timestamp('updated_at')
         })
         ```
         - GIT COMMIT: `git commit -m "feat(db): add auth schema in src/schema"`
       - Create a `index.ts` file in the `packages/db/src/schema` directory and export the `auth.ts` so we can import like this `import { user } from '@craftzcode/db/schema'`.
         ```ts
         export * from './auth'
         ```
       - Create a `drizzle.config.ts` file in the `packages/db/src` and add the following content.
         ```ts
         import dotenv from 'dotenv'
         import { defineConfig } from 'drizzle-kit'
         
         // We use dotenv to load environment variables from our .env.local file into process.env
         // This is especially useful when running scripts outside of Next.js (e.g., CLI commands like `drizzle-kit push`).
         // While Next.js automatically loads environment variables for its runtime, we still need dotenv
         // for scripts or tools that aren't run within the Next.js environment (like Drizzle migrations).
         dotenv.config({ path: '.env.local' })
         
         // Retrieve the database URL from environment variables
         const DATABASE_URL = process.env.DATABASE_URL
         
         // Ensure that the DATABASE_URL is defined
         if (!DATABASE_URL) {
           throw new Error('DATABASE_URL is not defined')
         }
         
         export default defineConfig({
           out: './drizzle',
           schema: './src/schema/index.ts',
           dialect: 'postgresql',
           dbCredentials: {
             url: DATABASE_URL
           }
         })
         ```
         - GIT COMMIT: `git commit -m "feat(db): add drizzle.config.ts for Drizzle Kit configuration"`
           
    - PULL REQUEST TITLE: `feat(backend): set up db package with Drizzle ORM, and Neon Database`
      
10. Setup API package for tRPC
   - GIT BRANCH: `git checkout -b backend/feat/6-api`

   - Setup `api` package
     - Create a folder called `api` inside the `packages` folder.
     - Inside `packages/api`, create a `package.json` file with the following content.
       ```json
       {
         "name": "@craftzcode/api",
         "version": "0.0.0",
         "type": "module",
         "exports": {
           ".": {
             "types": "./dist/index.d.ts",
             "default": "./dist/index.ts"
           },
           "./client": {
             "types": "./dist/client/index.d.tsx",
             "default": "./dist/client/index.js"
           },
           "./server": {
             "types": "./dist/server/index.d.tsx",
             "default": "./dist/server/index.js"
           }
           "./server/routers": {
             "types": "./dist/server/index.d.ts",
             "default": "./dist/server/index.js"
           }
         },
         "scripts": {
           "build": "tsc",
           "dev": "tsc",
           "lint": "eslint . --max-warnings 0",
           "check-types": "tsc --noEmit",
           "clean": "git clean -xdf .cache .turbo dist node_modules"
         },
         "devDependencies": {
           "@craftzcode/eslint-config": "*",
           "@craftzcode/prettier-config": "*",
           "@craftzcode/typescript-config": "*",
           "eslint": "^9.22.0",
           "typescript": "5.8.2"
         },
         "prettier": "@craftzcode/prettier-config"
       }
       ```
       - GIT COMMIT: `git commit -m "chore(db): add package.json for db package"`
     - Add `eslint.config.js` in `packages/api` with the following code
       ```js
       import baseConfig from "@craftzcode/eslint-config/base";

       /** @type {import('typescript-eslint').Config} */
       export default [
         {
           ignores: ["dist/**"],
         },
         ...baseConfig,
       ];
       ```
     - Add `tsconfig.json` in `packages/api` with the following code.
       ```json
       {
       "extends": "@craftzcode/typescript-config/internal-library.json",
       "compilerOptions": {
         "jsx": "react-jsx"
       },
       "include": ["src"],
       "exclude": ["node_modules", "dist"]
       }
       ```
     - GIT COMMIT: `git commit -m "chore(api): configure TS and ESLint"`
       
   - Setup tRPC
     - Option 1: Follow their official [tRPC Documentation](https://trpc.io/docs/client/tanstack-react-query/server-components).
     - Option 2: Follow this guide.
       - Go to the `packages/api` folder in shell then install `tRPC` packages.
         ```shell
         bun add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-only superjson
         ```
         - GIT COMMIT: `git commit -m "chore(api): install tRPC packages"`
       - Create a `src` folder in your `packages/api` and create a `init.ts/index.ts` file in the `packages/api/src` initialize the backend of tRPC.
         ```ts
         import { cache } from 'react'

         import superjson from 'superjson'

         import { initTRPC } from '@trpc/server'

         export const createTRPCContext = cache(async () => {
           /**
            * @see: https://trpc.io/docs/server/context
            */
           return { userId: 'user_123' }
         })
         // Avoid exporting the entire t-object
         // since it's not very descriptive.
         // For instance, the use of a t variable
         // is common in i18n libraries.
         const t = initTRPC.create({
           /**
            * @see https://trpc.io/docs/server/data-transformers
            */
           transformer: superjson,
         })
         
         // Base router and procedure helpers
         export const createTRPCRouter = t.router
         export const createCallerFactory = t.createCallerFactory
         export const publicProcedure = t.procedure
         // TODO: Add Protected Procedure
         ```
       - Create `routers` folder in `packages/api/src` and create a `_app.ts/index.ts` file in the `packages/api/src/server/routers` add this root tRPC route.
         ```ts
         import { z } from 'zod'

         import { createTRPCRouter, publicProcedure } from '../init'

         export const appRouter = createTRPCRouter({
           hello: publicProcedure
             .input(
               z.object({
                 text: z.string()
               })
             )
             .query(opts => {
               return {
                 greeting: `hello ${opts.input.text}`
               }
             })
         })
         
         // export type definition of API
         export type AppRouter = typeof appRouter
         ```
       - Create `client` folder in `packages/api/src` and create a shared file `packages/api/src/client/query-client.ts` that exports a function that creates a `QueryClient` instance.
         ```ts
         import superjson from 'superjson'

         import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

         export function makeQueryClient() {
           return new QueryClient({
             defaultOptions: {
               queries: {
                staleTime: 30 * 1000
               },
               dehydrate: {
                 serializeData: superjson.serialize,
                 shouldDehydrateQuery: query =>
                   defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
               },
               hydrate: {
                 deserializeData: superjson.deserialize
               }
             }
           })
         }
         ```
       - Setup a tRPC client for Client Components create a `client.tsx/index.tsx` file in the `packages/api/src/client` with the following code.
         ```tsx
         'use client'

         // ^-- to make sure we can mount the Provider from a server component
         import { useState } from 'react'

         import superjson from 'superjson'
         
         import type { QueryClient } from '@tanstack/react-query'
         import { QueryClientProvider } from '@tanstack/react-query'
         import { createTRPCClient, httpBatchLink } from '@trpc/client'
         import { createTRPCContext } from '@trpc/tanstack-react-query'

         import type { AppRouter } from '../server/routers'
         import { makeQueryClient } from './query-client'

         export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()
         let browserQueryClient: QueryClient
         function getQueryClient() {
           if (typeof window === 'undefined') {
             // Server: always make a new query client
             return makeQueryClient()
           }
           // Browser: make a new query client if we don't already have one
            // This is very important, so we don't re-make a new client if React
           // suspends during the initial render. This may not be needed if we
           // have a suspense boundary BELOW the creation of the query client
           if (!browserQueryClient) browserQueryClient = makeQueryClient()
           return browserQueryClient
         }
         
         function getUrl() {
           const base = (() => {
              if (typeof window !== 'undefined') return ''
              if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
             return 'http://localhost:3000'
           })()
           return `${base}/api/trpc`
         }
         
         export function TRPCReactProvider(
           props: Readonly<{
             children: React.ReactNode
           }>
         ) {
            // NOTE: Avoid useState when initializing the query client if you don't
            //       have a suspense boundary between this and the code that may
            //       suspend because React will throw away the client on the initial
            //       render if it suspends and there is no boundary
            const queryClient = getQueryClient()
            const [trpcClient] = useState(() =>
              createTRPCClient<AppRouter>({
                links: [
                  httpBatchLink({
                    transformer: superjson, // <-- if you use a data transformer
                    url: getUrl()
                  })
                ]
              })
            )
         
            return (
             <QueryClientProvider client={queryClient}>
                <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                 {props.children}
               </TRPCProvider>
              </QueryClientProvider>
            )
         }
         ```
       - Setup a tRPC caller for Server Components create a `server.tsx/index.tsx` file in the `packages/api/src/server` with the following code.
         ```tsx
         import 'server-only' // <-- ensure this file cannot be imported from the client

         import { cache } from 'react'

         import { createTRPCClient, httpLink } from '@trpc/client'
         import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query'

         import { makeQueryClient } from '../client/query-client'
         import { createTRPCContext } from '../index'
         import { appRouter } from './routers'
         import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

         // IMPORTANT: Create a stable getter for the query client that
         //            will return the same client during the same request.
         export const getQueryClient = cache(makeQueryClient)
         export const trpc = createTRPCOptionsProxy({
           ctx: createTRPCContext,
           router: appRouter,
           queryClient: getQueryClient
         })
         
         // If your router is on a separate server, pass a client:
         // createTRPCOptionsProxy({
         //   client: createTRPCClient({
         //     links: [httpLink({ url: '...' })]
         //   }),
         //   queryClient: getQueryClient
         // })

         // You can also create a prefetch and HydrateClient helper functions to make it a bit more consice and reusable
         export function HydrateClient(props: { children: React.ReactNode }) {
           const queryClient = getQueryClient();
           return (
            <HydrationBoundary state={dehydrate(queryClient)}>
              {props.children}
            </HydrationBoundary>
          );
         }
         
         export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
           queryOptions: T,
         ) {
           const queryClient = getQueryClient();
           if (queryOptions.queryKey[1]?.type === 'infinite') {
             void queryClient.prefetchInfiniteQuery(queryOptions as any);
           } else {
             void queryClient.prefetchQuery(queryOptions);
           }
         }

         // Then you can use it like this
         // import { HydrateClient, prefetch, trpc } from '~/trpc/server';
         // function Home() {
         //   prefetch(
         //     trpc.hello.queryOptions({
         //       /** input */
         //     }),
         //   );
         //   return (
         //     <HydrateClient>
         //       <div>...</div>
         //       {/** ... */}
         //       <ClientGreeting />
         //     </HydrateClient>
         //   );
         // }
         ```
       - Initialize the connection of `tRPC` (packages/api) and `Next.js` (apps/web).
         - Add the `@craftzcode/api` package in `dependencies` of the `web/packages.json`.
         - Mount the `TRPCReactProvider` from `packages/api/src/client/index.ts` in the root of your application `(e.g. app/layout.tsx when using Next.js)`.
         - Create `trpc` api route for the `Next.js` `tRPC` adapter `app/api/trpc/[tprc]/route.ts` with the following code.
           ```ts
           import { createTRPCContext } from '@rhu-ii/api'
           import { appRouter } from '@rhu-ii/api/server/routers'

           import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

           const handler = (req: Request) =>
            fetchRequestHandler({
              endpoint: '/api/trpc',
              req,
              router: appRouter,
              createContext: createTRPCContext
            })
           
           export { handler as GET, handler as POST }
           ```
           
  - Pull Request Title: `feat(backend): add tRPC for end-to-end type safety`
    
11. Integrate Hono.js in tRPC (Optional)
   - NOTE: This is not finish yet.
   - NOTE: `Next.js` and `Hono.js` adapter has different api route configuration when it comes to `tRPC` on the previous guide we setup the `tRPC` using `Next.js` adapter which is the `apps/web/app/api/trpc/[trpc]/route.ts`, for now there's no documentation on [Hosting tRPC with Adapters](https://trpc.io/docs/server/adapters). But I con show you how to setup `tRPC` using `Hono.js` as a adapter which is the `apps/web/app/api/[[...route]]/route.ts` this is the default api route from [Hono.js Vercel](https://hono.dev/docs/getting-started/vercel#_2-hello-world) this kind of api route can sured that we can access both api routes `tRPC` (api/trpc/[trpc]/) and `Hono.js` (api/) also later when we setup the `better-auth` for authentication we can access the `better-auth` api routes which is the (api/auth/) if we are not using the `Hono.js` as a adapter we will use the `Next.js` adapter which is the `apps/web/app/api/trpc/[trpc]/route.ts` this kind of api routes we cannot access the `better-auth` api routes because the `Next.js` adapter only catch the `api/trpc/[trpc]/` we can't access the `api/auth` we need to new one api route in `Next.js` for the `better-auth` api routes.
   - NOTE: If we are using `Hono.js` as a adapter/server of `tRPC` I think we don't need the [tRPC caller for Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components#5-create-a-trpc-caller-for-server-components) we don't need to use the server component of `Next.js`, because what would be the point of the `Hono.js` server if I also use `Next.js` server component.
   - GIT BRANCH: `git checkout -b backend/feat/7-hono-trpc`
   - Option 1: Follow the [Hono 3rd Party Library for tRPC Server Documentation](https://github.com/honojs/middleware/tree/main/packages/trpc-server#trpc-server-middleware-for-hono).
   - Option 2: Follow this guide.
   - Go to the `packages/api` folder in shell then install `hono` packages.
     ```shell
     bun add hono @hono/trpc-server
     ```
     - GIT COMMIT: `git commit -m "chore(api): install hono and @hono/trpc-server dependencies"`
   - Create a `trpc.ts` in `packages/api/src` and moved all tRPC initialization code from `packages/api/src/index.ts` to `packages/api/src/trpc.ts`.
     - GIT COMMIT: `git commit -m "refactor(api): move tRPC initialization code to trpc.ts"`
   - Update `packages/api/src/index.ts` to initialize Hono with tRPC server middleware.
     ```ts
     import { trpcServer } from '@hono/trpc-server' // Deno 'npm:@hono/trpc-server'
     import { Hono } from 'hono'

     import { appRouter } from './server/routers'

     /**
      * We use basePath('/api') to prefix all routes with '/api'.
      * This ensures our API endpoints are properly namespaced under /api/
      * (e.g., localhost:3000/api/status instead of localhost:3000/status).
      *
      * Benefits:
      * - Clear separation between API routes and other routes (like frontend pages)
     * - Better organization and maintainability
      * - Follows REST API best practices for route structuring
     */
     const app = new Hono().basePath('/api')

     app.use(logger())

     app.use(
       '/trpc/*',
       trpcServer({
         /**
          * The endpoint parameter defines the full URL path for tRPC API requests.
          * We set it to '/api/trpc' to match our basePath prefix + the trpc route.
          *
          * This ensures that:
          * - All tRPC requests are properly routed to the correct handler
          * - The path matches our basePath('/api') configuration
          * - Client-side tRPC calls will connect to the correct endpoint URL
          */
         endpoint: '/api/trpc',
         router: appRouter
      })
     )

     app.get('/status', c => {
       return c.json({
         message: 'Hono Router: Hono + tRPC'
       })
     })

     export default app
     ```
     
     - GIT COMMIT: `git commit -m "feat(api): initialize Hono with tRPC server middleware"`
   - Update `createTRPCContext` import from `'../index'` to `'../trpc'` in `packages/api/src/server/index.tsx` for consistency.
     - GIT COMMIT: `git commit -m "refactor(api): update createTRPCContext import in packages/api/src/server/index.tsx"`
   - Update `createTRPCRouter` and `publicProcedure` import from `'../../index'` to `'../../trpc'` in `packages/api/src/server/routers/index.ts` and add a new status publicProcedure to verify the tRPC router functionality.
     ```ts
     import { z } from 'zod'

     import { createTRPCRouter, publicProcedure } from '../../trpc'

     export const appRouter = createTRPCRouter({
      status: publicProcedure.query(() => {
        return {
          message: 'tRPC Router: Hono + tRPC'
        }
      }),
      hello: publicProcedure
        .input(
          z.object({
            text: z.string()
          })
        )
         .query(opts => {
           return {
             greeting: `hello ${opts.input.text}`
           }
         })
     })
     // export type definition of API
     export type AppRouter = typeof appRouter
     ```
     - GIT COMMIT: `git commit -m "refactor(api): update createTRPCRouter and publicProcedure import in packages/api/src/server/routers/index.ts and add status procedure"`
   - Delete the old trpc route at `apps/web/src/app/api/trpc/[trpc]/route.ts`.
   - Create a new route at `apps/web/src/app/api/[[...route]]/route.ts` to initialize the Hono + tRPC server middleware.
     ```ts
     import app from '@rhu-ii/api
     import { handle } from 'hono/vercel'

     export const GET = handle(app)
     export const POST = handle(app)
     ```
     - GIT COMMIT: `git commit -m "feat(web): update API route for Hono and tRPC integration"`
       
   - PULL REQUEST TITLE: `feat(backend): integrate Hono with tRPC`
     
12. Setup AUTH package for Better-Auth.
   - GIT BRANCH: `git checkout -b backend/feat/8-auth`

   - Option 1: Follow the [Better-Auth Installation](https://www.better-auth.com/docs/installation)
     
   - Option 2: Follow this guide. 
   - Create a folder called `auth` inside the `packages` folder.
   - Inside `packages/auth`, create a `package.json` file with the following content also we add `db` package to `dependencies` because we need to connect our `db` to our `auth`.
     ```json
     {
      "name": "@rhu-ii/auth",
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "build": "tsc",
        "dev": "tsc --watch --preserveWatchOutput",
        "lint": "eslint . --max-warnings 0",
        "check-types": "tsc --noEmit",
        "clean": "git clean -xdf .cache .turbo dist node_modules"
      },
      "exports": {
        ".": {
          "types": "./dist/index.d.ts",
          "default": "./dist/index.js"
        },
        "./client": {
          "types": "./dist/auth-client.d.tsx",
          "default": "./dist/auth-client.js"
        }
      },
      "dependencies": {
        "@rhu-ii/db": "workspace:*"
      },
      "devDependencies": {
        "@rhu-ii/eslint-config": "*",
        "@rhu-ii/prettier-config": "*",
        "@rhu-ii/typescript-config": "*",
        "eslint": "^9.22.0",
        "typescript": "5.8.2"
      },
      "prettier": "@rhu-ii/prettier-config"
     }
     ```
     - GIT COMMIT: `git commit -m "chore(auth): add package.json for auth package with db package"`
   - Add `eslint.config.js` in `packages/auth` with the following code.
     ```js
     import baseConfig from "@rhu-ii/eslint-config/base";

     /** @type {import('typescript-eslint').Config} */
     export default [
       {
        ignores: ["dist/**"],
      },
      ...baseConfig,
     ];
     ```
   - Add `tsconfig.json` in `packages/auth` with the following code.
     ```json
     {
      "extends": "@rhu-ii/typescript-config/internal-library.json",
      "compilerOptions": {
        "jsx": "react-jsx"
      },
      "include": ["src"],
      "exclude": ["node_modules", "dist"]
     }
     ```
   - GIT COMMIT: `git commit -m "chore(auth): configure TS and ESLint"`
   - Go to the `packages/auth` folder in your shell then install `Better-Auth` package.
     ```shell
     bun add better-auth
     ```
     - GIT COMMIT `git commit -m "chore(auth): install better-auth package"`
   - Create a `.env.local` file in the `packages/auth` and add the following environment variables.
     ```env
     BETTER_AUTH_SECRET=
     BETTER_AUTH_URL=http://localhost:3000 #Base URL of your app

     DATABASE_URL=
     ```
   - Create a `src` folder in `packages/auth` and create a `auth.ts/index.ts` file in the `packages/auth/src` directory and create your auth instance.
     ```ts
     import { db } from '@rhu-ii/db' // your drizzle instance
     import { account, session, user, verification } from '@rhu-ii/db/schema'
     import { betterAuth } from 'better-auth'
     import { drizzleAdapter } from 'better-auth/adapters/drizzle'

     export const auth = betterAuth({
       database: drizzleAdapter(db, {
        provider: 'pg', // or "mysql", "sqlite"
         schema: {
           user,
           session,
           account,
           verification
         }
       }),
       emailAndPassword: {
         enabled: true
       },
       socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }
       },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60 // Cache duration in seconds
        }
      }
     })
     ```
     - GIT COMMIT: `git commit -m "feat(auth): add auth server instance"`
   - Create a `client` folder in `packages/auth/src` and create a `auth-client.ts/index.ts` file in the `packages/auth/src/client` directory and create your auth client instance.
     ```ts
     import { createAuthClient } from 'better-auth/react'

     export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
      /** the base url of the server (optional if you're using the same domain) */
      baseURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
     })

     export const { signIn, signUp, useSession } = authClient
     ```
     - GIT COMMIT: `git commit -m "feat(auth): add auth client instance"`
   - To handle api requests, you need to set up a route handler on your server there's a many option here [Better-Auth Mound Handler](https://www.better-auth.com/docs/installation#mount-handler) but in this guide we will integrate it using `Hono.js` mount handler.
     - First we need to add this `@craftzcode/auth` dependency in `packages/api/package.json`
       ```json
       "@craftzcode/auth": "*"
       ```
     - Second we need to update the `tRPC` with `Hono.js` adapter in `packages/api/src/index.ts` then set up a the `better-auth` route handler.
       ```ts
       import { trpcServer } from '@hono/trpc-server' // Deno 'npm:@hono/trpc-server'

       import { auth } from '@rhu-ii/auth'
       import { Hono } from 'hono'
       import { logger } from 'hono/logger'

       import { appRouter } from './server/routers'

       /**
        * We use basePath('/api') to prefix all routes with '/api'.
        * This ensures our API endpoints are properly namespaced under /api/
        * (e.g., localhost:3000/api/status instead of localhost:3000/status).
        *
        * Benefits:
        * - Clear separation between API routes and other routes (like frontend pages)
        * - Better organization and maintainability
        * - Follows REST API best practices for route structuring
        */
       const app = new Hono().basePath('/api')

       app.use(logger())

       // Better-Auth Route Handler
       app.on(['POST', 'GET'], '/api/auth/**', c => auth.handler(c.req.raw))

       app.use(
        '/trpc/*',
        trpcServer({
          /**
           * The endpoint parameter defines the full URL path for tRPC API requests.
           * We set it to '/api/trpc' to match our basePath prefix + the trpc route.
           *
           * This ensures that:
           * - All tRPC requests are properly routed to the correct handler
           * - The path matches our basePath('/api') configuration
           * - Client-side tRPC calls will connect to the correct endpoint URL
           */
          endpoint: '/api/trpc',
           router: appRouter
        })
       )

       app.get('/status', c => {
         return c.json({
           message: 'Hono Router: Hono + tRPC'
         })
       })

       export default app
       ```
       - GIT COMMIT: `git commit -m "feat(api): integrate better-auth handler with Hono and tRPC"`
     - Setup Protected Procedure Middelware
       - Create a `lib` folder in `packages/api/src` and create a `context.ts` file in `packages/api/src/lib` to integrate `Hono.js` context with `tRPC` context.
         ```ts
         import { cache } from 'react'

         import { auth } from '@rhu-ii/auth'
         import type { Context as HonoContext } from 'hono'

         /**
          * Creates a tRPC context from a Hono context
          *
          * @description
          * This function creates a tRPC context by extracting session information from
          * the Hono context. It combines the web framework's context (Hono) with tRPC's
          * context system to enable authenticated API routes.
          *
          * Performance considerations:
          * - Using server-side session fetching avoids redundant client-side network requests
          * - Direct API access to auth.api.getSession is more efficient than client-side fetching
          * - The React cache function memoizes context creation to prevent duplicate session lookups
          *   for the same request, reducing database/auth provider load
          *
          * The cache wrapper ensures that within a single React Server Component render pass,
          * multiple calls to createTRPCContext with the same Hono context will reuse the
          * previously computed result rather than making duplicate auth verification calls.
          *
          * @param c - The Hono context from the HTTP request
          * @returns A context object containing the user session (if authenticated)
          */
         export const createTRPCContext = cache(async (c: HonoContext) => {
          const session = await auth.api.getSession({
            headers: c.req.raw.headers
          })

          console.log({
            Context: session
          })

          return { session }
         })

         export type Context = Awaited<ReturnType<typeof createTRPCContext>>
         ```
         - GIT COMMIT: `git commit -m "feat(api): create tRPC context integrating Hono context"`
       - Create a `protectedProcedure` middleware and import custom context from `packages/api/src/lib/context.ts`.
         ```ts
         import superjson from 'superjson'

         import { initTRPC, TRPCError } from '@trpc/server'

         import { Context } from './lib/context'

         // Avoid exporting the entire t-object
         // since it's not very descriptive.
         // For instance, the use of a t variable
         // is common in i18n libraries.
         const t = initTRPC.context<Context>().create({
           /**
            * @see https://trpc.io/docs/server/data-transformers
            */
           transformer: superjson
         })
         
         // Base router and procedure helpers
         export const createTRPCRouter = t.router
         export const createCallerFactory = t.createCallerFactory
         export const publicProcedure = t.procedure

         // // Middleware to check if user is authenticated
         // const isAuthed = t.middleware(({ ctx, next }) => {
         //   if (!ctx.session || !ctx.session.user) {
         //     throw new TRPCError({ code: 'UNAUTHORIZED' })
         //   }
         //   return next({
         //     ctx: {
         //       // Add user information to context
         //       session: ctx.session,
         //       user: ctx.session.user
         //     }
         //   })
         // })

         // // Protected procedure that requires authentication
         // export const protectedProcedure = t.procedure.use(isAuthed)

         /**
          * Protected procedure middleware for authenticated routes
          *
          * @description
          * This middleware ensures that the request has a valid user session before proceeding.
          * It throws an UNAUTHORIZED error if no session exists, preventing unauthorized access
          * to protected API endpoints.
          *
          * The session is obtained from the tRPC context, which is created in `createTRPCContext`
          * (lib/context.ts). There, the session is extracted from the request headers using
          * the auth API: `auth.api.getSession({ headers: c.req.raw.headers })`.
          *
          * Note that `c.req.raw.headers` comes from the Hono context (`c: HonoContext`) that is passed to
          * `createTRPCContext`. This creates a bridge between Hono's web framework context and tRPC's
          * context system, allowing session data to flow from the HTTP request (via Hono) into the
          * tRPC procedure handlers.
          *
          * @example
          * // Creating a protected route that requires authentication
          * export const userRouter = createTRPCRouter({
          *   // This route can only be accessed by authenticated users
          *   getProfile: protectedProcedure
          *     .query(({ ctx }) => {
          *       // ctx.session is guaranteed to exist here
          *       const userId = ctx.session.user.id;
          *       return getUserProfile(userId);
          *     }),
          *
          *   // Another protected route with input validation
          *   updateProfile: protectedProcedure
          *     .input(z.object({ name: z.string() }))
          *     .mutation(({ ctx, input }) => {
          *       const userId = ctx.session.user.id;
          *       return updateUserData(userId, input);
          *     })
          * });
          *
          * @param {Object} params - The procedure parameters
          * @param {Context} params.ctx - The tRPC context containing session (if authenticated)
          * @param {Function} params.next - Function to call the next middleware or resolver
          * @throws {TRPCError} Throws with code 'UNAUTHORIZED' if no session exists
          * @returns Result of the next middleware with the session in context
          */
         export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
          if (!ctx.session) {
            throw new TRPCError({ code: 'UNAUTHORIZED' })
          }
          return next({
             ctx: {
               ...ctx,
               session: ctx.session
            }
          })
         })
         ```
         - GIT COMMIT: `git commit -m "feat(api): create protectedProcedure using custom context"`
       - Pass `hono` context to `createTRPCContext` to pass the `HTTP Request` of the `hono` so the `headers` will be available in `createTRPCContext` so we can pass the `headers` in `better-auth` api get session.
         ```ts
         import { trpcServer } from '@hono/trpc-server' // Deno 'npm:@hono/trpc-server'

         import { auth } from '@rhu-ii/auth'
         import { Hono } from 'hono'
         import { logger } from 'hono/logger'

         import { createTRPCContext } from './lib/context'
         import { appRouter } from './server/routers'

         /**
          * We use basePath('/api') to prefix all routes with '/api'.
          * This ensures our API endpoints are properly namespaced under /api/
          * (e.g., localhost:3000/api/status instead of localhost:3000/status).
          *
          * Benefits:
          * - Clear separation between API routes and other routes (like frontend pages)
          * - Better organization and maintainability
          * - Follows REST API best practices for route structuring
          */
         const app = new Hono().basePath('/api')

         app.use(logger())

         app.on(['POST', 'GET'], '/api/auth/**', c => auth.handler(c.req.raw))

         app.use(
           '/trpc/*',
           trpcServer({
             /**
              * The endpoint parameter defines the full URL path for tRPC API requests.
              * We set it to '/api/trpc' to match our basePath prefix + the trpc route.
              *
              * This ensures that:
              * - All tRPC requests are properly routed to the correct handler
              * - The path matches our basePath('/api') configuration
              * - Client-side tRPC calls will connect to the correct endpoint URL
              */
             endpoint: '/api/trpc',
             router: appRouter,
             createContext: (_opts, c) => {
               return createTRPCContext(c)
             }
           })
         )

         app.get('/status', c => {
           return c.json({
             message: 'Hono Router: Hono + tRPC'
           })
         })

         export default app
         ```
         - GIT COMMIT: `git commit -m "feat(api): add createContext to trpcServer middleware"`
  - PULL REQUEST TITLE: `feat(auth, api): integrate better-auth with Hono & tRPC`   
