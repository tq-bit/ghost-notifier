type LifecycleOptions = {
  onDomReady?: () => void;
  onPageReady?: () => void;
  onPageUnload?: () => void;
};

export default class Lifecycle {
  isDomReady = false;
  isPageReady = false;

  constructor({ onDomReady, onPageReady, onPageUnload }: LifecycleOptions) {
    if (onDomReady) {
      this.handleDomReady(onDomReady);
    }

    if (onPageReady) {
      this.handlePageReady(onPageReady);
    }

    if (onPageUnload) {
      this.handlePageUnload(onPageUnload);
    }
  }

  private handleDomReady(cb: () => void) {
    document.addEventListener('DOMContentLoaded', () => {
      cb();
      this.isDomReady = true;
    });
  }

  private handlePageReady(cb: () => void) {
    window.onload = () => {
      cb();
      this.isPageReady = true;
    };
  }

  private handlePageUnload(cb: () => void) {
    window.onbeforeunload = () => {
      cb();
    };
  }
}
