# Entrenador de Palabras (Agudas, Llanas y Esdrújulas)

## Project Overview

**Entrenador de Palabras** is an interactive educational web application built with React and TypeScript, designed to help children learn and practice Spanish accentuation rules (palabras agudas, llanas, and esdrújulas). The application provides a gamified experience with multiple exercise modes, visual theory explanations, and printable worksheet generation.

### Key Technologies

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **Testing:** Playwright (E2E), Vitest (Unit)
- **Tooling:** Prettier (Formatter), Husky (Git Hooks), Rollup Visualizer (Bundle Analysis)

### Core Features

- **Interactive Games:**
  - _Detective de Sílabas:_ Identify the tonic syllable.
  - _El Clasificador:_ Classify words by accentuation type.
  - _Laboratorio:_ Reorder syllables to form words.
  - _Completar:_ Fill in the missing tonic syllable and classify.
- **Random Mode:** A mixed session of exercises for quick practice.
- **Printable Worksheets:** Generates PDF-ready pages with random exercises.
- **Local Persistence:** Uses the File System Access API to load/save word lists from local JSON files.
- **Responsive Design:** Optimized for tablets and mobile devices.

## Building and Running

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Key Commands

| Action                   | Command                 | Description                                                                         |
| :----------------------- | :---------------------- | :---------------------------------------------------------------------------------- |
| **Install Dependencies** | `npm install`           | Installs all required packages.                                                     |
| **Start Dev Server**     | `npm run dev`           | Starts the development server at `http://localhost:5173`. Exposed to local network. |
| **Build for Production** | `npm run build`         | Compiles to `dist` and generates bundle stats at `dist/stats.html`.                 |
| **Format Code**          | `npm run format`        | Formats code using Prettier (includes Tailwind class sorting).                      |
| **Lint Code**            | `npm run lint`          | Runs ESLint to check for code quality issues.                                       |
| **Run Unit Tests**       | `npm run test:unit`     | Executes unit tests once (CI mode).                                                 |
| **Run E2E Tests**        | `npm run test:e2e`      | Executes end-to-end tests using Playwright.                                         |
| **Run All Tests**        | `npm test`              | Runs both Unit and E2E tests.                                                       |
| **Test Coverage**        | `npm run test:coverage` | Generates a code coverage report.                                                   |

## Development Workflow

To ensure code quality and stability, please adhere to the following workflow when making changes:

1.  **Implementation & Testing:**
    - Make necessary code changes.
    - **Crucial:** Write or update unit tests (Vitest) and/or E2E tests (Playwright) to cover new functionality or bug fixes.
    - **Coverage Requirement:** Maintain a minimum of **75% test coverage** for all new logic and components.
2.  **Formatting:**
    - Run `npm run format` to ensure code is formatted and Tailwind classes are sorted.
    - _Note:_ This is also run automatically on staged files before committing via Husky/lint-staged.
3.  **Type Checking:**
    - Run `npx tsc --noEmit` to verify there are no TypeScript errors.
4.  **Linting:**
    - Run `npm run lint` to catch potential issues and enforce coding standards.
5.  **Unit Verification:**
    - Execute `npm run test:unit` to run the unit test suite once without blocking the terminal.
6.  **E2E Verification:**
    - Execute `npm run test:e2e` to run end-to-end tests.
    - _Tip:_ Use `tmux` if you need to run the dev server (`npm run dev`) or watch mode tests (`npm run test:unit:watch`) in the background.
7.  **Documentation Review (README.md):**
    - Review `README.md` to ensure it reflects the current state of the project. Update installation steps, feature lists, or configuration details if changed.
8.  **Context Review (GEMINI.md):**
    - Review this file (`GEMINI.md`) and update it with any new conventions, architectural decisions, or memory aids that would benefit future sessions.

## Development Conventions

### Architecture

- **State Management:** The application uses a custom hook `useWordStore` (`src/hooks/useWordStore.ts`) to manage the list of words and handle file I/O operations.
- **Routing:** Simple state-based navigation within `src/App.tsx` using the `AppView` type ('MENU', 'GAME', etc.), rather than a full router library.
- **Components:** Functional React components located in `src/components/`.
  - _Game Components:_ `DetectiveGame`, `ClassifierGame`, `LabGame`, `CompleteGame`.
  - _UI/Admin:_ `Menu`, `AdminPanel`, `PrintLayout`.

### Data Structure

Words are typed as `Word` interfaces (`src/types/index.ts`) containing:

- `word`: The full string.
- `syllables`: Array of syllable strings.
- `tonic_index`: Index of the stressed syllable.
- `type`: 'aguda', 'llana', or 'esdrujula'.

Initial data is loaded from `src/data/words.json`.

### Styling

- **Tailwind CSS:** Used extensively for styling.
- **Color Coding:** Consistent color scheme for word types (Blue/Aguda, Green/Llana, Red/Esdrújula) to aid visual learning.

### Testing

- **E2E:** Playwright tests located in `tests/` ensure critical user flows (game start, navigation) work as expected.
- **Unit:** Logic for syllable parsing and classification (`src/utils/syllable-parser.ts`) should be covered by unit tests.

### Configuration

- **Environment Variables:** `.env` file handles user personalization (`VITE_USER_NAME`) and game settings (`VITE_DEFAULT_ROUNDS`).
- **Vite:** Configured in `vite.config.ts` to listen on all local IP addresses (`host: true`) for easy testing on physical devices.
