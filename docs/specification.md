Functional Specification Document: Movie Tracker Web Application

Name of the website: masxflix
Version: 1.1
Date: 2023-10-27

1. Introduction

1.1. Purpose: This document outlines the functional requirements for a web-based Movie Tracking Application. The application will allow authenticated users to browse movies from an online database, view them organized by categories, rate movies, track their watch status, add personal notes, securely manage their movie tracking data through user accounts, and search for movies using both standard fuzzy search and AI-powered descriptive search.

1.2. Scope: The application will focus on discovering, viewing, tracking, and searching movies for logged-in users. It will utilize Clerk for user authentication and management. It will retrieve movie data from an external API (e.g., TMDb) and leverage the Google Gemini API for AI-based search. User-specific data (ratings, status, notes) will be associated with individual user accounts and stored persistently in a backend database. Anonymous browsing features (viewing movies without logging in) are out of scope for this version but can be considered later.

1.3. Target Audience: Individuals who watch movies and want a personalized, account-based way to discover new titles, track their viewing history, manage a watchlist, and keep notes across different sessions and potentially devices.

2. User Roles

2.1. Authenticated User: A user who has successfully registered and logged in via Clerk. All functionalities described below pertain to this role, as actions like rating or saving notes require user identification.

3. Functional Requirements

(Note: All user-specific actions FR2.x, FR3.x are performed in the context of the currently logged-in Authenticated User)

FR1: Home Page Display

FR1.1: The application shall display a home page upon loading. If the user is not authenticated, they might be redirected to a login page (See FR9) or see a limited view prompting login. If authenticated, the full home page is shown.

FR1.2: The home page shall feature multiple horizontally scrollable rows, each representing a specific movie category.

FR1.3: Default categories shall include, but are not limited to: Trending Now, Top Rated, Action, Comedy, Horror, Sci-Fi, Documentary, (Additional genres based on API availability).

FR1.4: Each category row shall display a subset of relevant movie posters.

FR1.5: Each movie poster displayed shall be clickable (leading to details or interaction, TBD design).

FR1.6: Each category row shall feature a "See All" link or button, navigating the user to a dedicated page for that category (See FR5).

FR1.7: Movie data for categories shall be fetched dynamically from an external online movie database API.

FR1.8: When displaying movie items, the application should attempt to fetch and display the current user's saved rating, status, and note indicator for that movie, if available (See FR3).

FR2: Movie Item Interaction (within lists/grids)

FR2.1: Below or overlaid on each movie poster, the following interactive elements shall be present for authenticated users:

FR2.1.1: A star rating component (e.g., 5 interactive stars). Users can click a star to set their personal rating (1 to 5).

FR2.1.2: A dropdown menu for tracking watch status. Options: Watched, Want to Watch, Watching, Dropped, (No Status / Clear).

FR2.1.3: An icon or button to add/view personal notes for the movie.

FR2.2: User selections for star rating (FR2.1.1) must be saved persistently and associated with the authenticated user's account in the backend database (See FR10).

FR2.3: User selections for watch status (FR2.1.2) must be saved persistently and associated with the authenticated user's account in the backend database (See FR10).

FR2.4: Clicking the notes icon/button (FR2.1.3) shall open a modal or dedicated area. Typed notes must be saved persistently and associated with the authenticated user's account in the backend database (See FR10).

FR2.5: Saved ratings, status, and notes for a movie should be retrieved from the backend and reflected wherever that movie item is displayed for the logged-in user.

FR3: User Data Persistence

FR3.1: User authentication and session management will be handled externally by Clerk (See FR9).

FR3.2: All user-specific application data (ratings, watch status, notes per movie) shall be stored in a backend database (e.g., Vercel Postgres, Supabase).

FR3.3: Each piece of user-specific data stored in the database must be linked to the unique user ID provided by Clerk for the authenticated user.

FR3.4: Upon login, the application shall fetch the authenticated user's data as needed to populate the UI (e.g., showing existing ratings on movie cards).

FR3.5: Changes to user data (e.g., setting a rating, changing status, saving a note) must trigger an API call to the backend (See FR10) to update the database record associated with that user and movie.

FR3.6 (Optional): Client-side caching mechanisms (e.g., using state management libraries like React Query or SWR) should be employed to improve perceived performance, minimize redundant backend calls, and provide optimistic updates where appropriate.

FR4: Movie Details (Placeholder - Can be expanded later)

(Optional Scope) Clicking a movie poster could navigate to a dedicated details page showing API-fetched info and the user's saved interaction elements (FR2).

FR5: Category Page ("See All")

FR5.1: Accessible only to authenticated users. Clicking "See All" navigates to a page for that category.

FR5.2: Displays the category title.

FR5.3: Displays a paginated/infinitely scrolled list of movies in that category from the external API.

FR5.4: Each movie item includes the interaction elements (FR2), reflecting the user's saved data.

FR5.5: Pagination or infinite scrolling shall be implemented.

FR6: Standard Search (Fuzzy Finder)

FR6.1: A search input field shall be available to authenticated users.

FR6.2: Uses fuzzy search (e.g., Fuse.js) against the external movie database based on user input.

FR6.3: Tolerates typos and minor variations.

FR6.4: Displays results dynamically.

FR6.5: Each result item includes interaction elements (FR2), reflecting the user's saved data.

FR7: AI-Powered Search (Gemini API)

FR7.1: A distinct UI element for AI search shall be available to authenticated users.

FR7.2: Users input a natural language description.

FR7.3: On click, the description is sent to the Gemini API via the backend (to protect the API key).

FR7.4: Prompt instructs Gemini to return movie titles/years.

FR7.5: Backend receives the Gemini response.

FR7.6: Backend parses the list.

FR7.7: Backend (or frontend after receiving list from backend) searches the external movie DB API for details of suggested titles.

FR7.8: Displays matched movies.

FR7.9: Each result item includes interaction elements (FR2), reflecting the user's saved data.

FR7.10: Loading indicators shown.

FR7.11: Error handling implemented.

FR8: External API Integration

FR8.1: Integrates with an external movie database API (e.g., TMDb) for movie data. Calls may need to be proxied through the backend (FR10) if sensitive API keys are used or rate limits need server-side management.

FR8.2: Integrates with the Google Gemini API. Calls MUST be proxied through the backend (FR10) to protect the API key.

FR8.3: API keys for these services must be handled securely on the backend (See NFR5).

FR9: Authentication (Clerk)

FR9.1: The application shall integrate Clerk (using its React SDK) for user authentication flows: Sign Up, Sign In, Sign Out.

FR9.2: Utilize Clerk's pre-built UI components or hooks to provide standard, secure authentication forms/modals.

FR9.3: Provide prominent and clear UI elements for Sign In/Sign Up for unauthenticated users, and a Sign Out option for authenticated users (e.g., in the header).

FR9.4: Application state (UI, available features) shall dynamically change based on the user's authentication status obtained from Clerk.

FR9.5: Implement protected routes/components. Core features like rating, tracking, notes, and potentially viewing specific pages shall require the user to be authenticated. Unauthorized access attempts should redirect to the Sign In page.

FR9.6: Rely on Clerk for secure session management (e.g., JWT handling via cookies or headers).

FR9.7: Display basic logged-in user information (e.g., avatar, name/email) obtained from Clerk in the application's UI (e.g., header).

FR10: Backend API (for User Data & Secure API Calls)

FR10.1: A backend API layer shall be implemented (e.g., using Vercel Serverless Functions, Next.js API routes).

FR10.2: This API must handle CRUD (Create, Read, Update, Delete) operations for user-specific movie data (ratings, status, notes) stored in the backend database.

FR10.3: All API endpoints handling user data must be protected. They must verify the user's authentication status using Clerk's backend SDK (validating the JWT token sent from the frontend).

FR10.4: The API must ensure that data operations only affect the data belonging to the currently authenticated user (using the user ID from the verified Clerk token).

FR10.5: The API shall serve as a secure proxy for calls to the Gemini API (FR7.3, FR7.5). The backend function receives the description from the frontend, adds the secure Gemini API key, calls Gemini, and returns the result to the frontend.

FR10.6 (Optional but Recommended): The API may also proxy calls to the TMDb API (FR8.1) if needed for security or rate limiting.

4. Non-Functional Requirements

NFR1: Performance

NFR1.1: Initial page load within 3-4 seconds. Login/Auth state check should be fast.

NFR1.2: Smooth UI interactions (scrolling, opening modals).

NFR1.3: Fuzzy search results < 500ms after debounce.

NFR1.4: AI Search results within 5-12 seconds (includes backend processing and external API calls).

NFR1.5: Optimize database queries and API calls. Implement client-side caching (React Query/SWR) and potentially backend caching where appropriate.

NFR2: Usability

NFR2.1: Intuitive UI/UX, easy navigation. Clear distinction between logged-in/out states.

NFR2.2: Clear visual feedback for all interactions. Obvious loading states for data fetching/saving.

NFR2.3: Responsive design for desktop, tablet, mobile.

NFR3: Reliability

NFR3.1: Graceful handling of external API errors (TMDb, Gemini, Clerk).

NFR3.2: Graceful handling of backend API errors and database issues. Informative user messages.

NFR3.3: User data integrity must be maintained in the database.

NFR3.4: Dependency on Clerk for authentication uptime.

NFR4: Maintainability

NFR4.1: Well-structured React code, clear separation between UI, state management, and API logic. Well-organized backend function/API code.

NFR4.2: Use of TypeScript recommended for better type safety, especially with backend interactions.

NFR4.3: Manage dependencies appropriately.

NFR5: Security

NFR5.1: Utilize Clerk for secure authentication, password handling, and session management.

NFR5.2: Critical: TMDb and Gemini API keys MUST NOT be exposed on the client-side. They must be stored securely as environment variables on the backend (e.g., Vercel environment variables) and accessed only by the backend API functions (FR10).

NFR5.3: Backend API endpoints must rigorously enforce authentication and authorization, ensuring users can only access/modify their own data. Use Clerk's backend SDK for verification.

NFR5.4: Implement standard web security practices (e.g., input validation) on the backend.

NFR6: Scalability

NFR6.1: The chosen backend database should handle a growing number of users and data entries (Vercel Postgres, Supabase, Atlas are scalable).

NFR6.2: Vercel Serverless Functions scale automatically.

NFR6.3: Clerk is designed for scalable authentication.

5. Recommended Tech Stack (Updated)

Frontend Framework: React (Consider Next.js for its integrated API routes, simplifying backend development within the same project structure)

Authentication: Clerk (React SDK for frontend, Node.js SDK for backend/API routes)

State Management:

React Query or SWR: Highly recommended for managing server state (fetching/caching/mutating user data from your backend, fetching data from TMDb). Simplifies loading/error states.

Zustand or React Context: For managing global UI state (e.g., theme, modal visibility) if needed.

Routing: React Router (if using plain React/Vite) or Next.js built-in routing (if using Next.js). Needs integration with Clerk for protected routes.

Styling: Tailwind CSS, CSS Modules, Styled Components / Emotion.

Backend API:

Vercel Serverless Functions (Node.js) OR

Next.js API Routes (Node.js runtime) (Recommended if using Next.js frontend)

Database:

Vercel Postgres: Integrates seamlessly with Vercel.

Alternatives: Supabase (provides Postgres DB + other BaaS features), MongoDB Atlas (NoSQL).

ORM / Database Client: Prisma or Drizzle ORM

Why: Provides type safety, simplifies database interactions (queries, migrations) in the backend API code. Works well with TypeScript and the recommended databases.

API Client: Axios or Fetch API (Used in frontend to call your backend API, and in backend to call external TMDb/Gemini APIs).

Fuzzy Search Library: Fuse.js (Client-side for searching TMDb results).

External APIs: TMDb API, Google Gemini API.

Deployment: Vercel (Excellent support for Next.js, React, Serverless Functions, Environment Variables, and integrates with Vercel Postgres).

This updated specification reflects the shift to an authenticated application architecture using Clerk, requiring a backend component for secure data storage and API key management. This makes the application more robust and feature-rich but also increases development complexity compared to the initial local-storage-only version.
