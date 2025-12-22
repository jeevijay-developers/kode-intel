// Generate username from school code, class, and name
export function generateUsername(
  schoolCode: string,
  className: string,
  studentName: string,
  index: number
): string {
  const cleanName = studentName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  const cleanClass = className.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const schoolPrefix = schoolCode.replace("SCH-", "").replace(/-/g, "").toLowerCase();
  
  return `${schoolPrefix}_${cleanClass}_${cleanName}_${String(index).padStart(3, "0")}`;
}

// Generate a random temporary password
export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Export credentials to CSV
export function exportCredentialsToCSV(
  students: Array<{
    student_name: string;
    class: string;
    section?: string | null;
    username: string;
    temp_password: string;
    mobile_number: string;
    email?: string | null;
  }>
): string {
  const headers = ["Student Name", "Class", "Section", "Username", "Password", "Mobile", "Email"];
  const rows = students.map((s) => [
    s.student_name,
    s.class,
    s.section || "",
    s.username,
    s.temp_password,
    s.mobile_number,
    s.email || "",
  ]);

  return [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
}

// Download CSV file
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
