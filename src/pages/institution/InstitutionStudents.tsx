import { useState, useRef } from "react";
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
  DialogFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  FileSpreadsheet,
  Key,
  Pencil,
  Trash2,
  Power,
  AlertTriangle,
} from "lucide-react";
import type { Institution } from "@/hooks/useInstitutionAuth";

const classes = ["Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

interface Student {
  id: string;
  student_name: string;
  username: string;
  class: string;
  section?: string;
  mobile_number: string;
  email?: string;
  is_active: boolean;
  temp_password: string;
  created_at: string;
}

export default function InstitutionStudents() {
  const { institution } = useOutletContext<{ institution: Institution }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [bulkUploadData, setBulkUploadData] = useState<Array<{
    student_name: string;
    class: string;
    section?: string;
    mobile_number: string;
    email?: string;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
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

      return (studentData || []) as Student[];
    },
  });

  // Add student mutation
  const addStudent = useMutation({
    mutationFn: async (studentData: typeof newStudent) => {
      const timestamp = Date.now().toString().slice(-6);
      const username = `STU${timestamp}`;
      const tempPassword = `pass${timestamp}`;

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

  // Update student mutation
  const updateStudent = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Student> }) => {
      const { error } = await supabase
        .from("students")
        .update(data.updates)
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-students"] });
      toast({ title: "Student updated successfully!" });
      setIsEditOpen(false);
      setSelectedStudent(null);
    },
    onError: (error) => {
      toast({ title: "Failed to update student", description: error.message, variant: "destructive" });
    },
  });

  // Delete student mutation
  const deleteStudent = useMutation({
    mutationFn: async (studentId: string) => {
      // Remove from institution_students first
      await supabase
        .from("institution_students")
        .delete()
        .eq("student_id", studentId)
        .eq("institution_id", institution.id);

      // Then delete student
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-students"] });
      toast({ title: "Student removed successfully!" });
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
    },
    onError: (error) => {
      toast({ title: "Failed to remove student", description: error.message, variant: "destructive" });
    },
  });

  // Toggle student status
  const toggleStatus = useMutation({
    mutationFn: async (data: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("students")
        .update({ is_active: data.isActive })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["institution-students"] });
      toast({ title: variables.isActive ? "Student activated!" : "Student deactivated!" });
    },
    onError: (error) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  // Bulk upload mutation
  const bulkUpload = useMutation({
    mutationFn: async (studentsData: typeof bulkUploadData) => {
      const results = [];
      for (const studentData of studentsData) {
        const timestamp = Date.now().toString().slice(-6) + Math.random().toString(36).slice(2, 5);
        const username = `STU${timestamp}`;
        const tempPassword = `pass${timestamp.slice(0, 6)}`;

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

        if (studentError) {
          console.error("Failed to add student:", studentData.student_name, studentError);
          continue;
        }

        await supabase
          .from("institution_students")
          .insert({
            institution_id: institution.id,
            student_id: student.id,
          });

        results.push(student);
      }
      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["institution-students"] });
      toast({ title: `${results.length} students added successfully!` });
      setIsBulkUploadOpen(false);
      setBulkUploadData([]);
    },
    onError: (error) => {
      toast({ title: "Bulk upload failed", description: error.message, variant: "destructive" });
    },
  });

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const parsedData = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return {
          student_name: values[headers.indexOf("name")] || values[headers.indexOf("student_name")] || "",
          class: values[headers.indexOf("class")] || "",
          section: values[headers.indexOf("section")] || "",
          mobile_number: values[headers.indexOf("mobile")] || values[headers.indexOf("mobile_number")] || values[headers.indexOf("phone")] || "",
          email: values[headers.indexOf("email")] || "",
        };
      }).filter((s) => s.student_name && s.class && s.mobile_number);

      setBulkUploadData(parsedData);
      setIsBulkUploadOpen(true);
    };
    reader.readAsText(file);
  };

  // Download credentials as CSV
  const downloadCredentials = () => {
    const csvContent = [
      "Student Name,Username,Password,Class,Section,Mobile",
      ...students.map((s) =>
        `${s.student_name},${s.username},${s.temp_password},${s.class},${s.section || ""},${s.mobile_number}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${institution.institution_name.replace(/\s+/g, "_")}_credentials.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Credentials downloaded!" });
  };

  // Download sample CSV template
  const downloadTemplate = () => {
    const csvContent = "name,class,section,mobile,email\nJohn Doe,Class 5,A,9876543210,john@example.com\nJane Smith,Class 6,B,9876543211,";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_upload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
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
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </Button>
          <Button variant="outline" className="gap-2" onClick={downloadCredentials} disabled={students.length === 0}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Credentials</span>
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-lime" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.filter((s) => s.is_active).length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-coral" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.filter((s) => !s.is_active).length}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sunny/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-sunny" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(students.map((s) => s.class)).size}</p>
                <p className="text-xs text-muted-foreground">Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <div className="flex justify-center gap-2">
                  <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
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
                  {filteredStudents.map((student) => (
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedStudent(student);
                              setIsEditOpen(true);
                            }}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(`Username: ${student.username}\nPassword: ${student.temp_password}`);
                              toast({ title: "Credentials copied!" });
                            }}>
                              <Key className="h-4 w-4 mr-2" />
                              Copy Credentials
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus.mutate({ id: student.id, isActive: !student.is_active })}>
                              <Power className="h-4 w-4 mr-2" />
                              {student.is_active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-coral"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Student Name *</Label>
                <Input
                  value={selectedStudent.student_name}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, student_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select
                    value={selectedStudent.class}
                    onValueChange={(v) => setSelectedStudent({ ...selectedStudent, class: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    value={selectedStudent.section || ""}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, section: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input
                  value={selectedStudent.mobile_number}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, mobile_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={selectedStudent.email || ""}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => updateStudent.mutate({
                    id: selectedStudent.id,
                    updates: {
                      student_name: selectedStudent.student_name,
                      class: selectedStudent.class,
                      section: selectedStudent.section,
                      mobile_number: selectedStudent.mobile_number,
                      email: selectedStudent.email,
                    },
                  })}
                  disabled={updateStudent.isPending}
                >
                  {updateStudent.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Upload Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {bulkUploadData.length} students will be added. Review and confirm.
            </p>
            <div className="max-h-64 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Mobile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkUploadData.slice(0, 10).map((student, i) => (
                    <TableRow key={i}>
                      <TableCell>{student.student_name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.section || "-"}</TableCell>
                      <TableCell>{student.mobile_number}</TableCell>
                    </TableRow>
                  ))}
                  {bulkUploadData.length > 10 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        ... and {bulkUploadData.length - 10} more
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(false)}>Cancel</Button>
            <Button
              onClick={() => bulkUpload.mutate(bulkUploadData)}
              disabled={bulkUpload.isPending}
            >
              {bulkUpload.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Upload {bulkUploadData.length} Students
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-coral" />
              Delete Student
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedStudent?.student_name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-coral hover:bg-coral/90"
              onClick={() => selectedStudent && deleteStudent.mutate(selectedStudent.id)}
            >
              {deleteStudent.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
