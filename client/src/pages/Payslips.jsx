import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets"
import PayslipList from "../components/payslip/PayslipList"
import Loading from "../components/Loading"
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm"

const Payslips = () => {
  const [ payslips, setPayslips ] = useState([])
  const [ employees, setEmployees ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const isAdmin = true;

  const fetchPayslips = useCallback(async ()=>{
    setPayslips(dummyPayslipData)
    setTimeout(()=>{
      setLoading(false);
    }, 1000);
  },[])

  useEffect(()=>{
    fetchPayslips()
  },[fetchPayslips])

  useEffect(()=>{
    if(isAdmin) setEmployees(dummyEmployeeData)
  },[isAdmin])

  if(loading) return <Loading/>

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1>Payslips</h1>
          <p>{isAdmin ? "Generate and manage employee payslips" : "Your payslip history"}</p>
        </div>
        {isAdmin && <GeneratePayslipForm employees={employees} onSuccess={fetchPayslips}/>}
      </div>
      <PayslipList payslips={payslips} />
    </div>
  )
}

export default Payslips