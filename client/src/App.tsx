import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/public-layout";
import { AboutPage } from "@/pages/public/about-page";
import { ApplyPage } from "@/pages/public/apply-page";
import { BlogPage } from "@/pages/public/blog-page";
import { ContactPage } from "@/pages/public/contact-page";
import { EmployersPage } from "@/pages/public/employers-page";
import { HomePage } from "@/pages/public/home-page";
import { RequestStaffPage } from "@/pages/public/request-staff-page";
import { ServicesPage } from "@/pages/public/services-page";
import { WorkersPage } from "@/pages/public/workers-page";
import { StaffLoginPage } from "@/pages/staff/staff-login-page";
import { StaffSignupPage } from "@/pages/staff/staff-signup-page";

function App() {
  return (
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
