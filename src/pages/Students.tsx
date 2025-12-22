import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useSchools } from "@/hooks/useSchools";
import { useStudents, useUpdateStudent, useBulkUpdateStudents, type Student } from "@/hooks/useStudents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, RefreshCw, UserX, UserCheck, Download } from "lucide-react";
import { generateTempPassword, exportCredentialsToCSV, downloadCSV } from "@/lib/credentials";

const CLASS_OPTIONS = ["3", "4", "5", "6", "7", "8", "9", "10"];

export default function Students() {
  const { data: schools } = useSchools();
  const [schoolFilter, setSchoolFilter] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: students, isLoading } = useStudents({
    schoolId: schoolFilter || undefined,
    class: classFilter || undefined,
    isActive: statusFilter === "" ? undefined : statusFilter === "active",
    search: searchQuery || undefined,
  });

  const updateStudent = useUpdateStudent();
  const bulkUpdate = useBulkUpdateStudents();

  const handleSelectAll = (checked: boolean) => {
    if (checked && students) {
      setSelectedIds(new Set(students.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleToggleActive = async (student: Student) => {
    await updateStudent.mutateAsync({ id: student.id, is_active: !student.is_active });
  };

  const handleResetPassword = async (student: Student) => {
    const newPassword = generateTempPassword();
    await updateStudent.mutateAsync({ id: student.id, temp_password: newPassword });
  };

  const handleBulkActivate = async () => {
    await bulkUpdate.mutateAsync({ ids: Array.from(selectedIds), update: { is_active: true } });
    setSelectedIds(new Set());
  };

  const handleBulkDeactivate = async () => {
    await bulkUpdate.mutateAsync({ ids: Array.from(selectedIds), update: { is_active: false } });
    setSelectedIds(new Set());
  };

  const handleExportSelected = () => {
    if (!students) return;
    const selected = students.filter((s) => selectedIds.has(s.id));
    const csv = exportCredentialsToCSV(selected);
    downloadCSV(csv, `students_export_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const isAllSelected = students && students.length > 0 && selectedIds.size === students.length;
  const isSomeSelected = selectedIds.size > 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground">Manage all students across schools</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={schoolFilter || "all"} onValueChange={(v) => setSchoolFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools?.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={classFilter || "all"} onValueChange={(v) => setClassFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {CLASS_OPTIONS.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {isSomeSelected && (
          <div className="flex items-center gap-4 p-3 bg-accent rounded-lg">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <Button size="sm" variant="outline" onClick={handleBulkActivate}>
              <UserCheck className="h-4 w-4 mr-1" />
              Activate
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkDeactivate}>
              <UserX className="h-4 w-4 mr-1" />
              Deactivate
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportSelected}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : students?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students?.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(student.id)}
                        onCheckedChange={(checked) => handleSelectOne(student.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.student_name}</p>
                        {student.email && (
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.schools?.name}</Badge>
                    </TableCell>
                    <TableCell>
                      {student.class}
                      {student.section && `-${student.section}`}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{student.username}</TableCell>
                    <TableCell>{student.mobile_number}</TableCell>
                    <TableCell>
                      <Switch
                        checked={student.is_active}
                        onCheckedChange={() => handleToggleActive(student)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleResetPassword(student)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(student)}>
                            {student.is_active ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
