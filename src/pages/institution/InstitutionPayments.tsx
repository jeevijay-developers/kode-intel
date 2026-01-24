import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  CreditCard,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Wallet,
  TrendingUp,
  Calendar,
} from "lucide-react";
import type { Institution } from "@/hooks/useInstitutionAuth";

export default function InstitutionPayments() {
  const { institution } = useOutletContext<{ institution: Institution }>();

  // Fetch payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["institution-payments", institution.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("institution_payments")
        .select("*")
        .eq("institution_id", institution.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  // Calculate stats
  const totalPaid = payments
    .filter((p: { status: string }) => p.status === "completed")
    .reduce((sum: number, p: { amount: number }) => sum + (p.amount || 0), 0);

  const totalPending = payments
    .filter((p: { status: string }) => p.status === "pending")
    .reduce((sum: number, p: { amount: number }) => sum + (p.amount || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-lime/20 text-lime gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-sunny/20 text-sunny gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-coral/20 text-coral gap-1">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Payments</h1>
          <p className="text-muted-foreground">
            Manage payments and view invoices
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Make Payment
        </Button>
      </div>

      {/* Payment Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-lime" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sunny/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-sunny" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {payments.length > 0
                    ? new Date(payments[0].created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                    : "-"}
                </p>
                <p className="text-sm text-muted-foreground">Last Payment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No payments yet</p>
              <p className="text-muted-foreground mb-4">
                Your payment history will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: {
                    id: string;
                    amount: number;
                    payment_method?: string;
                    status: string;
                    invoice_number?: string;
                    created_at: string;
                  }) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {payment.invoice_number || `INV-${payment.id.slice(0, 8).toUpperCase()}`}
                        </code>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{payment.amount?.toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {payment.payment_method || "Bank Transfer"}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <FileText className="h-4 w-4" />
                          Invoice
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

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-xs text-muted-foreground">Direct to our bank account</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium">Bank:</span> HDFC Bank</p>
                <p><span className="font-medium">Account:</span> XXXXXXXXXX1234</p>
                <p><span className="font-medium">IFSC:</span> HDFC0001234</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-muted">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">UPI Payment</p>
                  <p className="text-xs text-muted-foreground">Instant transfer via UPI</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p><span className="font-medium">UPI ID:</span> kodeintel@upi</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}