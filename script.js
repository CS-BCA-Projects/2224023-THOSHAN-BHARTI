
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



//script for admin page 

// Sound management
const addSoundForm = document.getElementById('add-sound-form');
const soundTitleInput = document.getElementById('sound-title');
const soundFileInput = document.getElementById('sound-file');
const soundList = document.getElementById('sound-list');

// List to store sounds temporarily
let sounds = [];

addSoundForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const soundTitle = soundTitleInput.value;
    const soundFile = soundFileInput.value;

    if (soundTitle && soundFile) {
        const sound = {
            title: soundTitle,
            file: soundFile,
        };

        sounds.push(sound);
        renderSounds();
        addSoundForm.reset();
    }
});

function renderSounds() {
    soundList.innerHTML = '';
    sounds.forEach((sound, index) => {
        const li = document.createElement('li');
        li.textContent = `${sound.title} - `;
        
        const playLink = document.createElement('a');
        playLink.href = sound.file;
        playLink.textContent = 'Play Sound';
        playLink.target = '_blank';

        li.appendChild(playLink);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteSound(index);
        
        li.appendChild(deleteBtn);
        soundList.appendChild(li);
    });
}

function deleteSound(index) {
    sounds.splice(index, 1);
    renderSounds();
}

// User management
const registerUserForm = document.getElementById('register-user-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userList = document.getElementById('users');

// List to store registered users temporarily
let users = [];

registerUserForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (username && email && password) {
        const user = {
            username: username,
            email: email,
            password: password, // Note: In real scenarios, use password hashing
        };

        users.push(user);
        renderUsers();
        registerUserForm.reset();
    }
});

function renderUsers() {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = `${user.username} - ${user.email}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteUser(user);
        
        li.appendChild(deleteBtn);
        userList.appendChild(li);
    });
}

function deleteUser(user) {
    users = users.filter(u => u !== user);
    renderUsers();
}
