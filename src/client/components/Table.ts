export default class Table {
	tableBodyElement: HTMLTableElement;

	constructor(tableBodySelector: string) {
		this.tableBodyElement = document.querySelector(tableBodySelector) as HTMLTableElement;

		if (!this.tableBodyElement) {
			throw new Error(`Table selector ${tableBodySelector} not found!`);
		}
	}

	insertRow(data: any, fields: string[]) {
		const row = document.createElement('tr');

		fields.forEach((field) => {
			for (let key in data) {
				if (field === key) {
					const col = document.createElement('td');
					col.innerText = data[key];
					console.log(key, data[key]);
					row.append(col);
				}
			}
		});

		this.tableBodyElement.prepend(row);
	}
}
