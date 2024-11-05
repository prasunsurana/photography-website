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

export function socialExpander() {

  const expander = document.querySelector('.social-expander-container');
  const socialContainer = document.querySelector('.social-container-row');
  const buttonArray = document.getElementsByClassName('social-row');

  expander.addEventListener('click', () => {

    if (socialContainer.style.visibility === 'hidden') {
      expander.style.opacity = 0.4;
      socialContainer.style.visibility = "visible";

      for (let i = 0; i < buttonArray.length; i++) {
        buttonArray[i].style.display = 'block';
      };

    } else {
      socialContainer.style.visibility = "hidden";

      for (let i = 0; i < buttonArray.length; i++) {
        buttonArray[i].style.display = 'None';
      };
    };

  });
};

searchBarListener();
searchBarMouseoverListener();
searchBarMouseoutListener();
searchBarOffListener();
socialExpander();