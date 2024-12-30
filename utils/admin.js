// Upload images via backend

export function imageFormSubmission() {

  const input = document.getElementById('upload');

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const inputLabel = document.getElementById('upload-area');
      inputLabel.style.backgroundImage = `url('${e.target.result}')`
      inputLabel.style.backgroundSize = 'cover';
    };
    reader.readAsDataURL(file);
  })

  const imageForm = document.getElementById('upload-form');

  imageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(imageForm);

    let token = '';
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === "access_token") {
        token = value;
      }
    }

    console.log(formData);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/posts/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful: ', result);
      } else {
        console.error('Upload failed: ', response.statusText);
      }
    } catch (e) {
      console.error('Error uploading files: ', e);
    }
  });
}

// ------------------------------------------------------------------------------------------------

// Opening upload modal

if (window.location.pathname.endsWith('portfolio.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-button');
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('upload-modal');
    const closeButton = document.getElementById('x-button');
    const uploadForm = document.getElementById('upload-form')
    const uploadArea = document.getElementById('upload-area');

    uploadButton.addEventListener('click', () => {
      overlay.classList.remove('is-hidden');
      popup.classList.remove('is-hidden');
    });

    closeButton.addEventListener('click', () => {
      overlay.classList.add('is-hidden');
      popup.classList.add('is-hidden');
      uploadForm.reset();
      uploadArea.style.backgroundImage = 'none';

    });

    overlay.addEventListener('click', (event) => {
      if (!popup.contains(event.target)) {
        overlay.classList.add('is-hidden');
        popup.classList.add('is-hidden');
        uploadForm.reset();
        uploadArea.style.backgroundImage = 'none';
      }
    });
  });
}

// ------------------------------------------------------------------------------------------------

// Opening/closing login and logout modals

if (window.location.pathname.endsWith('index.html')) {

  const loginButton = document.getElementById('login-button');
  if (document.cookie) {
    loginButton.textContent = 'Logout';
  } else {
    loginButton.textContent = 'Login';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const loginModal = document.getElementById('login-modal');
    const logoutModal = document.getElementById('logout-modal');

    loginButton.addEventListener('click', () => {
      overlay.classList.remove('is-hidden');
      if (loginButton.textContent === 'Login') {
        loginModal.classList.remove('is-hidden');
      } else {
        logoutModal.classList.remove('is-hidden');
      }
    });

    overlay.addEventListener('click', (event) => {
      if (!loginModal.contains(event.target)) {
        overlay.classList.add('is-hidden');
        if (loginButton.textContent === 'Login') {
          loginModal.classList.add('is-hidden');
          const loginForm = document.getElementById('login-form');
          loginForm.reset();
        } else {
          logoutModal.classList.add('is-hidden');
        }
      }
    });

    const logoutButton = document.getElementById('logout');
    const cancelButton = document.getElementById('cancel');

    logoutButton.onclick = () => {
      overlay.classList.add('is-hidden');
      logoutModal.classList.add('is-hidden');
      loginButton.textContent = 'Login'
      document.cookie = `accessToken=; path=/; max-age=0`
    };

    cancelButton.onclick = () => {
      overlay.classList.add('is-hidden');
      logoutModal.classList.add('is-hidden');
    };
  });
}


// ------------------------------------------------------------------------------------------------

// Submitting login credentials

if (window.location.pathname.endsWith('index.html')) {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error('Username or Password is incorrect')
      }

      const data = await response.json();
      document.cookie = `accessToken=${data.access_token}; path=/; max-age=3600`;

      const loginModal = document.getElementById('login-modal');
      const overlay = document.getElementById('overlay');
      loginModal.classList.add('is-hidden');
      overlay.classList.add('is-hidden');

      const loginButton = document.getElementById('login-button');
      loginButton.textContent = 'Logout';

      const loginForm = document.getElementById('login-form');
      loginForm.reset();

    } catch (error) {
      console.error('Error: ', error);
      alert(error.message);
    }
  });
}

// ------------------------------------------------------------------------------------------------

// Reveal upload button

if (window.location.pathname.endsWith('portfolio.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-label');
    if (document.cookie) {
      uploadButton.style.display = "block";
    } else {
      uploadButton.style.display = "none";
    }
  });
}

// ------------------------------------------------------------------------------------------------

imageFormSubmission();