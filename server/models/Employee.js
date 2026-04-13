import { DEPARTMENTS } from "../constants/departments.js";
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true, unique: true},
    firstName: {type: String, reuired: true},
    lastName: {type: String, reuired: true},
    email: {type: String, reuired: true},
    phone: {type: String, reuired: true},
    position: {type: String, reuired: true},
    basicSalary: {type: Number, reuired: 0},
    allowances: {type: Number, reuired: 0},
    deductions: {type: Number, reuired: 0},
    employeeStatus: {type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE"},
    joinDate: {type: Date, reuired: true},
    isDeleted: {type: Boolean, default: false},
    bio: {type: String, default: ""},
    department: {type: String, enum: DEPARTMENTS}

},{timestamps: true})

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema)

export default Employee;