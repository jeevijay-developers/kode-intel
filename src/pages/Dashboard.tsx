import { AdminLayout } from "@/components/layout/AdminLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useSchools } from "@/hooks/useSchools";
import { useStudents } from "@/hooks/useStudents";
import { Building2, Users, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: schools, isLoading: schoolsLoading } = useSchools();
  const { data: students, isLoading: studentsLoading } = useStudents();

  const totalSchools = schools?.length || 0;
  const activeSchools = schools?.filter((s) => s.is_active).length || 0;
  const totalStudents = students?.length || 0;
  const activeStudents = students?.filter((s) => s.is_active).length || 0;
  const inactiveStudents = totalStudents - activeStudents;

  const recentSchools = schools?.slice(0, 5) || [];
  const recentStudents = students?.slice(0, 5) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your LMS system</p>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {schoolsLoading || studentsLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[120px]" />
              ))}
            </>
          ) : (
            <>
              <MetricCard
                title="Total Schools"
                value={totalSchools}
                description={`${activeSchools} active`}
                icon={<Building2 className="h-5 w-5" />}
              />
              <MetricCard
                title="Total Students"
                value={totalStudents}
                description="Across all schools"
                icon={<Users className="h-5 w-5" />}
              />
              <MetricCard
                title="Active Students"
                value={activeStudents}
                description="With active access"
                icon={<UserCheck className="h-5 w-5" />}
              />
              <MetricCard
                title="Inactive Students"
                value={inactiveStudents}
                description="Access revoked"
                icon={<UserX className="h-5 w-5" />}
              />
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Schools</CardTitle>
            </CardHeader>
            <CardContent>
              {schoolsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentSchools.length === 0 ? (
                <p className="text-muted-foreground text-sm">No schools added yet</p>
              ) : (
                <div className="space-y-3">
                  {recentSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{school.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {school.school_code} • {school.city}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          school.is_active
                            ? "bg-primary/20 text-primary"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {school.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Students</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentStudents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No students added yet</p>
              ) : (
                <div className="space-y-3">
                  {recentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{student.student_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Class {student.class}
                          {student.section ? `-${student.section}` : ""} • {student.schools?.name}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          student.is_active
                            ? "bg-primary/20 text-primary"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {student.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
