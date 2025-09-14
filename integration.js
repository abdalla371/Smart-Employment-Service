document.addEventListener("DOMContentLoaded", () => {
    // Create Account Form
    const createAccountForm = document.getElementById("createAccountForm");
    if (createAccountForm) {
        createAccountForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
                username: document.getElementById("username").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };
            const res = await fetch("https://smart-employment-service-6.onrender.com/create-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            alert(result.message);
        });
    }

    // Login Form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };
            const res = await fetch("https://smart-employment-service-6.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            alert(result.message);
        });
    }

    // Post Job Form
    const postJobForm = document.getElementById("postJobForm");
    if (postJobForm) {
        postJobForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                company: document.getElementById("company").value
            };
            const res = await fetch("https://smart-employment-service-6.onrender.com/post-job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            alert(result.message);
        });
    }

    // Internship Form
    const internshipForm = document.getElementById("internshipForm");
    if (internshipForm) {
        internshipForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById("name").value,
                university: document.getElementById("university").value,
                major: document.getElementById("major").value
            };
            const res = await fetch("https://smart-employment-service-6.onrender.com/internship", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            alert(result.message);
        });
    }
});
