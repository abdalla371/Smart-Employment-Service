// integration.js Final
// API base - UPDATE if your Render URL changes
const API_BASE = "https://smart-employment-service-7.onrender.com";

// --- Helpers ---
function getToken() {
  return localStorage.getItem("ses_token");
}
function setSession(userId, token) {
  localStorage.setItem("ses_user", String(userId));
  localStorage.setItem("ses_token", token);
}
function clearSession() {
  localStorage.removeItem("ses_user");
  localStorage.removeItem("ses_token");
}
function isLoggedIn() {
  return !!getToken();
}
async function apiFetch(path, opts = {}) {
  opts.headers = opts.headers || {};
  opts.headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) opts.headers["Authorization"] = Bearer ${token};
  const res = await fetch(${API_BASE}${path}, opts);
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data: json };
}

// --- UI helpers ---
function showMsg(msg) { alert(msg); }
function requireLoginRedirect() {
  showMsg("You must be logged in to continue. Redirecting to Login.");
  window.location.href = "/login.html";
}

// --- Individual Signup (create-account.html) ---
const individualForm = document.getElementById("individualForm");
if (individualForm) {
  individualForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      type: "individual",
      fullname: document.getElementById("ind_fullname").value,
      email: document.getElementById("ind_email").value,
      phone: document.getElementById("ind_phone").value,
      profession: document.getElementById("ind_profession").value,
      password: document.getElementById("ind_password").value
    };
    const r = await apiFetch("/create-account", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Registered successfully. Please log in.");
      window.location.href = "/login.html";
    } else {
      showMsg(r.data.error || "Registration failed.");
    }
  });
}

// --- Company Signup (create-account.html) ---
const companyForm = document.getElementById("companyForm");
if (companyForm) {
  companyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      type: "company",
      company: document.getElementById("comp_name").value,
      contact: document.getElementById("comp_contact").value,
      email: document.getElementById("comp_email").value,
      phone: document.getElementById("comp_phone").value,
      website: document.getElementById("comp_website").value,
      industry: document.getElementById("comp_industry").value,
      size: document.getElementById("comp_size").value,
      password: document.getElementById("comp_password").value
    };
    const r = await apiFetch("/create-account", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Company registered successfully. Please log in.");
      window.location.href = "/login.html";
    } else {
      showMsg(r.data.error || "Registration failed.");
    }
  });
}

// --- Login (login.html) ---
const loginContainer = document.querySelector(".login-container form");
if (loginContainer) {
  loginContainer.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.querySelector("input[name='username']").value;
    const password = document.querySelector("input[name='password']").value;
    const r = await apiFetch("/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (r.ok && r.data.token) {
      setSession(r.data.user_id, r.data.token);
      showMsg("Login successful!");
      window.location.href = "/";
    } else {
      showMsg(r.data.error || "Login failed.");
    }
  });
}

// --- Post Job ---
const postJobForm = document.getElementById("postJobForm");
if (postJobForm) {
  postJobForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) return requireLoginRedirect();
    const payload = Object.fromEntries(new FormData(postJobForm).entries());
    const r = await apiFetch("/post-job", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Job posted.");
      postJobForm.reset();
    } else {
      showMsg(r.data.error || "Failed to post job.");
    }
  });
}

// --- Internship Form ---
const internshipForm = document.getElementById("internshipForm");
if (internshipForm) {
  internshipForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) return requireLoginRedirect();
    const payload = Object.fromEntries(new FormData(internshipForm).entries());
    const r = await apiFetch("/internship", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Internship submitted.");
      internshipForm.reset();
    } else {
      showMsg(r.data.error || "Failed to submit internship.");
    }
  });
}

// --- Jobseeking Form ---
const jobseekingForm = document.getElementById("jobseekingForm");
if (jobseekingForm) {
  jobseekingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) return requireLoginRedirect();
    const payload = Object.fromEntries(new FormData(jobseekingForm).entries());
    const r = await apiFetch("/jobseeker", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Application submitted.");
      jobseekingForm.reset();
    } else {
      showMsg(r.data.error || "Failed to submit application.");
    }
  });
}

// --- Featured Jobs Apply ---
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-apply").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!isLoggedIn()) return requireLoginRedirect();
      const jobId = btn.getAttribute("data-job-id");
      const jobTitle = btn.getAttribute("data-job-title");
      const company = btn.getAttribute("data-company");
      const r = await apiFetch("/apply-job", { method: "POST", body: JSON.stringify({ job_id: jobId }) });
      if (r.ok) {
        showMsg(r.data.message || Applied to ${jobTitle} at ${company});
      } else {
        showMsg(r.data.error || "Failed to apply.");
      }
    });
  });
});

// --- Logout ---
window.logout = function() {
  clearSession();
  showMsg("Logged out");
  window.location.href = "/";
};
