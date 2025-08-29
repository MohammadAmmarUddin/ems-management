

## 🧾 Employee Management System (EMS)

### 📌 Project Objective

The **Employee Management System** is a comprehensive **MERN (MongoDB, Express, React, Node.js)** application designed to streamline employee lifecycle management — from onboarding to salary and attendance tracking. This system enables HR/admins to **add, view, edit, and delete employee records**, manage departments and salaries, monitor attendance, and generate reports — all via a secure and responsive web interface.

---
Demo user accounts
Admin:

email: admin@gmaill.com
password:admin


## ⚙️ Core Functionalities

### 🧑‍💼 1. Employee Addition (Create)

* Adds complete employee profile with:

  * `employeeId`, `Name`, `Email`, `Phone`, `DOB`, `Gender`, `Department`, `Role`, `Designation`, `Marital Status`, `Salary`
  * Optionally: `Password` and `Profile Image`
* Passwords are securely **hashed using bcrypt**
* **Multer** handles profile image uploads and saves them locally
* Validates uniqueness of `email` and `phone`

### 📋 2. Employee Listing (Read)

* Lists all employees with dynamic filters:

  * By name, department, role, or status
* Supports pagination and search
* Each entry displays: profile image, name, department, email, and role

### ✏️ 3. Edit Employee (Update)

* Allows updates to personal and professional details
* Optional image re-upload and password change
* Clean replacement of old profile image
* Secured by role-based access control (only admins or specific roles can edit others)

### ❌ 4. Delete Employee (Delete)

* Removes employee record from the database
* Automatically deletes associated local image file
* Confirmation prompts protect against accidental deletions

---

## 🧩 5. Department Management

* **Add, View, Update, Delete** departments
* Each employee is assigned to a department
* Employee list can be filtered by department
* Departments can be renamed or removed (with constraints)

---

## 💰 6. Salary Management

* Admins can:

  * Set employee-specific salary details
  * Update salary dynamically
  * Track salary changes per employee (optional audit log)
* Each salary entry includes:

  * Base pay, allowances, deductions (optional), and net salary
* View salaries in the employee profile

---

## 📆 7. Attendance Management

* Mark daily attendance:

  * Status: Present, Absent, Leave, Late
  * Date auto-filled or manually selected
* Each entry includes:

  * `employeeId`, `date`, `status`, and `remarks` (optional)
* Prevents duplicate entries for the same day

---

## 📊 8. Attendance Reports

* Generate **monthly or weekly attendance reports**
* Report includes:

  * Days present, absent, late, leave
  * Percentage attendance
* Can be filtered by employee, department, or date range
* Export functionality (CSV or PDF) can be added

---

## 🔐 Authentication & Authorization

### JWT-Based Auth

* Login with email & password → JWT token issued
* Token used to protect sensitive routes and components
* Tokens stored securely in localStorage or HttpOnly cookies

### Role-Based Access

* Admins:

  * Full control (CRUD on employees, salaries, departments, attendance)
* Employees:

  * View and update own profile
  * Mark/view their own attendance (optional feature toggle)

---

## 🖼 Image Upload with Multer

* Profile images are stored locally via Multer
* Files renamed using timestamp for uniqueness
* Accessed via static `/uploads/` path
* Automatically replaced during updates and removed during deletions

---

## 🗂 Backend Structure (MVC)

```bash
/backend
├── controllers/
│   ├── authController.js
│   ├── employeeController.js
│   ├── salaryController.js
│   ├── attendanceController.js
│   ├── departmentController.js
├── models/
│   ├── employeeModel.js
│   ├── salaryModel.js
│   ├── attendanceModel.js
│   ├── departmentModel.js
├── routes/
│   ├── authRoutes.js
│   ├── employeeRoutes.js
│   ├── salaryRoutes.js
│   ├── attendanceRoutes.js
│   ├── departmentRoutes.js
├── middleware/
│   ├── auth.js
│   ├── multer.js
├── uploads/
├── server.js
```

---

## 🧑‍🎨 Frontend Stack

* **React + TailwindCSS / daisyUi/ui**
* State/data handled with **TanStack Query**
* Modular and reusable components:

  * EmployeeForm, EmployeeList, AttendanceTable, SalaryManager, DepartmentList
* Integrated search, filter, modal forms, toasts, and notifications
* **Form validation** via React Hook Form + Zod/Yup

---


## 🧪 Test Case Summary

| Function          | Test Case                         | Expected Outcome                             |
| ----------------- | --------------------------------- | -------------------------------------------- |
| Add employee      | Valid form + image                | Employee added, profile image stored locally |
| Update salary     | Change base salary                | Updated salary saved and displayed           |
| Mark attendance   | Today’s attendance already marked | Show error: "Attendance already marked"      |
| Department filter | Select "Engineering"              | Only employees from Engineering shown        |
| Delete employee   | Confirm deletion                  | Employee and image deleted                   |
| Generate report   | Select April 2025                 | Summary with present/absent counts shown     |

---

## 🚀 Future Enhancements

* 📌 CSV/PDF export for employee and attendance data
* 📈 Admin dashboard with real-time charts
* 📧 Email notifications (e.g., on late attendance)
* ⏰ Shift tracking / working hours monitoring
* 🔔 Notification system for employees (e.g., salary credited)
* 🌍 Internationalization (i18n)
* 📂 Cloud image storage (Cloudinary or S3)

---



