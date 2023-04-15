import { Renderer, basePoint } from './utilities/renderer';

type DotProperties = Point;
type LineProperties = Line;
type RectangleProperties = Omit<Line, 'end'> & Partial<Pick<Line, 'end'>> & Partial<Size>;
interface CircleProperties {
  center: Point;
  radius: number;
}
interface TextProperties {
  start: Point;
  text: string;
  size: number;
}
interface ImageProperties {
  image: CanvasImageSource;
  start: Point;
  imageStart: Point;
  size: Size;
  ratio?: number;
}

type Nullable<T> = T | undefined | null;

export class Canvas {
  private _renderer: Nulalble<Renderer>;

  constructor(protected element: HTMLCanvasElement) {}

  get width(): number {
    return parseInt(this.element.getAttribute('width') ?? '0');
  }
  set width(value: number) {
    this.element.setAttribute('width', `${value}`);
  }
  get height(): number {
    return parseInt(this.element.getAttribute('height') ?? '0');
  }
  set height(value: number) {
    this.element.setAttribute('height', `${value}`);
  }
  get size(): Size {
    const { width, height }: Canvas = this;
    return { width, height };
  }

  get renderer(): Renderer {
    if (!this._renderer) {
      this._renderer = new Renderer(basePoint, basePoint, basePoint, basePoint, 0);
    }
    return this._renderer;
  }
  set renderer(value: Renderer) {
    this._renderer = value;
  }

  private get context(): CanvasRenderingContext2D {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const context: CanvasRenderingContext2D = this.element.getContext('2d')!;
    context.save();
    context.beginPath();
    return context;
  }

  private color(context: CanvasRenderingContext2D, color: string) {
    context.fillStyle = color;
    context.strokeStyle = color;
    return this.getDrawBuilder(context);
  }
  private lineWidth(context: CanvasRenderingContext2D, lineWidth: number) {
    context.lineWidth = lineWidth;
    return this.getDrawBuilder(context);
  }

  private stroke(context: CanvasRenderingContext2D): void {
    context.stroke();
    context.closePath();
    context.restore();
  }
  private fill(context: CanvasRenderingContext2D): void {
    context.fill();
    context.closePath();
    context.restore();
  }

  private getDrawBuilder(context: CanvasRenderingContext2D) {
    return {
      color: (color: string) => this.color(context, color),
      width: (lineWidth: number) => this.lineWidth(context, lineWidth),
      stroke: () => this.stroke(context),
      fill: () => this.fill(context),
      draw: () => this.fill(context),
    };
  }

  clear(): void {
    const { context, width, height }: Canvas = this;
    context.clearRect(0, 0, width, height);
    context.closePath();
    context.restore();
  }
  dot({ x, y }: DotProperties) {
    const { context }: Canvas = this;
    context.rect(x, y, 1, 1);
    return this.getDrawBuilder(context);
  }
  line({ start, end }: LineProperties) {
    const { context }: Canvas = this;
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    return this.getDrawBuilder(context);
  }
  rectangle({ start, end, width = 0, height = 0 }: RectangleProperties) {
    const { context }: Canvas = this;
    if (end) {
      context.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else {
      context.rect(start.x, start.y, width, height);
    }
    return this.getDrawBuilder(context);
  }
  circle({ center, radius }: CircleProperties) {
    const { context }: Canvas = this;
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    return this.getDrawBuilder(context);
  }
  text({ start, text, size }: TextProperties) {
    const { context }: Canvas = this;
    context.font = `Consolas ${size}px`;
    context.fillText(text, start.x, start.y);
    context.closePath();
    context.restore();
  }
}
