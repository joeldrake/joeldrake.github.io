if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .catch(err => console.error('Service worker registration failed', err));
}

const spotifyPlayer = document.getElementById('spotify');
const megamanDiv = document.getElementById('megaman');

function togglePlayer() {
  spotifyPlayer.classList.toggle('open');
}

let x = 0;
let y = 0;
setInterval(() => {
  let top = 15 - y * 100;
  let left = 15 - x * 100;

  megamanDiv.style.backgroundPosition = `${left}px ${top}px`;

  x++;

  if (x === 5) {
    y++;
    x = 0;
  }

  if (y === 3) y = 1;
}, 300);
