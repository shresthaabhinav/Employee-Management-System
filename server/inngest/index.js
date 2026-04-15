import { Inngest } from "inngest";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee";
import LeaveApplication from "../models/LeaveApplication.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ems" });

// Auto checkout for employees
const autoCheckOut = inngest.createFunction(
    {id: "auto-check-out"}, 
    {event: "employee/check-out"},
    async ({event, step}) =>{
        const { employeeId, attendanceId } = event.data;

    // Wait for 9 hours
    await step.sleepUntil("wait-for-the-9-hours", new date(new date().getTime() + 9 * 60 * 60 * 1000))

    // Get Attendance data
    let attendance = await Attendance.findById(attendanceId)

    if (!attendance?.checkOut){
        //get Employee data
        const employee = await Employee.findById(employeeId)

        // Send Reminder email

        // After 10 hours, mark attendance as checked out with status "LATE"

        await step.sleeepUntil("wait-for-the-1-hour", new date(new date().getTime() + 1 * 60 * 60 * 1000))

        attendance = await Attendance.findById(attendanceId)
        if(!attendance?.checkOut){
            attendance.checkOut = new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000;
            attendance.workingHours= 4;
            attendance.dayType = "Half day";
            attendance.status = "LATE";
            await attendance.save();
        }
    }   
    },
);

//Send Email to admin, If admin doesnt take action on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
    {id: "leave-application-reminder"}, 
    {event: "leave/pending"},
        async({ event, step }) =>{
            const { leaveApplicationId } = event.data;

            // wait for 24 hours
            await step.sleepUntil("wait-for-the-24-hours", new date(new date().getTime() + 24 * 60 * 60 * 1000))

            const leaveApplication = await LeaveApplication.findById(leaveApplicationId)

            if(leaveApplication?.status === "PENDING"){
                const employee = await Employee.findById(leaveApplication.employeeId)

            //Send reminder email to admin to take action on leave application

            }
        }
);

//Cron: Check attendance at 11:30 AM IST (06:00 UTC) and email absent employees
const attendanceReminderCron = inngest.createFunction(
    {id: "leave-application-cron"}, 
    {cron: "0 0 6 * * *"}, // 06:00 UTC = 11:30 AM IST
        async({ step }) =>{
            // Step 1: Get today's date range
            const today = await step.run("get-today-date", ()=>{
                const startUTC = new Date(new Date().toLocaleDateString("en-CA",{timeZone: "Asia/Kathmandu"}) + "T00:00:00 + 5:30")

                const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);

                return {startUTC : startUTC.toISOString(), endUTC: endUTC.toISOString()}
            })

            // Step 2:Get all active, non-deleted employees
            const activeEmployees = await step.run("get-active-employees", async()=>{
                const employees = await Employee.find({
                    isDeleted : false,
                    employmentStatus: "ACTIVE",
                }).lean();
                return employees.map((e)=>({
                    _id: e._id.toString(), firstName: e.firstName, lastName: e.lastName, email: e.email, department: e.department
                }))
            })

            //
        }
);

//Create an empty array where we'll export future Inngest functions
export const functions = [autoCheckOut, leaveApplicationReminder];