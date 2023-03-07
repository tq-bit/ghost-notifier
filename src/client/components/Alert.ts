type AlertType = 'success' | 'error' | 'warning';

type AlertOptions = {
  type: AlertType;
  title: string;
  text: string;
};

export default class Alert {
  alertElement: HTMLElement;
  alertTypeMap: Record<string, string>;

  title: HTMLElement;
  message: HTMLElement;

  constructor(alertSelector: string) {
    this.alertElement = document.querySelector(alertSelector) as HTMLElement;

    if (!this.alertElement) {
      throw new Error(`Element with ID ${alertSelector} does not exist`);
    }

    this.title = this.alertElement.querySelector(
      '.message-header p',
    ) as HTMLElement;
    this.message = this.alertElement.querySelector(
      '.message-body p',
    ) as HTMLElement;

    if (!this.title || !this.message) {
      throw new Error('Alert has no header or text section');
    }
    this.alertTypeMap = {
      success: 'is-success',
      error: 'is-danger',
      warning: 'is-warning',
    };
  }

  public setByUrl(): void {
    const query = new URLSearchParams(location.search);
    const status = query.get('status') as AlertType;

    if (status) {
      const message = query.get('message') as string;
      const title = `${status.charAt(0).toUpperCase()}${status.substring(
        1,
        status.length,
      )}!`;
      return this.set({ type: status, title: title, text: message }).show();
    }
  }

  public set({ type, title, text }: AlertOptions) {
    this.alertElement.classList.add(this.alertTypeMap[type]);
    this.title.innerText = title;
    this.message.innerText = text;
    return this;
  }

  public unset() {
    this.hide();
    for (const key in this.alertTypeMap) {
      this.alertElement.classList.remove(this.alertTypeMap[key]);
    }
    return this;
  }

  public show() {
    this.alertElement.classList.remove('is-hidden');
  }

  public hide() {
    this.alertElement.classList.add('is-hidden');
  }
}
