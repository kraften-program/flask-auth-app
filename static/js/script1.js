// Mobile Menu Toggle Function
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Smooth Scroll Function for "Our Services" Button
function scrollToSection(id) {
    const element = document.querySelector(id);
    window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
    })

}
function showPage(id) {
    // Hide all content sections
    const pages = document.querySelector(id);
    pages.forEach(page => page.classList.remove('active'));
    
    // Show the clicked page
    const page = document.getElementById("page1");
    page.classList.add('active');
}

    function goToNextPage() {
        window.location.href = 'nextpage1.html';
    }

function showPage(id) {
    // Hide all content sections
    const pages = document.querySelector(id);
    pages.forEach(page => page.classList.remove('active'));
    
    // Show the clicked page
    const page = document.getElementById("page2");
    page.classList.add('active');
}

    function goToNextPage() {
        window.location.href = 'nextpage2.html';
      }


    function showPage(id) {
        // Hide all content sections
        const pages = document.querySelector(id);
        pages.forEach(page => page.classList.remove('active'));
        
        // Show the clicked page
        const page = document.getElementById("page3");
        page.classList.add('active');
    }
    
        function goToNextPage() {
            window.location.href = 'nextpage3.html';
          }
// script1.js

// Function to log out
function logout() {
    // Remove the user session data from localStorage or sessionStorage
    localStorage.removeItem('user'); // Replace 'user' with your session key
    // Alternatively, if you are using sessionStorage: sessionStorage.removeItem('user');

    // Redirect the user to the login page (or home page)
    window.location.href = 'proj.html'; // Change this URL to your login page
}

// Attach the logout function to the button
document.getElementById('logoutBtn').addEventListener('click', logout);

