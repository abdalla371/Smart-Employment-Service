const API_BASE = "https://smart-employment-service-9.onrender.com/api";

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
    if (token) opts.headers["Authorization"] = "Bearer " + token;

    const res = await fetch(API_BASE + path, opts);
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json };
}

// --- UI helpers ---
// --- UI helpers ---
function showMsg(msg) {
    // Haddii modal hore u jiro, update garee
    let modal = document.getElementById("customModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "customModal";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.background = "rgba(0,0,0,0.6)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.zIndex = "9999";
        modal.innerHTML = `
            <div style="background:white;padding:20px;border-radius:8px;
                        max-width:350px;text-align:center;box-shadow:0 0 10px #000;">
                <h3 style="margin-top:0;color:#007bff;">Smart Employment Services</h3>
                <p id="customMsgText" style="margin:15px 0;"></p>
                <button id="customCloseBtn" style="padding:8px 15px;border:none;
                        border-radius:5px;background:#007bff;color:white;cursor:pointer;">
                    OK
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Close button
        document.getElementById("customCloseBtn").addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // Update message text & show modal
    document.getElementById("customMsgText").textContent = msg;
    modal.style.display = "flex";
}

// --- Integration object ---
const Integration = {
    submitIndividual: async function (data) {
        const payload = {
            type: "individual",
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            profession: data.profession,
            password: data.password,
            confirmpassword: data.confirmpassword
        };

        const r = await apiFetch("/create-account", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (r.ok) {
            showMsg("Registered successfully. Please log in.");
            window.location.href = "login.html"; // FIXED
        } else {
            showMsg(r.data.error || "Registration failed.");
        }
    },

    submitCompany: async function (data) {
        const payload = {
            type: "company",
            company: data.company,
            contact: data.contact,
            email: data.email,
            phone: data.phone,
            website: data.website,
            industry: data.industry,
            size: data.size,
            password: data.password
        };

        const r = await apiFetch("/create-account", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (r.ok) {
            showMsg("Company registered successfully. Please log in.");
            window.location.href = "login.html"; // FIXED
        } else {
            showMsg(r.data.error || "Registration failed.");
        }
    }
};

// --- Individual Signup ---
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
        const r = await apiFetch("/create-account", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        if (r.ok) {
            showMsg("Registered successfully. Please log in.");
            window.location.href = "login.html"; // FIXED
        } else {
            showMsg(r.data.error || "Registration failed.");
        }
    });
}

// --- Company Signup ---
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
        const r = await apiFetch("/create-account", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        if (r.ok) {
            showMsg("Company registered successfully. Please log in.");
            window.location.href = "login.html"; // FIXED
        } else {
            showMsg(r.data.error || "Registration failed.");
        }
    });
}

// --- Login ---
const loginContainer = document.querySelector(".login-container form");
if (loginContainer) {
    loginContainer.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.querySelector("input[name='username']").value;
        const password = document.querySelector("input[name='password']").value;

        const r = await apiFetch("/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        if (r.ok && r.data.token) {
            setSession(r.data.user_id, r.data.token);
            showMsg("Login successful!");
            window.location.href = "index.html"; // FIXED
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

        const r = await apiFetch("/post-job", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (r.ok) {
            showMsg("Job posted.");
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

        const r = await apiFetch("/internship", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (r.ok) {
            showMsg("Internship submitted.");
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

        const r = await apiFetch("/jobseeker", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (r.ok) {
            showMsg("Application submitted.");
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

            const r = await apiFetch("/apply-job", {
                method: "POST",
                body: JSON.stringify({ job_id: jobId })
            });

            if (r.ok) {
                showMsg("Applied successfully.");
            } else {
                showMsg(r.data.error || "Failed to apply.");
            }
        });
    });
});

// --- Logout ---
window.logout = function () {
    clearSession();
    showMsg("Logged out");
    window.location.href = "index.html"; // FIXED
};

