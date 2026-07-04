### Conventions

- When adding comments, only add a concise comment that describes the current behaviour. Do not include historical context.
- Prefer fat arrow syntax, do not use function keyword
- DO NOT use single line if statements, always create a block
- Prefer map functions, avoid using naked for loops unless strictly necessary
- Prefer named exports, avoid default exports
- Prefer plain colour name refs in Tailwind (e.g. bg-ember not bg-text-[var(--color-ember)])
- Prefer files under 500 lines long. If a file is becoming too long extract related code into separate components and files
- When making changes to a file, remove any dead code that is discovered
- When styling jsx tags, prefer using standard tailwind v4 classes and avoid using the style prop unless strictly necessary
- When writing jsx, adhere to the 'react/jsx-curly-brace-presence' linting rule (e.g. `prop={'some value'}` instead of `prop="some value"`)
- Don't reference React types like `React.ReactNode`, instead import the `ReactNode` type separately (don't reference UMD global variable)
