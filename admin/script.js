// Simulated data loading
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('gmList').innerText = 'No GM registrations yet.';
  document.getElementById('panelList').innerText = 'No panel applications yet.';
  document.getElementById('awardList').innerText = 'No award submissions yet.';
  document.getElementById('certList').innerText = 'No certificate requests yet.';
});

// Notice posting
document.getElementById('noticeForm')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Notice posted successfully!');
});
