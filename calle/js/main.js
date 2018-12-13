const box = document.querySelector(`.box`);
const speechBubble = document.querySelector(`.speechBubble`);
const changableColor = document.querySelectorAll(`.changableColor`);
let clickCount = 1;
let colorChangeCount = 0;
speechBubble.addEventListener(`click`, doBurst);

const speechBubbelWords = [
  `<b>Welcome!</b><br />
  Click me, if you dare.`,

  `You clicked me! High five ✋`,

  `Well done, you are getting good 👏`,

  `Ok, thats enough now.`,

  `HEY! stop it!`,

  `NO MORE CLICKING!`,

  `AAAARRHHHH!!!! 😨`,
];

const colors = [
  `rgb(83, 201, 161)`,
  `rgb(164, 250, 27)`,
  `rgb(225, 231, 54)`,
  `rgb(235, 132, 243)`,
  `rgb(62, 152, 118)`,
  `rgb(232, 226, 113)`,
  `papayawhip`,
  `lightgreen`,
  `lightcoral`,
  `peachpuff`,
];

setTimeout(() => {
  console.log(clickCount);
  if (clickCount === 1) {
    //user has not clicked the bubble, shake it
    shakeSpeechBubble();
  }
}, 2000);

function shakeSpeechBubble() {
  speechBubble.classList.add('shake');
  setTimeout(() => {
    //shake animation runs for 0.4s, now when its done, remove shake class
    speechBubble.classList.remove('shake');
  }, 400);
}

function doBurst() {
  if (speechBubble.classList.contains('blowUp')) {
    //speechBubble has class blowUp, dont do normal click
    return;
  }

  box.classList.remove('burst');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      box.classList.add('burst');
      speechBubble.innerHTML = speechBubbelWords[clickCount];
      clickCount++;

      changeColors();

      if (clickCount >= speechBubbelWords.length) {
        //end of the array, do something funny
        speechBubble.blur();
        speechBubble.classList.add('blowUp');

        setTimeout(() => {
          resetBubble();
        }, 5000);
      }
    });
  });
}

function resetBubble() {
  clickCount = 1;
  speechBubble.classList.remove('blowUp');
  speechBubble.innerHTML = `
  <b>Well done!</b><br/>
  <p>You have clicked the bubble many times.</p>
  <p>Contact me if you want to know more about UX</p>
  `;
}

function changeColors() {
  document.body.style.backgroundColor = colors[colorChangeCount];
  changableColor.forEach(box => {
    box.style.color = colors[colorChangeCount];
  });
  colorChangeCount++;
  if (colorChangeCount >= colors.length) {
    colorChangeCount = 0;
  }
}
