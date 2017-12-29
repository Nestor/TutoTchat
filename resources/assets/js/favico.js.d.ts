declare module 'favico.js' {

  export default class {
    constructor (opt?: FavicoJsOptions)
    badge(number: number): void
    badge(number: number, animation: string): void
    badge(number: number, opts: FavicoJsOptions): void
    reset(): void
    image(imageElement: HTMLElement): void
    video(imageElement: HTMLElement): void
    webcam(): void
  }

  interface FavicoJsOptions {
    bgColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontStyle?: string;
    type?: string;
    position?: string;
    animation?: string;
    elementId?: string;
    element?: HTMLElement;
    dataUrl?: (url: string) => any;
  }


}


