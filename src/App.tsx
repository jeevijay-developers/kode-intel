import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StudentProtectedRoute } from "@/components/student/StudentProtectedRoute";
import DevToolsBlocker from "@/components/DevToolsBlocker";
import PublicLayout from "@/components/layout/PublicLayout";
import StudentLayout from "@/components/student/StudentLayout";
import GuestLayout from "@/components/student/GuestLayout";
import InstitutionLayout from "@/components/institution/InstitutionLayout";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import BulkUpload from "./pages/BulkUpload";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import CourseEditor from "./pages/CourseEditor";
import QuizManagement from "./pages/QuizManagement";
import CodingModuleManager from "./pages/admin/CodingModuleManager";
import CourseDetail from "./pages/CourseDetail";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import PublicCourses from "./pages/PublicCourses";
import About from "./pages/About";
import EStore from "./pages/EStore";
import BookDetail from "./pages/BookDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
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
import BlockCodingLab from "./pages/student/BlockCodingLab";
import BlockCodingLesson from "./pages/student/BlockCodingLesson";
import DigitalBook from "./pages/student/DigitalBook";
import ChapterHome from "./pages/student/ChapterHome";
import ChapterWorksheet from "./pages/student/ChapterWorksheet";
import GuestDashboard from "./pages/student/GuestDashboard";
import GuestCourses from "./pages/student/GuestCourses";
import GuestAchievements from "./pages/student/GuestAchievements";
import GuestLeaderboard from "./pages/student/GuestLeaderboard";
import StudentLeaderboard from "./pages/student/StudentLeaderboard";
import GuestQuiz from "./pages/student/GuestQuiz";
import GuestQuizList from "./pages/student/GuestQuizList";
import InstitutionLogin from "./pages/institution/InstitutionLogin";
import InstitutionSignup from "./pages/institution/InstitutionSignup";
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import InstitutionStudents from "./pages/institution/InstitutionStudents";
import InstitutionCourses from "./pages/institution/InstitutionCourses";
import InstitutionReports from "./pages/institution/InstitutionReports";
import InstitutionPayments from "./pages/institution/InstitutionPayments";
import InstitutionSettings from "./pages/institution/InstitutionSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DevToolsBlocker />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes with common header */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/courses" element={<PublicCourses />} />
              <Route path="/public-courses" element={<PublicCourses />} />
              <Route path="/course/:slug" element={<CourseDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/store" element={<EStore />} />
              <Route path="/store/book/:bookId" element={<BookDetail />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/schools" element={<SchoolPartnership />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Student auth routes (no sidebar) */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />

            {/* Guest routes with full dashboard layout */}
            <Route path="/guest" element={<GuestLayout />}>
              <Route index element={<GuestDashboard />} />
              <Route path="courses" element={<GuestCourses />} />
              <Route path="achievements" element={<GuestAchievements />} />
              <Route path="leaderboard" element={<GuestLeaderboard />} />
              <Route path="quiz" element={<GuestQuizList />} />
              <Route path="quiz/:quizId" element={<GuestQuiz />} />
            </Route>

            {/* Student routes with sidebar layout */}
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<StudentHome />} />
              <Route path="my-courses" element={<StudentMyCourses />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="achievements" element={<StudentHome />} />
              <Route path="leaderboard" element={<StudentLeaderboard />} />
            </Route>

            {/* Student content routes (full screen, no sidebar) */}
            <Route path="/student/course/:id" element={<StudentCourse />} />
            <Route path="/student/courses/:id" element={<StudentCourse />} />
            <Route path="/student/video/:videoId" element={<StudentVideo />} />
            <Route path="/student/ebook/:ebookId" element={<StudentEbook />} />
            <Route path="/student/quiz/:quizId" element={<StudentQuiz />} />
            
            {/* Digital Book System routes */}
            <Route path="/student/chapter/:chapterId" element={<ChapterHome />} />
            <Route path="/student/book/:bookId" element={<DigitalBook />} />
            <Route path="/student/worksheet/:chapterId" element={<ChapterWorksheet />} />

            {/* Block Coding Lab - accessible to all */}
            <Route path="/codelab" element={<BlockCodingLab />} />
            <Route path="/compiler" element={<BlockCodingLab />} />
            <Route path="/guest/compiler" element={<BlockCodingLab />} />
            <Route path="/student/coding/:moduleId" element={<BlockCodingLesson />} />

            {/* Institution auth routes */}
            <Route path="/institution/login" element={<InstitutionLogin />} />
            <Route path="/institution/signup" element={<InstitutionSignup />} />

            {/* Institution dashboard routes */}
            <Route path="/institution" element={<InstitutionLayout />}>
              <Route index element={<InstitutionDashboard />} />
              <Route path="students" element={<InstitutionStudents />} />
              <Route path="courses" element={<InstitutionCourses />} />
              <Route path="reports" element={<InstitutionReports />} />
              <Route path="payments" element={<InstitutionPayments />} />
              <Route path="settings" element={<InstitutionSettings />} />
            </Route>

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
            <Route
              path="/admin/coding-modules"
              element={
                <ProtectedRoute>
                  <CodingModuleManager />
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
