interface ResponderOptions {
	onJson: () => void;
	onOther: () => void;
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
		if (this.isJson()) {
			return this.responderOptions.onJson();
		}

		return this.responderOptions.onOther();
	}
}
