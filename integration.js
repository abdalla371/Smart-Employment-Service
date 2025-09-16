// integration.js
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
  if (token) opts.headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, opts);
  const json = await res.json().catch(()=>({}));
  return { ok: res.ok, status: res.status, data: json };
}

// --- UI helpers (non-intrusive) ---
function showMsg(msg) { alert(msg); } // keep it simple, don't change layout
function requireLoginRedirect() {
  showMsg("You must be logged in to continue. You will be redirected to Login.");
  window.location.href = "/login.html";
}

// --- Signup (individual & company) ---
// Individual signup form id: createAccountFormIndividual
const indForm = document.getElementById("createAccountFormIndividual");
if (indForm) {
  indForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // map your fields (IDs used in the HTML you provided)
    const payload = {
      type: "individual",
      name: document.getElementById("indName")?.value || document.getElementById("name")?.value || "",
      email: document.getElementById("indEmail")?.value || document.getElementById("email")?.value || "",
      password: document.getElementById("indPassword")?.value || ""
    };
    const r = await apiFetch("/create-account", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Registered. Please log in.");
      window.location.href = "/login.html";
    } else {
      showMsg(r.data.error || "Registration failed.");
    }
  });
}

// Company signup form id: createAccountFormCompany
const compForm = document.getElementById("createAccountFormCompany");
if (compForm) {
  compForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      type: "company",
      name: document.getElementById("compName")?.value || "",
      email: document.getElementById("compEmail")?.value || "",
      password: document.getElementById("compPassword")?.value || ""
    };
    const r = await apiFetch("/create-account", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Company registered. Please log in.");
      window.location.href = "/login.html";
    } else {
      showMsg(r.data.error || "Registration failed.");
    }
  });
}

// --- Login (login.html form id: loginForm) ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail")?.value || document.getElementById("email")?.value || "";
    const password = document.getElementById("loginPassword")?.value || document.getElementById("password")?.value || "";
    const r = await apiFetch("/login", { method: "POST", body: JSON.stringify({ email, password }) });
    if (r.ok && r.data.token) {
      setSession(r.data.user_id, r.data.token);
      showMsg("Login successful!");
      // redirect to homepage or where user came from
      window.location.href = "/";
    } else {
      showMsg(r.data.error || "Login failed.");
    }
  });
}

// --- Post Job (post-job.html id: postJobForm) ---
const postJobForm = document.getElementById("postJobForm");
if (postJobForm) {
  postJobForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) return requireLoginRedirect();

    const payload = {
      title: document.getElementById("jobTitle")?.value || "",
      description: document.getElementById("jobDescription")?.value || "",
      company: document.getElementById("companyName")?.value || "",
      location: document.getElementById("location")?.value || "",
      salary_min: document.getElementById("salaryMin")?.value || "",
      salary_max: document.getElementById("salaryMax")?.value || "",
      currency: document.getElementById("currency")?.value || "",
      job_type: document.getElementById("jobType")?.value || "",
      category: document.getElementById("jobCategory")?.value || "",
      deadline: document.getElementById("deadline")?.value || "",
      application_email: document.getElementById("applicationEmail")?.value || ""
    };

    const r = await apiFetch("/post-job", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Job posted.");
      postJobForm.reset();
    } else {
      showMsg(r.data.error || "Failed to post job.");
    }
  });
}

// --- Internship Form (internship.html id: internshipForm) ---
const internshipForm = document.getElementById("internshipForm");
if (internshipForm) {
  internshipForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) return requireLoginRedirect();

    // collect fields (names from the HTML you supplied)
    const form = internshipForm;
    const payload = Object.fromEntries(new FormData(form).entries());
    const r = await apiFetch("/internship", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Internship submitted.");
      form.reset();
      // hide modal if present
      try { document.getElementById("internshipModal").style.display = "none"; } catch {}
    } else {
      showMsg(r.data.error || "Failed to submit internship.");
    }
  });
}

// --- Jobseeking Form (jobseeking.html id: jobseekingForm) ---
const jobseekingForm = document.getElementById("jobseekingForm");
if (jobseekingForm) {
  jobseekingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) return requireLoginRedirect();

    const form = jobseekingForm;
    const payload = Object.fromEntries(new FormData(form).entries());
    const r = await apiFetch("/jobseeker", { method: "POST", body: JSON.stringify(payload) });
    if (r.ok) {
      showMsg(r.data.message || "Application submitted.");
      form.reset();
      try { document.getElementById("jobseekingModal").style.display = "none"; } catch {}
    } else {
      showMsg(r.data.error || "Failed to submit application.");
    }
  });
}

// --- Featured jobs Apply buttons (uses data-job-id on each button) ---
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-apply").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      if (!isLoggedIn()) return requireLoginRedirect();

      const jobId = btn.getAttribute("data-job-id");
      const jobTitle = btn.getAttribute("data-job-title");
      const company = btn.getAttribute("data-company");

      // Optionally you can prompt for a quick message or CV link; for now basic apply:
      const r = await apiFetch("/apply-job", { method: "POST", body: JSON.stringify({ job_id: jobId }) });
      if (r.ok) {
        showMsg(r.data.message || `Applied to ${jobTitle} at ${company}`);
      } else {
        showMsg(r.data.error || "Failed to apply");
      }
    });
  });
});

// --- Simple logout helper if you want to call it from UI ---
window.logout = function() {
  clearSession();
  showMsg("Logged out");
  window.location.href = "/";
};

