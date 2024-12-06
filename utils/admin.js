export function imageFormSubmission() {

  const imageForm = document.getElementById('upload-form');

  // When 
  imageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(imageForm);

    try {
      const response = await fetch("http://127.0.0.1:8000/posts/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MzM0OTAzNDN9.kHXEqKiE6nV-V4u75JTXYrPbj5fvUOTYQ5flYMjCfzw"
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

imageFormSubmission();