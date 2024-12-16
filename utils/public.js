document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const country = params.get('country');

  if (!country) {
    console.error('No country selected!');
    return;
  }

  let headerImage = document.querySelector('.heading-pic');
  headerImage.src = `/photos/${country}.jpg`;

  let gridHeader = document.querySelector('.photo-grid-header');
  gridHeader.innerHTML = country.toUpperCase();

  try {
    const response = await fetch(`http://127.0.0.1:8000/posts/${country}`, {
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
        photoGrid.appendChild(image);
      }
    } else {
      console.error('Failed to fetch images: ', response.statusText);
    }
  } catch (e) {
    console.error('Error fetching images: ', error);
  }
});

// After you are finished with local development and deployed the website, make sure you go to the Permissions
// tab of your S3 bucket, go to CORS, and change Allowed Origins in the JSON to the website URL.