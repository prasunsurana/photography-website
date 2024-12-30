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
        let infoContainer = document.createElement('div');
        let captionDiv = document.createElement('div');
        let locationDiv = document.createElement('div');
        let caption = document.createElement('label');
        let location = document.createElement('label');
        let deleteButton = document.createElement('div')

        imageDiv.className = 'image-div';
        image.className = "img";
        infoContainer.className = 'info-container'
        captionDiv.className = 'caption-div';
        locationDiv.className = 'location-container';
        caption.className = 'caption';
        location.className = 'location';
        deleteButton.className = 'delete-container'

        deleteButton.innerHTML = '<ion-icon id="delete-icon" name="trash-outline"></ion-icon>'

        image.src = value.s3_url;
        caption.textContent = value.caption;
        location.textContent = value.location;

        image.onload = () => {
          imageDiv.style.height = `${image.height + infoContainer.offsetHeight + 10}px`; ``
        };

        imageDiv.appendChild(image);
        imageDiv.appendChild(infoContainer);
        imageDiv.appendChild(deleteButton);
        infoContainer.appendChild(captionDiv);
        infoContainer.appendChild(locationDiv);
        captionDiv.appendChild(caption);
        locationDiv.appendChild(location);
        photoGrid.appendChild(imageDiv);
      }

    } else {
      console.error('Failed to fetch images: ', response.statusText);
    }
  } catch (e) {
    console.error('Error fetching images: ', e);
  }
});

// ------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.image-div');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate'); // Add the animation class
        observer.unobserve(entry.target); // Stop observing once the animation is triggered
      }
    });
  }, {
    root: null, // Use the viewport as the root
    rootMargin: '0px 0px -60% 0px', // Trigger 40% up from the bottom of the viewport
    threshold: 0 // Trigger when any part of the target is visible
  });

  images.forEach((image) => {
    observer.observe(image);
  });
});

// ------------------------------------------------------------------------------------------------


// After you are finished with local development and deployed the website, make sure you go to the Permissions
// tab of your S3 bucket, go to CORS, and change Allowed Origins in the JSON to the website URL.