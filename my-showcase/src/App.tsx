import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Index from "./page/index";
import About from "./page/About";
import Services from "./page/Service";
import ServiceDetail from "./page/ServiceDetail";
import Portfolio from "./page/Portfolio";
import Contact from "./page/Contact";
import NotFound from "./page/NotFound";
import BlogDetail from "./page/BlogDetail";
// Admin pages
import AdminLayout from "./page/admin/Layout.tsx";
import AdminDashboard from "./page/admin/Dashboard.tsx";
import AdminAddBlog from "./page/admin/AddBlog.tsx";
import AdminListBlog from "./page/admin/ListBlog.tsx";
import AdminComment from "./page/admin/Comment.tsx";
import AdminRequests from "./page/admin/AdminRequests.tsx";
import AdminLogin from "./components/admin/Login.tsx";
import AdminForgotPassword from "./components/admin/ForgotPassword.tsx";
import AdminResetPassword from "./components/admin/ResetPassword.tsx";
import AdminResetPasswordCode from "./components/admin/ResetPasswordCode.tsx";
import AdminSignup from "./components/admin/Signup.tsx";

const router = createBrowserRouter([
  // Back-compat redirects for old admin paths
  { path: "/admin/Addblog", element: <Navigate to="/admin/add-blog" replace /> },
  { path: "/admin/ListBlog", element: <Navigate to="/admin/list-blog" replace /> },
  { path: "/admin/Comment", element: <Navigate to="/admin/comments" replace /> },
  { path: "/", element: <Index /> },
  { path: "/about", element: <About /> },
  { path: "/services", element: <Services /> },
  { path: "/services/:slug", element: <ServiceDetail /> },
  { path: "/portfolio", element: <Portfolio /> },
  { path: "/blog/:id", element: <BlogDetail /> },
  { path: "/contact", element: <Contact /> },
  // Legacy login redirect
  { path: "/login", element: <Navigate to="/admin/login" replace /> },
  // Legacy/public signup redirect
  { path: "/signup", element: <Navigate to="/admin/signup" replace /> },
  // Admin auth
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/signup", element: <AdminSignup /> },
  { path: "/admin/forgot-password", element: <AdminForgotPassword /> },
  { path: "/admin/reset-password", element: <AdminResetPassword /> },
  { path: "/admin/reset-password-code", element: <AdminResetPasswordCode /> },
  // Admin app
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "add-blog", element: <AdminAddBlog /> },
      { path: "list-blog", element: <AdminListBlog /> },
      { path: "comments", element: <AdminComment /> },
      { path: "requests", element: <AdminRequests /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <RouterProvider
    router={router}
    future={{ v7_startTransition: true }}
  />
);

export default App;
