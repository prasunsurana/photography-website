export function searchBarListener() {

  const searchBar = document.querySelector('.search');
  searchBar.addEventListener('click', () => {
    searchBar.style.width = '350px';

    const searchIcon = document.querySelector('.search-icon');
    searchIcon.style.transition = '0.15s';
    searchIcon.style.marginLeft = '110px';
  });
};

export function searchBarMouseoverListener() {
  const searchBar = document.querySelector('.search');
  searchBar.addEventListener('mouseover', () => {
    searchBar.style.opacity = 0.6;
  });
};

export function searchBarMouseoutListener() {
  const searchBar = document.querySelector('.search');
  searchBar.addEventListener('mouseout', () => {
    const value = document.getElementById('search-input').value;
    if (!value) {
      searchBar.style.transition = '0.15s';
      searchBar.style.opacity = 0.25;
      searchBar.style.width = '300px';

      const searchIcon = document.querySelector('.search-icon');
      searchIcon.style.transition = '0.15s';
      searchIcon.style.marginLeft = '60px';
    }
  });
};

export function searchBarOffListener() {

  const searchBar = document.querySelector('.search');
  document.addEventListener('click', (event) => {
    if (!searchBar.contains(event.target)) {
      searchBar.style.transition = '0.15s'
      searchBar.style.opacity = 0.25;
      searchBar.style.width = '300px';

      const searchIcon = document.querySelector('.search-icon');
      searchIcon.style.transition = '0.15s';
      searchIcon.style.marginLeft = '60px';
    };
  });
};

export function toggleSocialExpander() {

  const expander = document.querySelector('.social-expander-container');
  const socialContainer = document.querySelector('.social-container');
  const logos = document.getElementsByClassName('social-logo');

  expander.addEventListener('click', () => {
    expander.style.opacity = 0.4;
    socialContainer.style.transform = "rotate(-90deg)"

    for (let idx = 0; idx < logos.length; idx++) {
      logos[idx].style.transform = "rotate(90deg)";
      logos[idx].style.size = "20px";
    }

    socialContainer.style.visibility = "visible";
  });
};

searchBarListener();
searchBarMouseoverListener();
searchBarMouseoutListener();
searchBarOffListener();
toggleSocialExpander();