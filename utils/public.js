document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const country = params.get('country');

  if (!country) {
    console.error('No country selected!');
    return;
  }

  let introSection = document.querySelector('.intro-section');
  introSection.style.background = `url('../photos/${country}.jpg')`
  introSection.style.backgroundSize = 'cover';

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
        let imageDiv = document.createElement('div');
        let image = document.createElement("img");
        imageDiv.appendChild(image);
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

// ------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.img');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate'); // Add the animation class
        observer.unobserve(entry.target); // Stop observing once the animation is triggered
      }
    });
  });

  images.forEach((image) => {
    observer.observe(image);
  });
});

// ------------------------------------------------------------------------------------------------


// After you are finished with local development and deployed the website, make sure you go to the Permissions
// tab of your S3 bucket, go to CORS, and change Allowed Origins in the JSON to the website URL.