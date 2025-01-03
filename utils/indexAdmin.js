// Opening/closing login and logout modals

if (window.location.pathname.endsWith('index.html')) {

  const loginButton = document.getElementById('login-button');
  if (document.cookie) {
    loginButton.textContent = 'Logout';
  } else {
    loginButton.textContent = 'Login';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const loginModal = document.getElementById('login-modal');
    const logoutModal = document.getElementById('logout-modal');

    loginButton.addEventListener('click', () => {
      overlay.classList.remove('is-hidden');
      if (loginButton.textContent === 'Login') {
        loginModal.classList.remove('is-hidden');
      } else {
        logoutModal.classList.remove('is-hidden');
      }
    });

    overlay.addEventListener('click', (event) => {
      if (!loginModal.contains(event.target)) {
        overlay.classList.add('is-hidden');
        if (loginButton.textContent === 'Login') {
          loginModal.classList.add('is-hidden');
          const loginForm = document.getElementById('login-form');
          loginForm.reset();
        } else {
          logoutModal.classList.add('is-hidden');
        }
      }
    });

    const logoutButton = document.getElementById('logout');
    const cancelButton = document.getElementById('cancel');

    logoutButton.onclick = () => {
      overlay.classList.add('is-hidden');
      logoutModal.classList.add('is-hidden');
      loginButton.textContent = 'Login'
      document.cookie = `accessToken=; path=/; max-age=0`
    };

    cancelButton.onclick = () => {
      overlay.classList.add('is-hidden');
      logoutModal.classList.add('is-hidden');
    };
  });
}

// ------------------------------------------------------------------------------------------------

// Submitting login credentials

if (window.location.pathname.endsWith('index.html')) {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error('Username or Password is incorrect')
      }

      const data = await response.json();
      document.cookie = `accessToken=${data.access_token}; path=/; max-age=3600`;

      const loginModal = document.getElementById('login-modal');
      const overlay = document.getElementById('overlay');
      loginModal.classList.add('is-hidden');
      overlay.classList.add('is-hidden');

      const loginButton = document.getElementById('login-button');
      loginButton.textContent = 'Logout';

      const loginForm = document.getElementById('login-form');
      loginForm.reset();

    } catch (error) {
      console.error('Error: ', error);
      alert(error.message);
    }
  });
}

// ------------------------------------------------------------------------------------------------