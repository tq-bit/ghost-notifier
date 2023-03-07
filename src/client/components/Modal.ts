export default class Modal {
  modalElement: HTMLElement;
  modalCloseButton: HTMLElement;
  modalBackground: HTMLElement;

  constructor(modalSelector: string) {
    this.modalElement = document.querySelector(modalSelector) as HTMLElement;
    this.modalCloseButton = this.modalElement.querySelector(
      '.modal-close',
    ) as HTMLElement;
    this.modalBackground = this.modalElement.querySelector(
      '.modal-background',
    ) as HTMLElement;

    if (!this.modalElement) {
      throw new Error(`Modal selector ${modalSelector} not found!`);
    }
    if (!this.modalCloseButton) {
      throw new Error(
        `Modal selector ${modalSelector} has no close button with class 'modal-close'!`,
      );
    }
    if (!this.modalBackground) {
      throw new Error(
        `Modal selector ${modalSelector} has no close button with class 'modal-close'!`,
      );
    }

    this.registerOnClickCloseButton();
  }

  private registerOnClickCloseButton() {
    this.modalCloseButton.addEventListener('click', () => this.hide());
    this.modalBackground.addEventListener('click', () => this.hide());
  }

  public show() {
    this.modalElement.classList.add('is-active');
  }

  public hide() {
    this.modalElement.classList.remove('is-active');
  }
}
