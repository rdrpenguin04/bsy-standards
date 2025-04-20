import { goto } from '$app/navigation';

export type PolicyRaw = { name: string; favor: number; against: number; vote: number };

export class Policy {
	name: string;
	favor = $state(0);
	against = $state(0);
	private _vote: number = $state(0);

	constructor(name: string, favor: number, against: number, vote?: number) {
		this.name = name;
		this.favor = favor;
		this.against = against;
		this._vote = vote || 0;
	}

	get vote(): number {
		return this._vote;
	}

	set vote(vote: number) {
		if (vote != this._vote) {
			if (this._vote == -1) {
				this.against -= 1; // undo
			} else if (this._vote == 1) {
				this.favor -= 1; // undo
			}
			this._vote = vote;
			if (this._vote == -1) {
				this.against += 1;
			} else if (this._vote == 1) {
				this.favor += 1;
			}
			fetch('/castVote', {
				method: 'POST',
				body: JSON.stringify({ name: this.name, vote: this._vote }),
				headers: {
					'content-type': 'application/json'
				}
			}).then((response) => {
				if (response.status != 200) {
					// panic; everything has gone horribly wrong
					goto('/logout');
				}
			});
		}
	}

	get percent(): number {
		return this.favor / (this.favor + this.against);
	}
}

export async function loadPolicies(): Promise<Policy[]> {
	let policiesJSON: PolicyRaw[] = await (await fetch('/policies')).json();
	let policies = policiesJSON.map((x) => new Policy(x.name, x.favor, x.against, x.vote));
	return policies;
}
