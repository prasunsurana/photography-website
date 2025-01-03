// Adding new subscribers

document.addEventListener('DOMContentLoaded', () => {
  const subscribeButton = document.querySelector('.subscribe');

  subscribeButton.addEventListener('click', async () => {

    let emailInput = document.querySelector('.subscriber-input');
    let emailNotice = document.getElementById('email-notice');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput.value.match(regex)) {
      emailNotice.textContent = 'Please enter a valid email!'
      emailNotice.style.visibility = 'visible';
    } else {
      try {
        const response = await fetch(`http://127.0.0.1:8000/subscribe?email=${emailInput.value}`, {
          method: "POST"
        });

        if (response.ok) {
          emailNotice.textContent = 'Thank you for subscribing!';
          emailNotice.style.visibility = 'visible';
          emailInput.value = '';
        } else if (response.status === 409) {
          emailNotice.textContent = 'A subscriber already exists under this email!'
          emailNotice.style.visibility = 'visible';
        } else {
          throw new Error('Error')
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});