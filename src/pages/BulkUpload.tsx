import { useState, useRef, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useSchools, type School } from "@/hooks/useSchools";
import { useBulkCreateStudents, type StudentInsert } from "@/hooks/useStudents";
import { parseCSV, generateCSVTemplate, type ParsedStudent, type ParseResult } from "@/lib/csvParser";
import { generateUsername, generateTempPassword, exportCredentialsToCSV, downloadCSV } from "@/lib/credentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "upload" | "preview" | "success";

export default function BulkUpload() {
  const { data: schools } = useSchools();
  const bulkCreate = useBulkCreateStudents();

  const [step, setStep] = useState<Step>("upload");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [editedStudents, setEditedStudents] = useState<ParsedStudent[]>([]);
  const [createdStudents, setCreatedStudents] = useState<StudentInsert[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    downloadCSV(template, "student_upload_template.csv");
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseCSV(content);
      setParseResult(result);
      setEditedStudents(result.students);
      setStep("preview");
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleEditStudent = (index: number, field: keyof ParsedStudent, value: string) => {
    setEditedStudents((prev) => {
      const updated = [...prev];
      const student = { ...updated[index], [field]: value };
      
      // Re-validate
      const errors: string[] = [];
      if (!student.student_name) errors.push("Student name is required");
      if (!student.class) errors.push("Class is required");
      if (!student.mobile_number || !/^\d{10}$/.test(student.mobile_number.replace(/\D/g, ""))) {
        errors.push("Mobile number must be 10 digits");
      }
      if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
        errors.push("Invalid email format");
      }
      
      student.errors = errors;
      updated[index] = student;
      return updated;
    });
  };

  const handleRemoveStudent = (index: number) => {
    setEditedStudents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = async () => {
    if (!selectedSchool) return;

    const validStudents = editedStudents.filter((s) => s.errors.length === 0);
    
    const studentsToCreate: StudentInsert[] = validStudents.map((student, index) => ({
      school_id: selectedSchool.id,
      student_name: student.student_name,
      class: student.class,
      section: student.section || null,
      mobile_number: student.mobile_number,
      email: student.email || null,
      username: generateUsername(selectedSchool.school_code, student.class, student.student_name, index + 1),
      temp_password: generateTempPassword(),
      is_active: true,
    }));

    try {
      await bulkCreate.mutateAsync(studentsToCreate);
      setCreatedStudents(studentsToCreate);
      setStep("success");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDownloadCredentials = () => {
    const csv = exportCredentialsToCSV(createdStudents);
    downloadCSV(csv, `credentials_${selectedSchool?.school_code}_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const handleReset = () => {
    setStep("upload");
    setSelectedSchool(null);
    setParseResult(null);
    setEditedStudents([]);
    setCreatedStudents([]);
  };

  const validCount = editedStudents.filter((s) => s.errors.length === 0).length;
  const errorCount = editedStudents.filter((s) => s.errors.length > 0).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Upload Students</h1>
          <p className="text-muted-foreground">Upload students via CSV file</p>
        </div>

        {step === "upload" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* School Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Select School</CardTitle>
                <CardDescription>Choose the school for student upload</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedSchool?.id || ""}
                  onValueChange={(id) => setSelectedSchool(schools?.find((s) => s.id === id) || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools?.filter((s) => s.is_active).map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name} ({school.school_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>2. Download Template</CardTitle>
                <CardDescription>Get the CSV template with required columns</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={handleDownloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>3. Upload CSV File</CardTitle>
                <CardDescription>
                  Required columns: student_name, class, mobile_number. Optional: section, email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    selectedSchool
                      ? "border-primary/50 hover:border-primary cursor-pointer"
                      : "border-border bg-muted/30 cursor-not-allowed"
                  )}
                  onClick={() => selectedSchool && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={!selectedSchool}
                  />
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium">
                    {selectedSchool ? "Click to upload or drag and drop" : "Select a school first"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">CSV files only</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                {validCount} valid
              </Badge>
              {errorCount > 0 && (
                <Badge variant="destructive" className="text-sm">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errorCount} errors
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                Uploading to: <strong>{selectedSchool?.name}</strong>
              </span>
            </div>

            {/* Preview Table */}
            <div className="rounded-lg border border-border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedStudents.map((student, index) => (
                    <TableRow
                      key={index}
                      className={student.errors.length > 0 ? "bg-destructive/5" : ""}
                    >
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={student.student_name}
                          onChange={(e) => handleEditStudent(index, "student_name", e.target.value)}
                          className={cn("h-8", !student.student_name && "border-destructive")}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.class}
                          onChange={(e) => handleEditStudent(index, "class", e.target.value)}
                          className={cn("h-8 w-20", !student.class && "border-destructive")}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.section || ""}
                          onChange={(e) => handleEditStudent(index, "section", e.target.value)}
                          className="h-8 w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.mobile_number}
                          onChange={(e) => handleEditStudent(index, "mobile_number", e.target.value.replace(/\D/g, ""))}
                          className={cn("h-8 w-32", (!student.mobile_number || !/^\d{10}$/.test(student.mobile_number)) && "border-destructive")}
                          maxLength={10}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.email || ""}
                          onChange={(e) => handleEditStudent(index, "email", e.target.value)}
                          className={cn("h-8", student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email) && "border-destructive")}
                        />
                      </TableCell>
                      <TableCell>
                        {student.errors.length > 0 ? (
                          <span className="text-xs text-destructive">{student.errors[0]}</span>
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveStudent(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUpload}
                disabled={validCount === 0 || bulkCreate.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                {bulkCreate.isPending ? "Uploading..." : `Upload ${validCount} Students`}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto text-primary mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Upload Successful!
              </h2>
              <p className="text-muted-foreground mb-6">
                {createdStudents.length} students have been created with login credentials.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={handleDownloadCredentials}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Credentials (CSV)
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Upload More Students
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
