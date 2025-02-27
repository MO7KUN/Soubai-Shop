

function logout() {
    fetch('https://sbaishop.com/api/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Logout successful:', data);

        // Clear user data from localStorage/sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('permissions');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('permissions');

        // Redirect to the login page or homepage
        window.location.href = 'index.html'; // Change this to your desired redirect URL
    })
    .catch(error => {
        console.error('Logout failed:', error.message || 'Unknown error');

        // Optionally, display an error message to the user
        alert('Logout failed. Please try again.');
    });
}