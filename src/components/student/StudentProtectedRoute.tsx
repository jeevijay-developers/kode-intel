import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "@/hooks/useStudentAuth";

interface StudentProtectedRouteProps {
  children: React.ReactNode;
}

export function StudentProtectedRoute({ children }: StudentProtectedRouteProps) {
  const { student, loading } = useStudentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !student) {
      navigate("/student/login");
    }
  }, [student, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return <>{children}</>;
}
