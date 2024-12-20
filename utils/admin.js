export function imageFormSubmission() {

  const imageForm = document.getElementById('upload-form');

  imageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(imageForm);

    try {
      const response = await fetch("http://127.0.0.1:8000/posts/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzM3NTA2MjJ9.ZzbRBK15DLn1YEbH2kV1EzUi_ExaUf2KkkQmD9SurGU"
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

document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.getElementById('upload-button');
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('upload-modal');
  const closeButton = document.getElementById('x-button');

  uploadButton.addEventListener('click', () => {
    overlay.classList.remove('is-hidden');
    popup.classList.remove('is-hidden');
  });

  closeButton.addEventListener('click', () => {
    overlay.classList.add('is-hidden');
    popup.classList.add('is-hidden');
  });

  overlay.addEventListener('click', (event) => {
    if (!popup.contains(event.target)) {
      overlay.classList.add('is-hidden');
      popup.classList.add('is-hidden');
    }
  });
});

imageFormSubmission();