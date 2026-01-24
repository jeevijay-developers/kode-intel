import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Upload,
  Download,
  Users,
  UserPlus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import type { Institution } from "@/hooks/useInstitutionAuth";

const classes = ["Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export default function InstitutionStudents() {
  const { institution } = useOutletContext<{ institution: Institution }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_name: "",
    class: "",
    section: "",
    mobile_number: "",
    email: "",
  });

  // Fetch institution's students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["institution-students", institution.id],
    queryFn: async () => {
      const { data: mappings } = await supabase
        .from("institution_students")
        .select("student_id")
        .eq("institution_id", institution.id);

      if (!mappings || mappings.length === 0) return [];

      const studentIds = mappings.map((m: { student_id: string }) => m.student_id);
      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .in("id", studentIds)
        .order("created_at", { ascending: false });

      return studentData || [];
    },
  });

  // Add student mutation
  const addStudent = useMutation({
    mutationFn: async (studentData: typeof newStudent) => {
      // Generate username
      const timestamp = Date.now().toString().slice(-6);
      const username = `STU${timestamp}`;
      const tempPassword = `pass${timestamp}`;

      // Create student
      const { data: student, error: studentError } = await supabase
        .from("students")
        .insert({
          student_name: studentData.student_name,
          class: studentData.class,
          section: studentData.section || null,
          mobile_number: studentData.mobile_number,
          email: studentData.email || null,
          username,
          temp_password: tempPassword,
          student_type: "school_provided",
          school_id: null,
        })
        .select()
        .single();

      if (studentError) throw studentError;

      // Link to institution
      const { error: linkError } = await supabase
        .from("institution_students")
        .insert({
          institution_id: institution.id,
          student_id: student.id,
        });

      if (linkError) throw linkError;

      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-students"] });
      toast({ title: "Student added successfully!" });
      setIsAddOpen(false);
      setNewStudent({ student_name: "", class: "", section: "", mobile_number: "", email: "" });
    },
    onError: (error) => {
      toast({ title: "Failed to add student", description: error.message, variant: "destructive" });
    },
  });

  // Filter students
  const filteredStudents = students.filter((student: { student_name: string; class: string; username: string }) => {
    const matchesSearch =
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Student Management</h1>
          <p className="text-muted-foreground">
            Manage your institution's students
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Student Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={newStudent.student_name}
                    onChange={(e) => setNewStudent({ ...newStudent, student_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Class *</Label>
                    <Select
                      value={newStudent.class}
                      onValueChange={(v) => setNewStudent({ ...newStudent, class: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Input
                      placeholder="A, B, C..."
                      value={newStudent.section}
                      onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input
                    type="tel"
                    placeholder="Parent/Guardian mobile"
                    value={newStudent.mobile_number}
                    onChange={(e) => setNewStudent({ ...newStudent, mobile_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email (Optional)</Label>
                  <Input
                    type="email"
                    placeholder="student@email.com"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => addStudent.mutate(newStudent)}
                  disabled={!newStudent.student_name || !newStudent.class || !newStudent.mobile_number || addStudent.isPending}
                >
                  {addStudent.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No students found</p>
              <p className="text-muted-foreground mb-4">
                {students.length === 0 ? "Add your first student to get started" : "Try adjusting your filters"}
              </p>
              {students.length === 0 && (
                <Button onClick={() => setIsAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student: {
                    id: string;
                    student_name: string;
                    username: string;
                    class: string;
                    section?: string;
                    mobile_number: string;
                    is_active: boolean;
                  }) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.student_name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{student.username}</code>
                      </TableCell>
                      <TableCell>
                        {student.class}
                        {student.section && ` - ${student.section}`}
                      </TableCell>
                      <TableCell>{student.mobile_number}</TableCell>
                      <TableCell>
                        {student.is_active ? (
                          <Badge className="bg-lime/20 text-lime gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}