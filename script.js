// 🌐 Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ✅ Basic form validation feedback
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    const inputs = form.querySelectorAll('input, textarea');
    let valid = true;
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        input.style.borderColor = 'red';
        valid = false;
      } else {
        input.style.borderColor = '#ccc';
      }
    });
    if (!valid) {
      e.preventDefault();
      alert('Please fill out all required fields correctly.');
    }
  });
});

// 🌙 Optional: Dark mode toggle (if you want to add later)
/*
const toggleBtn = document.getElementById('darkModeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
*/
