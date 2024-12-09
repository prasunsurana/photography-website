export function gridGenerator() {

  const buttons = document.querySelectorAll('.country-button');

  // Add an event listener to each button, so that when it is clicked, it queries the pictures from that location
  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const location = button.innerHTML;

      try {
        const response = await fetch(`http://127.0.0.1:8000/posts/${location}`, {
          method: "GET"
        });

        if (response.ok) {
          const result = await response.json();
          const photoGrid = document.querySelector('.photo-grid')
          photoGrid.innerHTML = "";

          for (const [key, value] of result.entries()) {
            let image = document.createElement("img");
            image.className = "img";
            image.src = value.s3_url;
            console.log(image);
            photoGrid.appendChild(image);
          }
          console.log(photoGrid.innerHTML);
        }
      } catch (e) {
        console.log(e)
      }
    });
  });
}

gridGenerator();

// After you are finished with local development and deployed the website, make sure you go to the Permissions
// tab of your S3 bucket, go to CORS, and change Allowed Origins in the JSON to the website URL.