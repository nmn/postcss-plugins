export const convert_q: Map<string, (number: number) => number> = new Map([
	[
		'cm',
		(x: number) => {
			return (x / 4) / 10;
		},
	],
	[
		'mm',
		(x: number) => {
			return x / 4;
		},
	],
	[
		'q',
		(x: number) => {
			return x;
		},
	],
	[
		'in',
		(x: number) => {
			return (x / 4) / 25.4;
		},
	],
	[
		'pc',
		(x: number) => {
			return ((x / 4) / 25.4) * 6;
		},
	],
	[
		'pt',
		(x: number) => {
			return ((x / 4) / 25.4) * 72;
		},
	],
	[
		'px',
		(x: number) => {
			return ((x / 4) / 25.4) * 96;
		},
	],
]);
