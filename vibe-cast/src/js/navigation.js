export function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active nav item
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}
