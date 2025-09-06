// URL backend (markaad Render ku deploy-gareyso beddel)
const API_URL = "https://smart-employment-service.onrender.com";

// ---------- Signup ----------
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    const role = document.querySelector('input[name="role"]:checked')?.value || "seeker";

    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
    });

    const data = await res.json();
    alert(data.message || "Signup completed!");
});

// ---------- Login ----------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        alert(`Welcome ${data.role}: ${username}`);
    } else {
        alert(data.error || "Login failed!");
    }
});

// ---------- Post Job ----------
document.getElementById("jobForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("jobTitle").value;
    const company = document.getElementById("jobCompany").value;
    const description = document.getElementById("jobDescription").value;
    const posted_by = document.getElementById("employerId").value; // hidden field

    const res = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company, description, posted_by })
    });

    const data = await res.json();
    alert(data.message || "Job posted!");
});

// ---------- List Jobs ----------
async function loadJobs() {
    const res = await fetch(`${API_URL}/jobs`);
    const jobs = await res.json();

    const container = document.getElementById("jobsList");
    if (container) {
        container.innerHTML = "";
        jobs.forEach(job => {
            const div = document.createElement("div");
            div.classList.add("job-card");
            div.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.company}</p>
                <p>${job.description}</p>
                <button onclick="applyJob(${job.id})">Apply</button>
            `;
            container.appendChild(div);
        });
    }
}

// ---------- Apply Job ----------
async function applyJob(jobId) {
    const user_id = localStorage.getItem("userId") || 1; // temp user
    const res = await fetch(`${API_URL}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, job_id: jobId, cv: "cv.pdf" })
    });

    const data = await res.json();
    alert(data.message || "Applied!");
}

// ---------- Contact ----------
document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const content = document.getElementById("contactMessage").value;

    const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, content })
    });

    const data = await res.json();
    alert(data.message || "Message sent!");
});

// Load jobs automatically if container exists
if (document.getElementById("jobsList")) {
    loadJobs();
}
