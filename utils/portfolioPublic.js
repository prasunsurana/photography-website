import { retrieveCookie } from "./portfolioAdmin.js";

// Dynamically create photo grid

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const country = params.get("country");

  if (!country) {
    console.error("No country selected!");
    return;
  }

  // Dynamically create heading image for each country
  let introSection = document.querySelector(".intro-section");
  introSection.style.background = `url('../photos/${country}.jpg')`;
  introSection.style.backgroundSize = "cover";

  let gridHeader = document.querySelector(".photo-grid-header");
  gridHeader.innerHTML = country.toUpperCase();

  // API request for image display
  try {
    const response = await fetch(`http://127.0.0.1:8000/posts/${country}`, {
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      const photoGrid = document.querySelector(".photo-grid");
      photoGrid.innerHTML = "";

      // Create template for each image, with divs, captions and delete button
      for (const [key, value] of result.entries()) {
        let imageDiv = document.createElement("div");
        let image = document.createElement("img");
        let infoContainer = document.createElement("div");
        let captionDiv = document.createElement("div");
        let locationDiv = document.createElement("div");
        let caption = document.createElement("label");
        let location = document.createElement("label");
        let deleteButton = document.createElement("div");

        imageDiv.className = "image-div";
        image.className = "img";
        infoContainer.className = "info-container";
        captionDiv.className = "caption-div";
        locationDiv.className = "location-container";
        caption.className = "caption";
        location.className = "location";
        deleteButton.classList.add("admin", "delete-container");

        deleteButton.innerHTML =
          '<ion-icon class="delete-icon" name="trash-outline"></ion-icon>';

        image.src = value.s3_url;
        caption.textContent = value.caption;
        location.textContent = value.location;

        image.onload = () => {
          imageDiv.style.height = `${
            image.height + infoContainer.offsetHeight
          }px`;
        };

        imageDiv.appendChild(image);
        imageDiv.appendChild(infoContainer);
        imageDiv.appendChild(deleteButton);
        infoContainer.appendChild(captionDiv);
        infoContainer.appendChild(locationDiv);
        captionDiv.appendChild(caption);
        locationDiv.appendChild(location);
        photoGrid.appendChild(imageDiv);

        const access_token = retrieveCookie();

        // Toggle display of delete button based on admin login
        if (access_token) {
          deleteButton.style.display = "block";
          deleteButton.style.pointerEvents = "auto";
        } else {
          deleteButton.style.display = "none";
          deleteButton.style.pointerEvents = "none";
        }

        // Event listener for image deletion functionality
        deleteButton.addEventListener("click", () => {
          const imageElement = deleteButton.parentNode;
          Array.from(imageElement.childNodes).forEach(async (ele) => {
            if (ele instanceof HTMLImageElement) {
              try {
                // URL parameter for FastAPI backend endpoint must be included as a query parameter
                const response = await fetch(
                  `http://127.0.0.1:8000/posts/${country}?url=${encodeURIComponent(
                    ele.src
                  )}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${access_token}`,
                    },
                  }
                );

                if (response.ok) {
                  // Check if image was the last in album to be deleted. If so, delete album from dropdown.
                  if (photoGrid.childNodes.length === 1) {
                    const dropdown = document.querySelector(".dropdown");
                    Array.from(dropdown.childNodes).forEach((li) => {
                      if (li.textContent.trim() === country) {
                        dropdown.removeChild(li);
                        window.location.href = "index.html";
                      }
                    });
                  } else {
                    window.location.reload();
                  }
                  console.log("Successfully deleted!");
                } else {
                  console.log("Failed to delete post: ", response.status);
                }
              } catch (error) {
                console.log(error);
              }
            }
          });
        });
      }
    } else {
      console.error("Failed to fetch images: ", response.statusText);
    }
  } catch (e) {
    console.error("Error fetching images: ", e);
  }
});

// ------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".image-div");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate"); // Add the animation class
          observer.unobserve(entry.target); // Stop observing once the animation is triggered
        }
      });
    },
    {
      root: null, // Use the viewport as the root
      rootMargin: "0px 0px -60% 0px", // Trigger 40% up from the bottom of the viewport
      threshold: 0, // Trigger when any part of the target is visible
    }
  );

  images.forEach((image) => {
    observer.observe(image);
  });
});

// ------------------------------------------------------------------------------------------------

// After you are finished with local development and deployed the website, make sure you go to the Permissions
// tab of your S3 bucket, go to CORS, and change Allowed Origins in the JSON to the website URL.
