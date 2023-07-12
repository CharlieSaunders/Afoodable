export class ApplicationModule {
	name: string;
	value: boolean;
	_id: string;
	displayValue: string;
	moduleName: string;
	constructor(name: string, value: boolean, id: string, displayValue: string, moduleName: string){
		this.name = name;
		this.value = value;
		this._id = id;
		this.displayValue = displayValue;
		this.moduleName = moduleName;
	}
}

export class ApplicationModulesMapper {
	public static map(inputs: any): Array<ApplicationModule> {
		let response = new Array<ApplicationModule>();
		inputs.forEach((entry: any) => {
			if(entry.type != "custom"){
				response.push(new ApplicationModule(entry.name, entry.value, entry._id, entry.displayValue, entry.moduleName));
			}
		})
		return response;
	}

	public static mapSingle(inputs: any): ApplicationModule {
		return new ApplicationModule(inputs.name, inputs.value, inputs._id, inputs.displayValue, inputs.moduleName);
	}
}
