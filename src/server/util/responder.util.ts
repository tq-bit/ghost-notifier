interface ResponderOptions {
	onJson: () => void;
	onOther: () => void;
	onError: (error: unknown) => void;
}

export default class Responder {
	contentType: string;
	responderOptions: ResponderOptions;
	constructor(contentType: string, responderOptions: ResponderOptions) {
		this.contentType = contentType;
		this.responderOptions = responderOptions;
	}

	private isJson() {
		return this.contentType.includes('json');
	}

	public send() {
		try {
			if (this.isJson()) {
				return this.responderOptions.onJson();
			}

			return this.responderOptions.onOther();
		} catch (error) {
			return this.responderOptions.onError(error);
		}
	}
}
