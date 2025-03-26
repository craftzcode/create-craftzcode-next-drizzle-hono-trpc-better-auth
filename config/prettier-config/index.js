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