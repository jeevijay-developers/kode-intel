import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DevToolsBlocker from "@/components/DevToolsBlocker";
import PublicLayout from "@/components/layout/PublicLayout";
import StudentLayout from "@/components/student/StudentLayout";
import GuestLayout from "@/components/student/GuestLayout";
import InstitutionLayout from "@/components/institution/InstitutionLayout";

// Lazy-load all pages to reduce initial bundle
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Schools = lazy(() => import("./pages/Schools"));
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const Students = lazy(() => import("./pages/Students"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseEditor = lazy(() => import("./pages/CourseEditor"));
const QuizManagement = lazy(() => import("./pages/QuizManagement"));
const CodingModuleManager = lazy(() => import("./pages/admin/CodingModuleManager"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Landing = lazy(() => import("./pages/Landing"));
const PublicCourses = lazy(() => import("./pages/PublicCourses"));
const About = lazy(() => import("./pages/About"));
const SchoolPartnership = lazy(() => import("./pages/SchoolPartnership"));
const Contact = lazy(() => import("./pages/Contact"));
const StudentLogin = lazy(() => import("./pages/student/StudentLogin"));
const StudentSignup = lazy(() => import("./pages/student/StudentSignup"));
const StudentHome = lazy(() => import("./pages/student/StudentHome"));
const StudentMyCourses = lazy(() => import("./pages/student/StudentMyCourses"));
const StudentCourse = lazy(() => import("./pages/student/StudentCourse"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const StudentVideo = lazy(() => import("./pages/student/StudentVideo"));
const StudentEbook = lazy(() => import("./pages/student/StudentEbook"));
const StudentQuiz = lazy(() => import("./pages/student/StudentQuiz"));
const BlockCodingLab = lazy(() => import("./pages/student/BlockCodingLab"));
const BlockCodingLesson = lazy(() => import("./pages/student/BlockCodingLesson"));
const DigitalBook = lazy(() => import("./pages/student/DigitalBook"));
const ChapterHome = lazy(() => import("./pages/student/ChapterHome"));
const ChapterWorksheet = lazy(() => import("./pages/student/ChapterWorksheet"));
const GuestDashboard = lazy(() => import("./pages/student/GuestDashboard"));
const GuestCourses = lazy(() => import("./pages/student/GuestCourses"));
const GuestAchievements = lazy(() => import("./pages/student/GuestAchievements"));
const GuestLeaderboard = lazy(() => import("./pages/student/GuestLeaderboard"));
const StudentLeaderboard = lazy(() => import("./pages/student/StudentLeaderboard"));
const StudentAchievements = lazy(() => import("./pages/student/StudentAchievements"));
const GuestQuiz = lazy(() => import("./pages/student/GuestQuiz"));
const GuestQuizList = lazy(() => import("./pages/student/GuestQuizList"));
const GuestDigitalBook = lazy(() => import("./pages/student/GuestDigitalBook"));
const InstitutionLogin = lazy(() => import("./pages/institution/InstitutionLogin"));
const InstitutionSignup = lazy(() => import("./pages/institution/InstitutionSignup"));
const InstitutionDashboard = lazy(() => import("./pages/institution/InstitutionDashboard"));
const InstitutionStudents = lazy(() => import("./pages/institution/InstitutionStudents"));
const InstitutionCourses = lazy(() => import("./pages/institution/InstitutionCourses"));
const InstitutionReports = lazy(() => import("./pages/institution/InstitutionReports"));
const InstitutionPayments = lazy(() => import("./pages/institution/InstitutionPayments"));
const InstitutionSettings = lazy(() => import("./pages/institution/InstitutionSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StudentProtectedRoute = lazy(() => import("./components/student/StudentProtectedRoute").then(m => ({ default: m.StudentProtectedRoute })));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DevToolsBlocker />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes with common header */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/courses" element={<PublicCourses />} />
                <Route path="/public-courses" element={<Navigate to="/courses" replace />} />
                <Route path="/course/:slug" element={<CourseDetail />} />
                <Route path="/about" element={<About />} />
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
              
              {/* Guest Digital Book route (outside layout for full-screen reading) */}
              <Route path="/guest/book/:bookId" element={<GuestDigitalBook />} />

              {/* Student routes with sidebar layout */}
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentHome />} />
                <Route path="my-courses" element={<StudentMyCourses />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="achievements" element={<StudentAchievements />} />
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
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
              <Route path="/admin/bulk-upload" element={<ProtectedRoute><BulkUpload /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/admin/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
              <Route path="/admin/courses/:id" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
              <Route path="/admin/quizzes" element={<ProtectedRoute><QuizManagement /></ProtectedRoute>} />
              <Route path="/admin/coding-modules" element={<ProtectedRoute><CodingModuleManager /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
