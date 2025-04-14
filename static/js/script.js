const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signUp');

signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click',function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";

})
const signUpContainer=document.getElementById('signUp')
const messagEle=document.getElementById('message')
const confmessage=document.getElementById('confirmMessage')
const password=document.getElementById('password')
const cnfrmpassword=document.getElementById('confirmPassword')
const showPassword=document.getElementById('showPassword')

// ===Pasword hide and show==
showPassword.addEventListener("change",()=>{
    if(showPassword.checked){
        password.type="text";
        cnfrmpassword.type="text";
    }
    else{
        password.type="password";
        cnfrmpassword.type="password";
    }

})

const signIn=document.getElementById('signIn')
const password1=document.getElementById('password1')
const showPassword1=document.getElementById('showPassword1')


// ===Pasword hide and show==
showPassword1.addEventListener("change",()=>{
    if(showPassword1.checked){
        password1.type="text";
    }
    else{
        password1.type="password";
    }

})
document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.querySelector('#signUp form');
    const loginForm = document.querySelector('#signIn form');

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const message = document.getElementById("message");
    const confirmMessage = document.getElementById("confirmMessage");

    const emailLogin = document.getElementById("emailLogin");
    const passwordLogin = document.getElementById("password1");

    // === Helper: hash password ===
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // ======= SIGN UP FORM ========
    signUpForm.addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const fName = document.getElementById("fName").value.trim();
        const lName = document.getElementById("lName").value.trim();
    
        let isValid = true;
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            isValid = false;
        }
    
        if (password.length < 6) {
            message.textContent = "Password must be at least 6 characters.";
            message.style.color = "red";
            isValid = false;
        } else {
            message.textContent = "";
        }
    
        if (password !== confirmPassword) {
            confirmMessage.textContent = "Passwords do not match.";
            confirmMessage.style.color = "red";
            isValid = false;
        } else {
            confirmMessage.textContent = "";
        }
    
        if (isValid) {
            const hashedPassword = await hashPassword(password);
    
            const user = {
                firstName: fName,
                lastName: lName,
                email: email,
                passwordHash: hashedPassword
            };
    
            try {
                const response = await fetch("http://127.0.0.1:5000/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    alert("Registration successful!");
                    signUpForm.reset();
                } else {
                    alert(result.error || "Signup failed.");
                }
            } catch (err) {
                alert("Error connecting to the server.");
                console.error(err);
            }
        }
    });

    const recoverLink = document.getElementById("recoverLink");
const recoverForm = document.getElementById("recoverPassword");
const signInFormContainer = document.getElementById("signIn");
const backToLoginBtn = document.getElementById("backToLogin");

// Show recover form
recoverLink.addEventListener("click", () => {
    signInFormContainer.style.display = "none";
    recoverForm.style.display = "block";
});

// Back to login
backToLoginBtn.addEventListener("click", () => {
    recoverForm.style.display = "none";
    signInFormContainer.style.display = "block";
});

// Handle form submission
document.getElementById("recoverForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("recoverEmail").value.trim();
    const newPassword = document.getElementById("newPassword").value;

    const response = await fetch("http://127.0.0.1:5000/recover", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" // This is crucial for the server to understand the request
        },
        body: JSON.stringify({ email, newPassword }) // Send JSON data
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        recoverForm.reset();
        recoverForm.style.display = "none";
        signInFormContainer.style.display = "block";
    } else {
        alert(result.error || "Password reset failed.");
    }
});

// Recover Password Show/Hide
const newPasswordInput = document.getElementById("newPassword");
const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
const showRecoverPassword = document.getElementById("showRecoverPassword");

showRecoverPassword.addEventListener("change", () => {
    const type = showRecoverPassword.checked ? "text" : "password";
    newPasswordInput.type = type;
    confirmNewPasswordInput.type = type;
});


    // ======= LOGIN FORM ==========
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
        const enteredEmail = emailLogin.value.trim();
        const enteredPassword = passwordLogin.value;

        if (!savedUser) {
            alert("No user found. Please register first.");
            return;
        }

        const loginData = {
            email: enteredEmail,
            passwordHash: await hashPassword(enteredPassword)  // Make sure it's hashed
        };
        
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });
        
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = "nextpage.html";
        } else {
            alert(result.error || "Login failed");
        }
        
    });
});
