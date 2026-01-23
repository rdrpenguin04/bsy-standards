export type ConfigRaw = {
	lowPin: number;
	president: number;
	recsec: number;
	allowed: number[];
	secret: string;
	motd: string;
};

export class Config {
	lowPin: number = $state(0);
	president: number = $state(0);
	recsec: number = $state(0);
	allowed: number[] = $state([]);
	secret: string = $state('');
	motd: string = $state('');

	constructor(
		lowPin: number,
		president: number,
		recsec: number,
		allowed: number[],
		secret: string,
		motd: string
	) {
		this.lowPin = lowPin;
		this.president = president;
		this.recsec = recsec;
		this.allowed = allowed;
		this.secret = secret;
		this.motd = motd;
	}

	jsonify(): ConfigRaw {
		return {
			lowPin: this.lowPin,
			president: this.president,
			recsec: this.recsec,
			allowed: this.allowed,
			secret: this.secret,
			motd: this.motd
		};
	}
}

export const BLANK_CONFIG: Config = new Config(0, 0, 0, [], '', '');

export async function loadConfig(): Promise<Config> {
	let configJSON: ConfigRaw = JSON.parse(await (await fetch('/config')).json());
	let config = new Config(
		configJSON.lowPin,
		configJSON.president,
		configJSON.recsec,
		configJSON.allowed,
		configJSON.secret,
		configJSON.motd
	);
	return config;
}
