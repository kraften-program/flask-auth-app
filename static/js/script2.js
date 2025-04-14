<script>
function showPage(pageId) {
    // Hide all content sections
    const pages = document.querySelectorAll('.content');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show the clicked page
    const page = document.getElementById(pageId);
    page.classList.add('active');
}

// Default to showing Page 1 on load
window.onload = function() {
    showPage('page1');
}

</script>