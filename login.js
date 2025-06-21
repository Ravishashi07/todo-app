const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});
signInBtnLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

window.addEventListener("DOMContentLoaded", () => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedUsername && rememberedPassword) {
        document.querySelector("#loginUsername").value = rememberedUsername;
        document.querySelector("#loginPassword").value = rememberedPassword;
       const rememberCheckbox = document.querySelector("#rememberMe");
        const rememberMeChecked = rememberCheckbox ? rememberCheckbox.checked : false;

    } else {
        document.querySelector("#loginUsername").value = "";
        document.querySelector("#loginPassword").value = "";
    }
});

const showToast = (message, type = "default") => {
    const toast = document.querySelector("#toast");
    toast.textContent = message;

    toast.className = "toast"; 
    if (type === "success") toast.classList.add("success");
    if (type === "error") toast.classList.add("error");

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
};

const signUpForm = document.querySelector("#signupForm");

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.querySelector("#signupUsername").value.trim();
    const email = document.querySelector("#signupEmail").value.trim();
    const password = document.querySelector("#signupPassword").value.trim();

    if (!username || !email || !password) {
        showToast("❗ Please fill all fields.", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("todoUsers")) || [];
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        showToast("❌ Username already exists.", "error");
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("todoUsers", JSON.stringify(users));

    showToast("✅ Signup successful! Please log in.", "success");
    wrapper.classList.remove('active');
    signUpForm.reset();
});

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputUsername = document.querySelector("#loginUsername").value.trim();
    const inputPassword = document.querySelector("#loginPassword").value.trim();
    const rememberMeChecked = document.querySelector("#rememberMe").checked;

    const users = JSON.parse(localStorage.getItem("todoUsers")) || [];
    const matchedUser = users.find(user => user.username === inputUsername && user.password === inputPassword);

    if (matchedUser) {
        localStorage.setItem("currentUser", JSON.stringify(matchedUser)); 
        showToast("✅ Login successful!", "success");

        if (rememberMeChecked) {
            localStorage.setItem("rememberedUsername", inputUsername);
            localStorage.setItem("rememberedPassword", inputPassword);
        } else {
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedPassword");
        }

        setTimeout(() => {
            window.location.href = "todo/todo.html";
        }, 1000);
    } else {
        showToast("❌ Invalid credentials.", "error");
    }

    loginForm.reset();
});
