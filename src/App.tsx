import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourse from "./pages/student/StudentCourse";
import StudentProfile from "./pages/student/StudentProfile";
import StudentVideo from "./pages/student/StudentVideo";
import StudentEbook from "./pages/student/StudentEbook";
import StudentQuiz from "./pages/student/StudentQuiz";
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
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/courses" element={<PublicCourses />} />
          <Route path="/course/:slug" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Student routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/courses/:id" element={<StudentCourse />} />
          <Route path="/student/video/:videoId" element={<StudentVideo />} />
          <Route path="/student/ebook/:ebookId" element={<StudentEbook />} />
          <Route path="/student/quiz/:quizId" element={<StudentQuiz />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
          <Route path="/admin/bulk-upload" element={<ProtectedRoute><BulkUpload /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/admin/courses/:id" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
          <Route path="/admin/quizzes" element={<ProtectedRoute><QuizManagement /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
}

export default App;
