class Snowflake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 0;
    this.alpha = 0;
    this.reset();
  }

  reset() {
    this.x = this.randomBetween(0, window.innerWidth);
    this.y = this.randomBetween(0, -window.innerHeight);

    this.radius = this.randomBetween(1, 5);
    this.vy = this.randomBetween(0.5, 2);
    this.vx = this.randomBetween(-1, 1);
    this.alpha = this.randomBetween(0.1, 0.9);
  }

  randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    const under = this.y + this.radius > window.innerHeight;
    const toTheLeft = this.x + this.radius < 0;
    const toTheRight = this.x + this.radius > window.innerWidth;
    if (under || toTheLeft || toTheRight) {
      this.reset();
    }
  }
}

class Snow {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    window.addEventListener('resize', () => this.onResize());
    this.onResize();
    this.updateBound = this.update.bind(this);
    requestAnimationFrame(this.updateBound);

    this.createSnowflakes();
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createSnowflakes() {
    const flakes = window.innerWidth / 4;
    this.snowflakes = [];
    for (let s = 0; s < flakes; s++) {
      this.snowflakes.push(new Snowflake());
    }
  }
  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const flake of this.snowflakes) {
      flake.update();

      this.ctx.save();
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.globalAlpha = flake.alpha;
      this.ctx.fill();
      this.ctx.restore();
    }
    requestAnimationFrame(this.updateBound);
  }
}

new Snow();
