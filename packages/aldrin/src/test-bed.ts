import { renderContext, RenderContext } from './context';
import { render } from './render';

export class TestBed {
  constructor(private readonly context: RenderContext, public readonly html: string) {}

  static async create(component: () => JSX.Element): Promise<TestBed> {
    const rContext = new RenderContext();
    const html = await renderContext.run(rContext, () => {
      return render(component());
    });
    return new TestBed(rContext, html);
  }

  init(): void {
    this.context.mount.mount();
  }

  destroy(): void {
    this.context.mount.unMount();
  }
}
