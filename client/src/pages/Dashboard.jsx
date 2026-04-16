import { useEffect, useState } from "react"
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets"
import Loading from "../components/Loading"
import EmployeeDashboard from "../components/EmployeeDashboard"
import AdminDashboard from "../components/AdminDashboard"
import api from "../api/fetch"
import toast from "react-hot-toast"

const Dashboard = () => {

  const [ data, setData ] = useState(null)
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    api("/dashboard")
      .then((data) => setData(data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  if(loading) return <Loading/>
  if(!data) return <p className="text-center text-slate-500 py-12">Failed to load dashboard</p>

  if(data.role === "ADMIN"){
    return <AdminDashboard data={data}/>
  }else{
    return <EmployeeDashboard data={data}/>
  }
}

export default Dashboard