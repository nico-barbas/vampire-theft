export class Vector2 {
  x: number;
  y: number;

  constructor(_x: number = 0, _y: number = 0) {
    this.x = _x;
    this.y = _y;
  }

  zero() {
    this.x = 0;
    this.y = 0;
  }

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  addXY(x: number, y: number): Vector2 {
    return new Vector2(this.x + x, this.y + y);
  }

  addInPlace(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  scaleInPlace(s: number): Vector2 {
    this.x *= s;
    this.y *= s;
    return this;
  }

  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  floor(): Vector2 {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  isZero(): boolean {
    return this.x == 0 && this.y == 0;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalizeInPlace(): Vector2 {
    const il = 1 / this.length();

    this.x *= il;
    this.y *= il;

    return this;
  }
}

export class Rectangle {
  origin: Vector2;
  width: number;
  height: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.origin = new Vector2(x, y);
    this.width = w;
    this.height = h;
  }
}
