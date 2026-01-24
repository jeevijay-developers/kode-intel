import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInstitutionAuth } from "@/hooks/useInstitutionAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Users,
  CheckCircle,
} from "lucide-react";
import brainLogo from "@/assets/brain-logo.png";

const institutionTypes = [
  { value: "school", label: "School" },
  { value: "corporate", label: "Corporate / Company" },
  { value: "coaching", label: "Coaching Center" },
  { value: "other", label: "Other" },
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
];

export default function InstitutionSignup() {
  const navigate = useNavigate();
  const { institution, loading, signUp } = useInstitutionAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    institution_name: "",
    institution_type: "",
    contact_person: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    password: "",
    confirm_password: "",
    expected_student_count: "",
    address: "",
  });

  useEffect(() => {
    if (!loading && institution) {
      navigate("/institution");
    }
  }, [institution, loading, navigate]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.institution_name.trim()) {
      toast({ title: "Institution name is required", variant: "destructive" });
      return false;
    }
    if (!formData.institution_type) {
      toast({ title: "Please select institution type", variant: "destructive" });
      return false;
    }
    if (!formData.contact_person.trim()) {
      toast({ title: "Contact person name is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email.trim()) {
      toast({ title: "Email is required", variant: "destructive" });
      return false;
    }
    if (!formData.phone.trim()) {
      toast({ title: "Phone number is required", variant: "destructive" });
      return false;
    }
    if (!formData.city.trim() || !formData.state) {
      toast({ title: "City and state are required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || formData.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (formData.password !== formData.confirm_password) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp({
      institution_name: formData.institution_name.trim(),
      institution_type: formData.institution_type,
      contact_person: formData.contact_person.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      state: formData.state,
      password: formData.password,
      expected_student_count: parseInt(formData.expected_student_count) || 0,
      address: formData.address.trim(),
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome! Your institution is registered." });
      navigate("/institution");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="flex items-center gap-3 cursor-pointer justify-center mb-6"
            onClick={() => navigate("/")}
          >
            <img src={brainLogo} alt="KodeIntel" className="h-12" />
            <h1 className="text-2xl font-bold font-display">
              Kode<span className="text-primary">Intel</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold font-display mb-2">
            Register Your Institution
          </h2>
          <p className="text-muted-foreground">
            Join KodeIntel and bring AI & coding education to your students
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 rounded-full ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-2xl border-0">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Institution Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    Institution Details
                  </h3>

                  <div className="space-y-2">
                    <Label>Institution Name *</Label>
                    <Input
                      placeholder="Enter institution name"
                      value={formData.institution_name}
                      onChange={(e) => updateField("institution_name", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Institution Type *</Label>
                    <Select
                      value={formData.institution_type}
                      onValueChange={(v) => updateField("institution_type", v)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutionTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contact Person Name *</Label>
                    <Input
                      placeholder="Enter contact person name"
                      value={formData.contact_person}
                      onChange={(e) => updateField("contact_person", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Expected Student Count</Label>
                    <Input
                      type="number"
                      placeholder="Approximate number of students"
                      value={formData.expected_student_count}
                      onChange={(e) => updateField("expected_student_count", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <Button
                    type="button"
                    className="w-full h-12 gap-2"
                    onClick={() => validateStep1() && setStep(2)}
                  >
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="email@institution.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input
                        type="tel"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(v) => updateField("state", v)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address (Optional)</Label>
                    <Input
                      placeholder="Full address"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 h-12 gap-2"
                      onClick={() => validateStep2() && setStep(3)}
                    >
                      Continue
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Create Password */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-primary" />
                    Create Password
                  </h3>

                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password *</Label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirm_password}
                      onChange={(e) => updateField("confirm_password", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-12 gap-2 bg-gradient-to-r from-primary to-secondary"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/institution/login")}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}