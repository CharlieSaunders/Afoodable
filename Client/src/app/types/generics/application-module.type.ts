export class ApplicationModule {
	name: string;
	value: boolean;
	constructor(name: string, value: boolean){
		this.name = name;
		this.value = value;
	}
}

export class ApplicationModulesMapper {
	public static map(inputs: any): Array<ApplicationModule> {
		let response = new Array<ApplicationModule>();
		inputs.forEach((input: any) => {
			if(input.type != "custom"){

			}
		})
		return response;
	}
}
