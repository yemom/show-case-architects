# Test Plan

## Scope
- Public pages: Home, About, Services, Service Detail, Portfolio, Contact, Blog Detail, Not Found
- Admin pages: Login, Signup, Forgot Password, Reset Password, Reset Password (Code), Dashboard, Add Blog, List Blog, Comments, Admin Requests
- API endpoints used by the UI

## Environments
- Local dev: Vite at http://localhost:8080
- API: http://127.0.0.1:3000 (or proxy via Vite)
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome

## Functional Testing
- Navigation links route correctly from the header and CTA buttons
- Services detail renders content based on slug
- Portfolio loads projects, filters by category, and handles empty state
- Blog detail loads content and comments; comment submission works
- Admin auth flows: login, request access, forgot/reset password
- Admin workflows: add blog, list blog, comments moderation, admin approval

## UI / UX Testing
- Visual hierarchy on hero sections and CTAs
- Consistent spacing and typography across sections
- Hover states for buttons and cards
- Form validation feedback is clear and timely

## Responsive Testing
- Breakpoints: 390, 768, 1024, 1280 widths
- Mobile menu opens and closes; links are usable
- Images and cards do not overflow or clip

## Cross-Browser Testing
- Chromium, Firefox, WebKit, Mobile Chrome
- Verify layout and navigation behavior

## Performance Testing
- Lighthouse or WebPageTest for First Contentful Paint (FCP) and LCP
- Image/video loading: ensure lazy loading or optimized sizes

## Security Testing
- Check for exposed secrets in frontend
- Ensure admin routes require auth; verify 401 handling
- Verify file uploads validate type and size on backend

## Accessibility Testing
- Headings follow logical order
- All buttons and links are reachable by keyboard
- Color contrast for text on gradients
- Form labels are present for inputs

## Form & Input Validation Testing
- Contact form required fields, email format, submit state
- Admin login, signup, reset flows validate inputs
- Blog add form validates required fields

## API & Backend Testing
- /api/blog/all returns list
- /api/blog/:id returns detail
- /api/blog/comment/:id returns comments
- /api/blog/add-comment accepts payload
- /api/admin/login returns token
- /api/admin/dashboard/admins/blogs/comment endpoints return data

## Deployment & Production Testing
- Build succeeds: npm run build
- Preview works: npm run preview
- Verify base URLs and proxy settings

## Regression Testing
- Re-run smoke suite after UI changes and backend updates
- Focus on navigation and core flows

## Automated Tests
- Playwright E2E smoke tests (routes and basic UI presence)
- Mobile menu toggle test
- API routes mocked for deterministic results

## How to Run
- Install browsers: npx playwright install
- Run E2E: npm run test:e2e
- Optional base URL override: set PLAYWRIGHT_BASE_URL
