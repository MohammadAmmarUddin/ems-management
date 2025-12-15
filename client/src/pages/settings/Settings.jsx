import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user, login } = useAuth();
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const homeRoute =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "manager"
      ? "/manager-dashboard"
      : user?.role === "employee"
      ? "/employee-dashboard"
      : "/";

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.emp_phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [feedback, setFeedback] = useState({
    type: "idea",
    message: "",
  });

  const [prefs, setPrefs] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
  });

  useEffect(() => {
    setAccountForm({
      name: user?.name || user?.emp_name || "",
      email: user?.email || "",
      phone: user?.emp_phone || "",
    });
  }, [user]);

  const initials = useMemo(
    () =>
      (user?.name || user?.emp_name || "User")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [user]
  );

  const handleAccountSave = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const { data } = await axios.patch(
        `${baseUrl}/api/user/profile`,
        {
          name: accountForm.name,
          email: accountForm.email,
          phone: accountForm.phone,
          preferences: prefs,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        Swal.fire("Saved", "Account details updated.", "success");
        login(data.user);
        // persist updated user
        if (localStorage.getItem("token")) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message || "Update failed",
        "error"
      );
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      Swal.fire("Mismatch", "New password and confirm do not match.", "error");
      return;
    }
    try {
      const token = getToken();
      const { data } = await axios.post(
        `${baseUrl}/api/user/changePassword`,
        {
          currentPassword: passwordForm.current,
          newPassword: passwordForm.next,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        Swal.fire("Password Updated", data.message, "success");
        setPasswordForm({ current: "", next: "", confirm: "" });
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message || "Update failed",
        "error"
      );
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.message.trim()) {
      Swal.fire("Required", "Please enter your feedback.", "warning");
      return;
    }
    try {
      const token = getToken();
      const { data } = await axios.post(`${baseUrl}/api/feedback`, feedback, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        Swal.fire("Thank you!", "Feedback submitted.", "success");
        setFeedback({ type: "idea", message: "" });
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message || "Submit failed",
        "error"
      );
    }
  };

  const togglePref = (key) =>
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  return (
    <div className="p-2 sm:p-3 md:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Link
          to={homeRoute}
          className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm sm:text-base"
        >
          <FaArrowLeft />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-base sm:text-lg">
              {user?.name || user?.emp_name || "User"}
            </p>
            <p className="text-sm text-gray-600">{user?.role || "User"}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-wrap gap-2 sm:justify-end">
          <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            Account
          </span>
          <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
            Security
          </span>
          <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            Preferences
          </span>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Account Details</h3>
            <p className="text-sm text-gray-600">
              Keep your personal info up to date.
            </p>
          </div>
        </div>
        <form className="space-y-3" onSubmit={handleAccountSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={accountForm.name}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={accountForm.email}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={accountForm.phone}
                onChange={(e) =>
                  setAccountForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Department
              </label>
              <input
                type="text"
                value={user?.department?.dep_name || "Not set"}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 bg-primary text-white rounded hover:bg-secondary transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Password</h3>
            <p className="text-sm text-gray-600">
              Use a strong, unique password to keep your account secure.
            </p>
          </div>
        </div>
        <form className="space-y-3" onSubmit={handlePasswordSave}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    current: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    next: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirm: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Repeat new password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 bg-primary text-white rounded hover:bg-secondary transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Preferences</h3>
            <p className="text-sm text-gray-600">
              Control alerts and appearance.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center justify-between border rounded-lg px-3 py-2">
            <span className="text-sm text-gray-700">Push Notifications</span>
            <input
              type="checkbox"
              checked={prefs.notifications}
              onChange={() => togglePref("notifications")}
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between border rounded-lg px-3 py-2">
            <span className="text-sm text-gray-700">Email Alerts</span>
            <input
              type="checkbox"
              checked={prefs.emailAlerts}
              onChange={() => togglePref("emailAlerts")}
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between border rounded-lg px-3 py-2">
            <span className="text-sm text-gray-700">Dark Mode</span>
            <input
              type="checkbox"
              checked={prefs.darkMode}
              onChange={() => togglePref("darkMode")}
              className="h-4 w-4"
            />
          </label>
          <div className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
            <p className="font-semibold mb-1">Session Security</p>
            <p className="text-xs text-gray-600">
              Review active sessions and sign out of other devices in the
              security center (coming soon).
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Feedback</h3>
            <p className="text-sm text-gray-600">
              Tell us what to improve in EMS.
            </p>
          </div>
        </div>
        <form className="space-y-3" onSubmit={handleFeedbackSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Feedback Type
              </label>
              <select
                value={feedback.type}
                onChange={(e) =>
                  setFeedback((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="idea">Idea</option>
                <option value="issue">Issue</option>
                <option value="praise">Praise</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Message
              </label>
              <textarea
                value={feedback.message}
                onChange={(e) =>
                  setFeedback((prev) => ({ ...prev, message: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Share details..."
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 bg-primary text-white rounded hover:bg-secondary transition"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
