
// Fetch the playlists from the backend
async function fetchPlaylists() {
    try {
        const response = await fetch('http://localhost:3000/api/playlists');
        const playlists = await response.json();
        const container = document.getElementById('playlist-container');
        playlists.forEach(playlist => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>${playlist.name}</h3>
                <p>${playlist.category}</p>
                <button onclick="deletePlaylist(${playlist.id})">Delete</button>
                <button onclick="updatePlaylist(${playlist.id})">Update</button>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

// Create a new playlist
document.getElementById('create-playlist-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('playlist-name').value;
    const category = document.getElementById('playlist-category').value;
    const description = document.getElementById('playlist-description').value;

    try {
        const response = await fetch('http://localhost:3000/api/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, category, description })
        });

        const data = await response.json();
        alert('Playlist created successfully!');
        window.location.href = 'playlist.html'; // Redirect to the playlist page
    } catch (error) {
        console.error('Error creating playlist:', error);
    }
});

// Delete a playlist
async function deletePlaylist(id) {
    try {
        await fetch(`http://localhost:3000/api/playlists/${id}`, {
            method: 'DELETE',
        });

        alert('Playlist deleted!');
        window.location.reload(); // Reload the page to see changes
    } catch (error) {
        console.error('Error deleting playlist:', error);
    }
}

// Update a playlist
async function updatePlaylist(id) {
    const name = prompt('Enter new name:');
    const category = prompt('Enter new category:');
    const description = prompt('Enter new description:');

    try {
        const response = await fetch(`http://localhost:3000/api/playlists/${id}`, {
          method: 'PUT',
           headers: {
                'Content-Type': 'application/json',
          },
           body: JSON.stringify({ name, category, description })
        });

        const data = await response.json();
        alert('Playlist updated!');
        window.location.reload(); // Reload the page to see changes
   } catch (error) {
     console.error('Error updating playlist:', error);
        }      
}

// Call this on the playlist page load
fetchPlaylists();




