---
inclusion: always
---

# Application Guidelines

This is a React 19 + TypeScript + Vite application with TanStack Router, TanStack Query, i18n (English/Hebrew with RTL), Zustand state management, and authentication.

## Tech Stack

- **Runtime**: Bun (preferred) or Node.js
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query
- **State Management**: Zustand
- **Internationalization**: i18next with RTL support
- **HTTP Client**: Axios
- **API Types**: OpenAPI TypeScript with openapi-fetch
- **Validation**: Zod

## Project Structure

```
src/
├── routes/                    # File-based routing (TanStack Router)
│   ├── auth/
│   │   ├── components/        # Auth-specific components
│   │   ├── hooks/             # Auth-specific hooks
│   │   ├── types/             # Auth-specific types
│   │   ├── index.ts           # Public exports
│   │   └── route.tsx          # Route definition
│   ├── home/
│   │   ├── components/
│   │   ├── index.ts
│   │   └── route.tsx
│   └── __root.tsx             # Root route layout
├── shared/
│   ├── components/            # Reusable components (Drawer, Layout, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores (user, settings, featureFlags)
│   └── utils/                 # Utility functions
├── config/                    # Configuration files
│   ├── axiosClient.ts         # Axios configuration
│   ├── openapi.ts             # OpenAPI + React Query ($api)
│   ├── queryClient.ts         # TanStack Query client
│   └── featureFlags.yml       # Feature flags configuration
├── i18n/                      # Translation files and i18n setup
│   ├── locales/
│   │   ├── en.json
│   │   └── he.json
│   └── config.ts
└── types/                     # Global type definitions
    └── api.d.ts               # Generated OpenAPI types
```

## Coding Standards

### TypeScript
- Use strict TypeScript with proper typing
- Define types/interfaces for all props, state, and API responses
- Use Zod schemas for runtime validation
- Avoid `any` types

### React Components
- Use functional components with hooks
- Keep components small and focused (single responsibility principle)
- Break down large components into smaller, composable pieces
- Extract reusable logic into custom hooks
- Use proper prop destructuring
- Co-locate related sub-components in a `components/` folder within the parent component directory

#### Component Composition Guidelines
- **Single Responsibility**: Each component should do one thing well
- **Composability**: Build complex UIs by combining simple components
- **Reusability**: Extract common patterns into shared components
- **Readability**: Smaller components are easier to understand and maintain
- **Testability**: Small, focused components are easier to test

#### When to Split Components
Split a component when it:
- Exceeds 150-200 lines of code
- Has multiple distinct UI sections
- Contains reusable UI patterns
- Mixes different concerns (data fetching, presentation, business logic)
- Has complex conditional rendering

#### Component Organization Pattern

**For Route-Level Features:**
```
routes/
└── feature-name/
    ├── components/                # Feature-specific components
    │   ├── FeatureView.tsx        # Main view component
    │   ├── FeatureView.module.scss
    │   ├── SubComponent1.tsx      # Sub-components
    │   ├── SubComponent1.module.scss
    │   ├── SubComponent2.tsx
    │   └── SubComponent2.module.scss
    ├── hooks/                     # Feature-specific hooks
    │   └── useFeatureLogic.ts
    ├── types/                     # Feature-specific types
    │   └── index.ts
    ├── index.ts                   # Public exports
    └── route.tsx                  # Route definition
```

**For Shared/Reusable Components:**
```
shared/components/
└── ComponentName/
    ├── ComponentName.tsx          # Main component
    ├── ComponentName.module.scss  # Styles
    ├── SubComponent.tsx           # Related sub-components
    ├── SubComponent.module.scss
    └── index.ts                   # Public exports
```

**Key Principles:**
- Route features are self-contained in their own folders
- Each route has its own `components/`, `hooks/`, and `types/` folders
- Main view component is exported from `index.ts` and used in `route.tsx`
- Sub-components are co-located with the main component in the `components/` folder
- Shared components go in `src/shared/components/`

#### Example: Breaking Down a Large Component

**Real Example from the Codebase (LoginView):**

```typescript
// ✅ Good: LoginView composed from smaller components
export function LoginView() {
  const { credentials, handleChange, handleSubmit, isLoading, error } = useLogin();

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <LoginIllustration />
        <LoginHeader />
        <LoginForm
          credentials={credentials}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
        <LoginRegisterPrompt />
        <LoginContactButtons />
      </div>
    </div>
  );
}
```

**Structure:**
```
routes/auth/
├── components/
│   ├── LoginView.tsx              # Main orchestrator
│   ├── LoginView.module.scss
│   ├── LoginForm.tsx              # Form logic
│   ├── LoginForm.module.scss
│   ├── LoginHeader.tsx            # Header section
│   ├── LoginHeader.module.scss
│   ├── LoginIllustration.tsx      # Visual element
│   ├── LoginIllustration.module.scss
│   ├── LoginRegisterPrompt.tsx    # CTA section
│   ├── LoginRegisterPrompt.module.scss
│   ├── LoginContactButtons.tsx    # Contact section
│   └── LoginContactButtons.module.scss
├── hooks/
│   └── useLogin.ts                # Login logic hook
└── types/
    └── index.ts                   # Type definitions
```

**Benefits:**
- Each component has a single, clear responsibility
- Easy to test individual pieces
- Styles are scoped and co-located
- Logic is extracted to custom hooks
- Components are reusable and maintainable

### State Management
- Use Zustand for global state (user, settings, notifications, feature flags)
- Use TanStack Query for server state
- Use local state (useState) for component-specific state
- Keep stores in `src/shared/stores/`
- Export selectors for derived/computed state (better performance than getters)
- Use feature flags to control feature availability dynamically

### Routing
- Use file-based routing in `src/routes/`
- Each route folder contains: `components/`, `hooks/`, `types/`, `index.ts`, and `route.tsx`
- Main view component is exported from `index.ts`
- Route definition in `route.tsx` imports and uses the view component
- Use route loaders for data fetching when appropriate
- Implement proper authentication guards using `beforeLoad`
- Use feature flags in route guards to control access

#### Route Structure Pattern
```typescript
// routes/feature/index.ts - Export main view
export { FeatureView } from './components';

// routes/feature/route.tsx - Define route
import { createFileRoute } from '@tanstack/react-router';
import { FeatureView } from './index';

export const Route = createFileRoute('/feature')({
  component: FeatureView,
});
```

#### Route with Feature Flag Guard
```typescript
// routes/feature/route.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { FeatureView } from './components';
import { useFeatureFlagStore } from '@/shared/stores/featureFlags';

export const Route = createFileRoute('/feature')({
  beforeLoad: () => {
    const isEnabled = useFeatureFlagStore.getState().isFeatureEnabled('feature-name');
    if (!isEnabled) {
      throw redirect({ to: '/home' });
    }
  },
  component: FeatureView,
});
```

### Styling
- Use SCSS modules (`.module.scss`) co-located with components
- Import styles as modules: `import styles from './Component.module.scss'`
- Use camelCase for class names in SCSS and access via `styles.className`
- Support both light and dark themes using CSS variables and `@media (prefers-color-scheme: dark)`
- Ensure RTL compatibility for Hebrew using logical properties (e.g., `margin-inline-start` instead of `margin-left`)
- Use flexbox with `align-items: center` and `max-width` constraints for centered layouts
- Leverage SCSS features: variables, nesting, mixins for reusable styles

### Internationalization
- All user-facing text must use i18next translations
- Add translations to both `en.json` and `he.json`
- Use proper translation keys with namespaces
- Test RTL layout for Hebrew

## API Integration

### OpenAPI React Query ($api)
- **Primary method for all API calls** - Use `$api` from `src/config/openai.ts`
- Configuration combines openapi-fetch with openapi-react-query
- Generated types from `src/types/api.d.ts` provide full type safety
- Base URL configured via `VITE_APP_BASE_URL` environment variable
- Credentials included automatically for authentication

### Using $api for Queries (GET requests)
```typescript
import $api from '@/config/openai';

// Type-safe GET request with auto-generated types
const { data, isLoading, isError } = $api.useQuery(
  'get',
  '/api/users/user-info',
  {
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }
);
```

### Using $api for Mutations (POST/PUT/DELETE)
```typescript
import $api from '@/config/openai';
import { RequestSchema } from './types';

// Type-safe POST request with Zod validation
const mutation = $api.useMutation('post', '/api/auth/authenticate', {
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});

// Validate data with Zod before mutation
const handleSubmit = (formData: unknown) => {
  try {
    // Validate request payload before sending
    const validatedData = RequestSchema.parse(formData);
    
    mutation.mutate({
      body: validatedData,
    });
  } catch (error) {
    console.error('Validation error:', error);
    // Handle validation errors (e.g., show error message to user)
  }
};
```

### OpenAPI Type Generation
- Generate types: `bunx openapi-typescript <url> -o ./src/types/api.d.ts`
- Regenerate when backend API changes
- Types are automatically used by `$api` for full type safety

### Legacy Patterns (Deprecated)
- ❌ Direct axios usage - migrate to `$api`
- ❌ `useChangeRequest` hook - use `$api.useMutation()` instead
- ❌ Manual TanStack Query with axios - use `$api.useQuery()` or `$api.useMutation()`

### Handling OpenAPI Spec Limitations
Some endpoints may show `content?: never` in the OpenAPI spec but actually return data:
```typescript
// Cast response when OpenAPI spec is incomplete
const authResponse = AuthResponseSchema.parse(data as unknown);
```

### Request Validation Best Practices
Always validate request payloads with Zod before making API calls:

```typescript
import { z } from 'zod';

// Define request schema
const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Validate before mutation
const handleLogin = (credentials: unknown) => {
  try {
    const validated = LoginRequestSchema.parse(credentials);
    mutation.mutate({ body: validated });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
    }
  }
};
```

Benefits:
- Catch invalid data before API calls
- Provide better error messages to users
- Ensure type safety at runtime
- Reduce unnecessary API requests

## Authentication

- User state managed via Zustand (`useUserStore`)
- Use `selectIsAuthenticated` selector for checking auth status
- Use `selectIsAdmin` selector for checking admin privileges
- Authentication status checked in route guards
- Role-based access control (user/admin roles)
- User info fetched on app mount
- Logout clears user state and redirects to login

### Authentication Pattern
```typescript
import { useUserStore, selectIsAuthenticated, selectIsAdmin } from '@/shared/stores/user';

function Component() {
  const { user } = useUserStore();
  const isAuthenticated = useUserStore(selectIsAuthenticated);
  const isAdmin = useUserStore(selectIsAdmin);
  
  // Use isAuthenticated for conditional rendering
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <p>Welcome {user?.name}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Role-Based Access Control
```typescript
import { useUserStore, selectIsAdmin } from '@/shared/stores/user';
import { createFileRoute, redirect } from '@tanstack/react-router';

// Protect admin routes
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    const isAdmin = context.authentication?.user?.role === 'admin';
    if (!isAdmin) {
      throw redirect({ to: '/home' });
    }
  },
  component: AdminView,
});
```

## Error Handling

- Use Error Boundaries for component errors
- Provide user-friendly error messages
- Log errors appropriately
- Show recovery options when possible

## Testing Approach

- Write unit tests for utility functions
- Test custom hooks with proper setup
- Test components with user interactions
- Mock API calls in tests
- Test both LTR and RTL layouts

## Environment Variables

Required variables in `.env`:
- `VITE_APP_BASE_URL` - Backend API URL
- `VITE_APP_REDIRECT_URI` - Frontend URL for redirects

## Build Configuration

### Vite Setup
- **Build Tool**: Vite with SWC for fast React refresh
- **SCSS Support**: Built-in SCSS compilation with CSS modules
- **YAML Support**: Import `.yml` and `.yaml` files as JavaScript objects
- **Path Aliases**: Use `@/` to import from `src/` directory
- **Auto Code Splitting**: Routes automatically split for optimal loading
- **Environment Variables**: Access via `import.meta.env.VITE_*`

### YAML Configuration Files
Import YAML files directly in TypeScript:

```typescript
// Import YAML as JavaScript object
import config from './config.yml';

// Example: Feature flags
import featureFlags from '@/config/featureFlags.yml';
```

The YAML loader plugin transforms YAML to JSON at build time, making it available as a standard JavaScript module.

## Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build
- `bunx openapi-typescript <url> -o ./src/types/api.d.ts` - Generate API types from OpenAPI spec

## Best Practices

1. Follow existing code patterns and structure
2. Keep components small and composable (prefer multiple small components over one large component)
3. Keep components accessible (ARIA attributes, semantic HTML)
4. Ensure responsive design (mobile-first)
5. Support both themes (light/dark)
6. Test RTL layout for Hebrew translations
7. Use proper TypeScript types
8. Handle loading and error states
9. Keep bundle size minimal
10. Use React 19 features appropriately
11. Follow ESLint rules
12. Extract complex logic into custom hooks
13. Co-locate related files (component, styles, tests, sub-components)

## Common Patterns

### API Query (GET Request)
```typescript
import $api from '@/config/openai';

const { data, isLoading, isError } = $api.useQuery(
  'get',
  '/api/endpoint',
  {
    // Optional TanStack Query options
    staleTime: 1000 * 60 * 5,
    retry: 2,
  }
);
```

### API Mutation (POST/PUT/DELETE) with Validation
```typescript
import $api from '@/config/openai';
import { RequestSchema } from './types';

const mutation = $api.useMutation('post', '/api/endpoint', {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
});

// Validate before executing mutation
const handleSubmit = (formData: unknown) => {
  try {
    const validated = RequestSchema.parse(formData);
    mutation.mutate({ body: validated });
  } catch (error) {
    console.error('Validation error:', error);
  }
};
```

### Custom Hook
```typescript
export function useCustomHook() {
  const [state, setState] = useState();
  // logic
  return { state, setState };
}
```

### Zustand Store
```typescript
interface Store {
  value: string;
  setValue: (value: string) => void;
}

export const useStore = create<Store>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));

// Export selectors for derived state (preferred over getters)
export const selectUpperValue = (state: Store) => state.value.toUpperCase();
```

### Using Zustand Selectors
```typescript
import { useStore, selectUpperValue } from './store';

function Component() {
  // Use selector for derived/computed state (optimized re-renders)
  const upperValue = useStore(selectUpperValue);
  
  // Or access state directly
  const { value, setValue } = useStore();
}
```

### Feature Flags
```typescript
import { useFeatureFlag } from '@/shared/hooks/useFeatureFlag';

function Component() {
  // Check if a feature is enabled
  const isFeatureEnabled = useFeatureFlag('my-feature');
  
  if (!isFeatureEnabled) {
    return null; // Feature is disabled
  }
  
  return <div>Feature content</div>;
}
```

For route guards:
```typescript
import { useFeatureFlagStore } from '@/shared/stores/featureFlags';

export const Route = createFileRoute('/my-feature')({
  beforeLoad: () => {
    const isEnabled = useFeatureFlagStore.getState().isFeatureEnabled('my-feature');
    if (!isEnabled) {
      throw redirect({ to: '/home' });
    }
  },
  component: MyFeatureView,
});
```

### Translation Usage
```typescript
const { t } = useTranslation();
return <h1>{t('key.nested')}</h1>;
```

### SCSS Module Usage
```typescript
import styles from './Component.module.scss';

export function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello</h1>
    </div>
  );
}
```

```scss
// Component.module.scss
.container {
  padding: 1rem;
  background-color: var(--bg-primary);
  
  &:hover {
    background-color: var(--bg-secondary);
  }
}

.title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-inline-start: 1rem; // RTL-compatible
}
```

### Centered Layout Pattern
For forms and centered content with consistent widths:

```scss
// Form with centered, max-width constrained elements
.form {
  display: flex;
  flex-direction: column;
  align-items: center; // Centers all children
}

.inputGroup,
.error,
.button {
  width: 100%;
  max-width: 480px; // Consistent max-width for all elements
}
```

This ensures all form elements (inputs, errors, buttons) have the same maximum width while remaining centered.

## File Naming

- Components: PascalCase (e.g., `UserProfile.tsx`)
- SCSS Modules: PascalCase with `.module.scss` suffix (e.g., `UserProfile.module.scss`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Stores: camelCase with `Store` suffix (e.g., `userStore.ts`)
- Types: PascalCase (e.g., `User.ts`)

## When Adding New Features

1. Check if similar functionality exists
2. Follow existing patterns and structure
3. Break down complex components into smaller, focused pieces
4. Add translations for both languages
5. Update types and schemas
6. Test in both themes and languages
7. Ensure mobile responsiveness
8. Add proper error handling
9. Document complex logic
10. Consider component reusability and composition
