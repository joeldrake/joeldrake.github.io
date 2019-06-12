class Star {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.o = 0;
    this.reset();
  }

  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.z = Math.random() * window.innerWidth;
    this.o = '0.' + Math.floor(Math.random() * 99) + 1;
  }

  randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
  update() {
    this.z = this.z - 4;

    if (this.z <= 0) {
      this.z = window.innerWidth;
    }
  }
}

class Space {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    window.addEventListener('resize', () => this.onResize());
    this.onResize();
    this.updateBound = this.update.bind(this);
    requestAnimationFrame(this.updateBound);

    this.createStars();
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.focalLength = this.width / 2;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.createVignette();
  }

  createVignette() {
    const xMid = this.width / 2;
    const yMid = this.height / 2;
    const radius = Math.sqrt(xMid * xMid + yMid * yMid);
    this.vignette = this.ctx.createRadialGradient(
      xMid,
      yMid,
      0,
      xMid,
      yMid,
      radius,
    );

    this.vignette.addColorStop(0.44, `rgba(0,0,0,0)`);
    for (let i = 0; i <= 1; i += 0.1) {
      const alpha = Math.pow(i, 3);
      this.vignette.addColorStop(0.45 + i * 0.5, `rgba(0,0,0, ${alpha})`);
    }
  }

  createStars() {
    const starsAmount = window.innerWidth;
    this.stars = [];
    for (let s = 0; s < starsAmount; s++) {
      this.stars.push(new Star());
    }
  }
  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const star of this.stars) {
      star.update();

      let starX = (star.x - this.centerX) * (this.focalLength / star.z);
      //try: get mouse move X and Y instead of centerX and centerY
      starX += this.centerX;
      let starY = (star.y - this.centerY) * (this.focalLength / star.z);
      starY += this.centerY;
      const starRadius = this.focalLength / star.z;

      this.ctx.save();
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(starX, starY, starRadius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.globalAlpha = star.o;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.ctx.fillStyle = this.vignette;
    this.ctx.fillRect(0, 0, this.width, this.height);

    requestAnimationFrame(this.updateBound);
  }
}

new Space();
