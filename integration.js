// Backend API URL (marka aad Render ku deploy-gareyso ku beddel)
const API_URL = "https://smart-employment-service.onrender.com";

// Register
async function registerUser(name, email, password) {
    const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, password})
    });
    return res.json();
}

// Login
async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });
    return res.json();
}

// Post Job
async function postJob(title, description, company, location) {
    const res = await fetch(`${API_URL}/api/post-job`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, description, company, location})
    });
    return res.json();
}

// Apply Internship
async function applyInternship(name, email, university, department) {
    const res = await fetch(`${API_URL}/api/apply-internship`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, university, department})
    });
    return res.json();
}

// Apply Shaqotag
async function applyShaqotag(name, email, skills, experience) {
    const res = await fetch(`${API_URL}/api/apply-shaqotag`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, skills, experience})
    });
    return res.json();
}
