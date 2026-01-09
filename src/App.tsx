import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StudentProtectedRoute } from "@/components/student/StudentProtectedRoute";
import PublicLayout from "@/components/layout/PublicLayout";
import StudentLayout from "@/components/student/StudentLayout";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import BulkUpload from "./pages/BulkUpload";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import CourseEditor from "./pages/CourseEditor";
import QuizManagement from "./pages/QuizManagement";
import CourseDetail from "./pages/CourseDetail";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import PublicCourses from "./pages/PublicCourses";
import About from "./pages/About";
import EStore from "./pages/EStore";
import SchoolPartnership from "./pages/SchoolPartnership";
import Contact from "./pages/Contact";
import StudentLogin from "./pages/student/StudentLogin";
import StudentSignup from "./pages/student/StudentSignup";
import StudentHome from "./pages/student/StudentHome";
import StudentMyCourses from "./pages/student/StudentMyCourses";
import StudentCourse from "./pages/student/StudentCourse";
import StudentProfile from "./pages/student/StudentProfile";
import StudentVideo from "./pages/student/StudentVideo";
import StudentEbook from "./pages/student/StudentEbook";
import StudentQuiz from "./pages/student/StudentQuiz";
import Compiler from "./pages/student/Compiler";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes with common header */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/courses" element={<PublicCourses />} />
              <Route path="/public-courses" element={<PublicCourses />} />
              <Route path="/course/:slug" element={<CourseDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/store" element={<EStore />} />
              <Route path="/schools" element={<SchoolPartnership />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Student auth routes (no sidebar) */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />

            {/* Student routes with sidebar layout */}
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentHome />} />
              <Route path="my-courses" element={<StudentMyCourses />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="achievements" element={<StudentHome />} />
            </Route>

            {/* Student content routes (full screen, no sidebar) */}
            <Route path="/student/course/:id" element={<StudentCourse />} />
            <Route path="/student/video/:videoId" element={<StudentVideo />} />
            <Route path="/student/ebook/:ebookId" element={<StudentEbook />} />
            <Route path="/student/quiz/:quizId" element={<StudentQuiz />} />

            {/* Compiler route */}
            <Route
              path="/compiler"
              element={
                <StudentProtectedRoute>
                  <Compiler />
                </StudentProtectedRoute>
              }
            />

            {/* Auth route (no header) */}
            <Route path="/auth" element={<Auth />} />

            {/* Admin routes (separate admin layout) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schools"
              element={
                <ProtectedRoute>
                  <Schools />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bulk-upload"
              element={
                <ProtectedRoute>
                  <BulkUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <ProtectedRoute>
                  <QuizManagement />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
