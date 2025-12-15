# 🧾 Employee Management System (EMS)

## 📌 Project Objective

The **Employee Management System** is a full-stack **MERN (MongoDB, Express, React, Node.js)** web application that streamlines employee lifecycle management — from onboarding to salary and attendance tracking.

Admins and HRs can **add, edit, delete, and view employees**, manage departments, assign salaries, mark attendance, and generate reports — all within a secure, responsive interface.

---

## 🧑‍💻 Demo Login Credentials

You can explore the system using these demo accounts:

| Role            | Email                      | Password       |
| --------------- | -------------------------- | -------------- |
| 👑 **Admin**    | `admin@gmail.com`          | `admin1`        |
| 🧠 **Manager**  | `atia@gmail.com`           | `Manager12@@`  |
| 👷 **Employee** | `ammaruofficial@gmail.com` | `Employee12@@` |

> ⚠️ **Note:** These credentials are for _demo/testing only_.  
> Please avoid altering or deleting essential data.

---

<details>
<summary>⚙️ <b>Core Functionalities</b> (click to expand)</summary>

### 🧑‍💼 1. Employee Addition (Create)

- Adds a full employee profile with:
  - `employeeId`, `name`, `email`, `phone`, `DOB`, `gender`, `department`, `role`, `designation`, `marital status`, `salary`
  - Optional: `password`, `profile image`
- Passwords securely **hashed using bcrypt**
- Profile images uploaded using **Multer**
- Validates unique email & phone

---

### 📋 2. Employee Listing (Read)

- Displays all employees with filters:
  - By name, department, role, or status
- Supports search and pagination
- Shows: profile image, name, department, email, role

---

### ✏️ 3. Edit Employee (Update)

- Updates personal & professional details
- Optionally re-upload image or change password
- Replaces old image cleanly
- Role-based access: only admins/managers can edit others

---

### ❌ 4. Delete Employee (Delete)

- Removes employee record
- Deletes associated image from server
- Confirmation prompt prevents accidental deletion

---

### 🧩 5. Department Management

- **Add, view, update, delete** departments
- Assign departments to employees
- Filter employees by department
- Rename/remove departments safely

---

### 💰 6. Salary Management

- Admins can set or update employee salaries
- Each record includes:
  - Base pay, allowances, deductions, and net salary
- Optional audit log for salary history
- Salary info visible on employee profile

---

### 📆 7. Attendance Management

- Mark daily attendance:
  - Status: Present, Absent, Leave, Late
- Prevents duplicate entries for the same date
- Stores `employeeId`, `date`, `status`, and remarks

---

### 📊 8. Attendance Reports

- Generate **monthly or weekly** reports
- Includes:
  - Days present, absent, leave, late, percentage
- Filter by employee, department, or date range
- Export to CSV (PDF coming soon)

</details>

---

<details>
<summary>🔐 <b>Authentication & Authorization</b></summary>

### 🪙 JWT-Based Authentication

- Secure login with email & password → JWT token
- Token used to protect routes and sensitive endpoints
- Stored securely in localStorage or HttpOnly cookies

### 🧭 Role-Based Access

| Role         | Permissions                                |
| ------------ | ------------------------------------------ |
| **Admin**    | Full control (CRUD on all entities)        |
| **Manager**  | Manage team, attendance, and reports       |
| **Employee** | View & update own profile, view attendance |

</details>

---

<details>
<summary>🖼️ <b>Image Uploads (Multer)</b></summary>

- Images stored locally via **Multer**
- Renamed with timestamp for uniqueness
- Served through `/uploads/` static path
- Old files automatically deleted when updated
</details>

---

<details>
<summary>🗂️ <b>Backend Structure (MVC)</b></summary>

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

