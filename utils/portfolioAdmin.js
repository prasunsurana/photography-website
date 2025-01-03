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
    const country = imageForm.elements.country.value;

    let token = '';
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === "access_token") {
        token = value;
      }
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

// Cookie retrieval

export function retrieveCookie() {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === 'accessToken') {
      return decodeURIComponent(value);
    } else {
      return null;
    }
  }
}

// ------------------------------------------------------------------------------------------------

imageFormSubmission();