export interface ParsedStudent {
  student_name: string;
  class: string;
  section?: string;
  mobile_number: string;
  email?: string;
  rowIndex: number;
  errors: string[];
}

export interface ParseResult {
  students: ParsedStudent[];
  hasErrors: boolean;
  totalRows: number;
  validRows: number;
}

const REQUIRED_HEADERS = ["student_name", "class", "mobile_number"];
const OPTIONAL_HEADERS = ["section", "email"];
const ALL_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];

// Map common header variations to standard names
const HEADER_ALIASES: Record<string, string> = {
  name: "student_name",
  "student name": "student_name",
  studentname: "student_name",
  class: "class",
  grade: "class",
  standard: "class",
  section: "section",
  div: "section",
  division: "section",
  mobile: "mobile_number",
  phone: "mobile_number",
  "mobile number": "mobile_number",
  "phone number": "mobile_number",
  mobilenumber: "mobile_number",
  phonenumber: "mobile_number",
  email: "email",
  "email address": "email",
  emailaddress: "email",
};

function normalizeHeader(header: string): string {
  const cleaned = header.toLowerCase().trim();
  return HEADER_ALIASES[cleaned] || cleaned;
}

function validateRow(row: ParsedStudent): string[] {
  const errors: string[] = [];

  if (!row.student_name || row.student_name.trim() === "") {
    errors.push("Student name is required");
  }

  if (!row.class || row.class.trim() === "") {
    errors.push("Class is required");
  }

  if (!row.mobile_number || row.mobile_number.trim() === "") {
    errors.push("Mobile number is required");
  } else if (!/^\d{10}$/.test(row.mobile_number.replace(/\D/g, ""))) {
    errors.push("Mobile number must be 10 digits");
  }

  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push("Invalid email format");
  }

  return errors;
}

export function parseCSV(content: string): ParseResult {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  
  if (lines.length < 2) {
    return { students: [], hasErrors: true, totalRows: 0, validRows: 0 };
  }

  // Parse headers
  const headerLine = lines[0];
  const rawHeaders = headerLine.split(",").map((h) => h.replace(/^"|"$/g, "").trim());
  const headers = rawHeaders.map(normalizeHeader);

  // Check for required headers
  const missingHeaders = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    return {
      students: [{
        student_name: "",
        class: "",
        mobile_number: "",
        rowIndex: 0,
        errors: [`Missing required columns: ${missingHeaders.join(", ")}`],
      }],
      hasErrors: true,
      totalRows: 0,
      validRows: 0,
    };
  }

  // Parse data rows
  const students: ParsedStudent[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = parseCSVLine(line);
    
    const row: ParsedStudent = {
      student_name: "",
      class: "",
      mobile_number: "",
      rowIndex: i,
      errors: [],
    };

    headers.forEach((header, idx) => {
      const value = values[idx]?.trim() || "";
      if (header === "student_name") row.student_name = value;
      else if (header === "class") row.class = value;
      else if (header === "section") row.section = value || undefined;
      else if (header === "mobile_number") row.mobile_number = value.replace(/\D/g, "");
      else if (header === "email") row.email = value || undefined;
    });

    row.errors = validateRow(row);
    students.push(row);
  }

  const validRows = students.filter((s) => s.errors.length === 0).length;

  return {
    students,
    hasErrors: validRows < students.length,
    totalRows: students.length,
    validRows,
  };
}

// Handle quoted CSV values properly
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

// Generate sample CSV template
export function generateCSVTemplate(): string {
  const headers = ["student_name", "class", "section", "mobile_number", "email"];
  const sampleData = [
    ["John Doe", "5", "A", "9876543210", "john@example.com"],
    ["Jane Smith", "5", "B", "9876543211", ""],
    ["Bob Wilson", "6", "A", "9876543212", "bob@example.com"],
  ];

  return [
    headers.join(","),
    ...sampleData.map((row) => row.map((c) => `"${c}"`).join(",")),
  ].join("\n");
}
