// const logoutButton = document.getElementById('logoutButton');

// logoutButton.addEventListener('click', async () => {
//     try {
//         const response = await fetch('/logout', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' }
//         });

//         const result = await response.json();

//         if (result.redirectUrl) {
//             alert(result.message); 
//             window.location.href = result.redirectUrl; // Redirect to login page
//         } else {
//             alert('Failed to logout. Please try again.');
//         }
//     } catch (error) {
//         console.error('Logout error:', error);
//         alert('An error occurred. Please try again.');
//     }
// });

    document.getElementById('logoutButton').addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'GET',
                credentials: 'same-origin'
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                window.location.href = '/login';  // Redirect to login page after logout
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout Error:', error);
            alert('An error occurred during logout.');
        }
    });

