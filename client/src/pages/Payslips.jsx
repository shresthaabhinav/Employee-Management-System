import { useCallback, useEffect, useState } from "react";
import PayslipList from "../components/payslip/PayslipList";
import Loading from "../components/Loading";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/fetch";

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const fetchPayslips = useCallback(async () => {
    try {
      const data = await api("/payslips");
      setPayslips(data?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch payslips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api("/employees");
        setEmployees((data || []).filter((e) => !e.isDeleted));
      } catch (error) {
        toast.error(error.message || "Failed to fetch employees");
      }
    };

    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin]);

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1>Payslips</h1>
          <p>
            {isAdmin
              ? "Generate and manage employee payslips"
              : "Your payslip history"}
          </p>
        </div>
        {isAdmin && (
          <GeneratePayslipForm
            employees={employees}
            onSuccess={fetchPayslips}
          />
        )}
      </div>
      <PayslipList payslips={payslips} isAdmin={isAdmin} />
    </div>
  );
};

export default Payslips;
