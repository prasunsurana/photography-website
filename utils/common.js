// Dynamically render the dropdown list by querying the database for distinct countries

document.addEventListener('DOMContentLoaded', () => {
  fetch(`http://127.0.0.1:8000/posts/countries`)
    .then(response => response.json())
    .then(countries => {
      countries.forEach(country => {
        const countryList = document.querySelector('.dropdown');

        const newLi = document.createElement('li');
        const newAnchor = document.createElement('a');

        newAnchor.href = `/frontend/portfolio.html?country=${encodeURIComponent(country)}`;
        newAnchor.textContent = country;

        newLi.appendChild(newAnchor);
        countryList.appendChild(newLi);
      });
    });
});
