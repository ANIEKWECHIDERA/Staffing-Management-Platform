import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthProvider } from "@/contexts/auth-context";
import { PublicLayout } from "@/layouts/public-layout";

const AppDashboardPage = lazy(() =>
  import("@/pages/app/app-dashboard-page").then((module) => ({
    default: module.AppDashboardPage,
  })),
);
const AboutPage = lazy(() =>
  import("@/pages/public/about-page").then((module) => ({ default: module.AboutPage })),
);
const ApplyPage = lazy(() =>
  import("@/pages/public/apply-page").then((module) => ({ default: module.ApplyPage })),
);
const BlogPage = lazy(() =>
  import("@/pages/public/blog-page").then((module) => ({ default: module.BlogPage })),
);
const ContactPage = lazy(() =>
  import("@/pages/public/contact-page").then((module) => ({ default: module.ContactPage })),
);
const EmployersPage = lazy(() =>
  import("@/pages/public/employers-page").then((module) => ({ default: module.EmployersPage })),
);
const HomePage = lazy(() =>
  import("@/pages/public/home-page").then((module) => ({ default: module.HomePage })),
);
const RequestStaffPage = lazy(() =>
  import("@/pages/public/request-staff-page").then((module) => ({ default: module.RequestStaffPage })),
);
const ServicesPage = lazy(() =>
  import("@/pages/public/services-page").then((module) => ({ default: module.ServicesPage })),
);
const WorkersPage = lazy(() =>
  import("@/pages/public/workers-page").then((module) => ({ default: module.WorkersPage })),
);
const StaffAcceptInvitePage = lazy(() =>
  import("@/pages/staff/staff-accept-invite-page").then((module) => ({
    default: module.StaffAcceptInvitePage,
  })),
);
const StaffForgotPasswordPage = lazy(() =>
  import("@/pages/staff/staff-forgot-password-page").then((module) => ({
    default: module.StaffForgotPasswordPage,
  })),
);
const StaffLoginPage = lazy(() =>
  import("@/pages/staff/staff-login-page").then((module) => ({
    default: module.StaffLoginPage,
  })),
);
const StaffResetPasswordPage = lazy(() =>
  import("@/pages/staff/staff-reset-password-page").then((module) => ({
    default: module.StaffResetPasswordPage,
  })),
);
const StaffSignupPage = lazy(() =>
  import("@/pages/staff/staff-signup-page").then((module) => ({
    default: module.StaffSignupPage,
  })),
);

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="rounded-[1.5rem] border bg-card px-6 py-5 text-sm text-muted-foreground">
        Loading page...
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/for-employers" element={<EmployersPage />} />
            <Route path="/for-workers" element={<WorkersPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/request-staff" element={<RequestStaffPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/staff/signup" element={<StaffSignupPage />} />
          <Route path="/staff/forgot-password" element={<StaffForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<StaffResetPasswordPage />} />
          <Route path="/auth/accept-invite" element={<StaffAcceptInvitePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppDashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
