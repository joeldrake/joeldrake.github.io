if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .catch(err => console.error('Service worker registration failed', err));
}
