import { test, expect } from "@playwright/test";

const mockApi = async (page: import("@playwright/test").Page) => {
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;

    if (path === "/api/blog/all") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          blogs: [
            {
              _id: "sample-1",
              title: "Sample Project",
              subTitle: "Modern Living",
              description: "<p>Sample description</p>",
              category: "Living Room",
              createdAt: new Date().toISOString(),
              image: null,
              video: null,
            },
          ],
        }),
      });
    }

    if (path.startsWith("/api/blog/") && path.split("/").length === 4) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          blog: {
            _id: "sample-1",
            title: "Sample Project",
            subTitle: "Modern Living",
            description: "<p>Sample description</p>",
            category: "Living Room",
            createdAt: new Date().toISOString(),
            image: null,
            video: null,
          },
        }),
      });
    }

    if (path.startsWith("/api/blog/comment/")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, comments: [] }),
      });
    }

    if (path === "/api/blog/add-comment" || path === "/api/blog/comment") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    }

    if (path === "/api/admin/dashboard") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          dashboardData: {
            blogs: 0,
            comments: 0,
            drafts: 0,
            recentBlogs: [],
          },
        }),
      });
    }

    if (path === "/api/admin/blogs") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, blogs: [] }),
      });
    }

    if (path === "/api/admin/comment") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, comments: [] }),
      });
    }

    if (path === "/api/admin/admins") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, admins: [] }),
      });
    }

    if (path === "/api/admin/request-access") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "Request submitted" }),
      });
    }

    if (
      path === "/api/admin/forgot-password-code" ||
      path === "/api/admin/reset-password-code" ||
      path === "/api/admin/reset-password"
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    }

    return route.fallback();
  });
};

const routes = [
  { path: "/", heading: /Designing/i },
  { path: "/about", heading: /About.*Studio/i },
  { path: "/services", heading: /Our\s+Services/i },
  { path: "/services/architectural-design", heading: /Architectural Design/i },
  { path: "/portfolio", heading: /Our\s+Portfolio/i },
  { path: "/blog/sample-1", heading: /Sample Project/i },
  { path: "/contact", heading: /Contact.*Team/i },
  { path: "/admin/login", heading: /Admin\s+Login/i },
  { path: "/admin/signup", heading: /Admin\s+Access/i },
  { path: "/admin/forgot-password", heading: /Forgot\s+Password/i },
  { path: "/admin/reset-password-code?email=test%40example.com", heading: /Reset\s+Password\s+\(Code\)/i },
  { path: "/admin/reset-password?email=test%40example.com&token=abc", heading: /Reset\s+Password/i },
  { path: "/admin", text: /Logout/i },
  { path: "/admin/add-blog", text: /Project Title/i },
  { path: "/admin/list-blog", text: /All Post/i },
  { path: "/admin/comments", text: /Comments/i },
  { path: "/admin/requests", text: /Admin Requests/i },
  { path: "/missing-page", heading: /404/i },
];

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test.describe("Route smoke tests", () => {
  for (const route of routes) {
    test(`renders ${route.path}`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      if (route.heading) {
        await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
      } else if (route.text) {
        await expect(page.getByText(route.text)).toBeVisible();
      }
    });
  }
});

test("mobile menu opens on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
});
