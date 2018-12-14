if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .catch(err => console.error('Service worker registration failed', err));
}

const spotifyPlayer = document.getElementById('spotify');

function togglePlayer() {
  spotifyPlayer.classList.toggle('open');
}
