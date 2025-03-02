import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data, serialize_P3_data } from '../util/serialize.mjs';

const tests = [
	['lab(40% 56.6 39)', 'rgb(179, 35, 35)', 'color(display-p3 0.64331 0.19245 0.16771)'],
	['lab(40% 56.6 39 / 1)', 'rgb(179, 35, 35)', 'color(display-p3 0.64331 0.19245 0.16771)'],
	['lab(40% 56.6 39 / .5)', 'rgba(179, 35, 35, 0.5)', 'color(display-p3 0.64331 0.19245 0.16771 / 0.5)'],
	['lab(40% 56.6 39 / 100%)', 'rgb(179, 35, 35)', 'color(display-p3 0.64331 0.19245 0.16771)'],
	['lab(40% 56.6 39 / 50%)', 'rgba(179, 35, 35, 0.5)', 'color(display-p3 0.64331 0.19245 0.16771 / 0.5)'],
	['lab(60% 50 0)', 'rgb(222, 105, 147)', 'color(display-p3 0.81388 0.43646 0.57322)'],
	['lab(40% 35% 30%)', 'rgb(163, 57, 35)', 'color(display-p3 0.59266 0.25309 0.17075)'],

	['lab(0 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(0 0 0 / 1)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(0 0 0 / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['lab(20 0 10/0.5)', 'rgba(52, 48, 34, 0.5)', 'color(display-p3 0.20256 0.18882 0.13828 / 0.5)'],
	['lab(20 0 10/50%)', 'rgba(52, 48, 34, 0.5)', 'color(display-p3 0.20256 0.18882 0.13828 / 0.5)'],
	['lab(400 0 10/50%)', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['lab(100 0 10/50%)', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['lab(50 -160 160)', 'rgb(0, 134, 16)', 'color(display-p3 0 0.53919 0)'],
	['lab(50 -200 200)', 'rgb(50, 128, 0)', 'color(display-p3 0.25694 0.50249 0)'],
	['lab(0 0 0 / -10%)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['lab(0 0 0 / 110%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(0 0 0 / 300%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(-40 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(50 -20 0)', 'rgb(77, 129, 118)', 'color(display-p3 0.34973 0.49949 0.46434)'],
	['lab(50 0 -20)', 'rgb(104, 120, 153)', 'color(display-p3 0.41876 0.46812 0.58845)'],
	['lab(calc(50 * 3) calc(0.5 - 1) calc(1.5) / calc(-0.5 + 1))', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['lab(calc(50 / 3) calc(0.5 - 1) calc(1.5) / calc(-0.5 + 1))', 'rgba(41, 41, 39, 0.5)', 'color(display-p3 0.16151 0.16211 0.15382 / 0.5)'],
	['lab(calc(-50 * 3) calc(0.5 + 1) calc(-1.5) / calc(-0.5 * 2))', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['lab(none none none / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['lab(none none none)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lab(20 none none / none)', 'rgba(48, 48, 48, 0)', 'color(display-p3 0.18938 0.18938 0.18938 / 0)'],
	['lab(none none none / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['lab(0 0 0 / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['oklab(0 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0 0 0 / 1)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0 0 0 / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['oklab(0.2 0 0.1/0.5)', 'rgba(32, 20, 0, 0.5)', 'color(display-p3 0.12305 0.07772 0 / 0.5)'],
	['oklab(0.2 0 0.1/50%)', 'rgba(32, 20, 0, 0.5)', 'color(display-p3 0.12305 0.07772 0 / 0.5)'],
	['oklab(4 0 0.1/50%)', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['oklab(0.5 -1.6 1.6)', 'rgb(48, 118, 0)', 'color(display-p3 0.24068 0.46594 0)'],
	['oklab(0.5 -2 2)', 'rgb(48, 118, 0)', 'color(display-p3 0.24073 0.46592 0)'],
	['oklab(0 0 0 / -10%)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['oklab(0 0 0 / 110%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0 0 0 / 300%)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(-0.4 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0.5 -0.2 0)', 'rgb(0, 119, 102)', 'color(display-p3 0 0.47537 0.4034)'],
	['oklab(0.5 0 -0.2)', 'rgb(59, 81, 211)', 'color(display-p3 0.24856 0.31486 0.7965)'],
	['oklab(calc(0.5 * 3) calc(0.5 - 1) calc(1.5) / calc(-0.5 + 1))', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['oklab(calc(-0.5 * 3) calc(0.5 + 1) calc(-1.5) / calc(-0.5 * 2))', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['oklab(none none none / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['oklab(none none none)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklab(0.2 none none / none)', 'rgba(22, 22, 22, 0)', 'color(display-p3 0.0861 0.0861 0.0861 / 0)'],
	['oklab(none none none / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['oklab(0 0 0 / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['lab(20 -62.5 112.5 / 0.5)', 'rgba(35, 50, 0, 0.5)', 'color(display-p3 0.14663 0.19586 0 / 0.5)'],
	['lab(20% -50% 90%/0.5)', 'rgba(35, 50, 0, 0.5)', 'color(display-p3 0.14663 0.19586 0 / 0.5)'],
	['oklab(0.2 0.28 -0.32 / 0.5)', 'rgba(39, 0, 61, 0.5)', 'color(display-p3 0.13803 0 0.23544 / 0.5)'],
	['oklab(20% 70% -80%/0.5)', 'rgba(39, 0, 61, 0.5)', 'color(display-p3 0.13803 0 0.23544 / 0.5)'],

	['lch(0 0 0deg)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lch(0 0 0deg / 1)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lch(0 0 0deg / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['lch(100 230 0deg / 0.5)', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['lch(20 50 20deg/0.5)', 'rgba(107, 0, 27, 0.5)', 'color(display-p3 0.38092 0.00312 0.11269 / 0.5)'],
	['lch(20 50 20deg/50%)', 'rgba(107, 0, 27, 0.5)', 'color(display-p3 0.38092 0.00312 0.11269 / 0.5)'],
	['lch(10 20 20deg / -10%)', 'rgba(51, 15, 19, 0)', 'color(display-p3 0.18359 0.06826 0.0765 / 0)'],
	['lch(10 20 20deg / 110%)', 'rgb(51, 15, 19)', 'color(display-p3 0.18359 0.06826 0.0765)'],
	['lch(10 20 1.28rad)', 'rgb(40, 24, 0)', 'color(display-p3 0.14986 0.09736 0)'],
	['lch(10 20 380deg)', 'rgb(51, 15, 19)', 'color(display-p3 0.18359 0.06826 0.0765)'],
	['lch(10 20 -340deg)', 'rgb(51, 15, 19)', 'color(display-p3 0.18359 0.06826 0.0765)'],
	['lch(10 20 740deg)', 'rgb(51, 15, 19)', 'color(display-p3 0.18359 0.06826 0.0765)'],
	['lch(10 20 -700deg)', 'rgb(51, 15, 19)', 'color(display-p3 0.18359 0.06826 0.0765)'],
	['lch(-40 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lch(20 -20 0)', 'rgb(0, 56, 48)', 'color(display-p3 0.07361 0.21544 0.18776)'],
	['lch(0 0 0 / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['lch(10 20 20 / 110%)', 'rgb(51, 15, 19)', 'color(display-p3 0.18359 0.06826 0.0765)'],
	['lch(10 20 -700)', 'rgb(51, 15, 19)', 'color(display-p3 0.18359 0.06826 0.0765)'],
	['lch(calc(50 * 3) calc(0.5 - 1) calc(20deg * 2) / calc(-0.5 + 1))', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['lch(calc(-50 * 3) calc(0.5 + 1) calc(-20deg * 2) / calc(-0.5 * 2))', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['lch(none none none / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['lch(none none none)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['lch(20 none none / none)', 'rgba(48, 48, 48, 0)', 'color(display-p3 0.18938 0.18938 0.18938 / 0)'],
	['lch(none none none / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['lch(0 0 0 / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['oklch(0 0 0deg)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklch(0 0 0deg / 1)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklch(0 0 0deg / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['oklch(1 2.3 0deg / 0.5)', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['oklch(0.2 0.5 20deg/0.5)', 'rgba(55, 0, 3, 0.5)', 'color(display-p3 0.2031 0 0.00893 / 0.5)'],
	['oklch(0.2 0.5 20deg/50%)', 'rgba(55, 0, 3, 0.5)', 'color(display-p3 0.2031 0 0.00893 / 0.5)'],
	['oklch(0.1 0.2 20deg / -10%)', 'rgba(17, 0, 0, 0)', 'color(display-p3 0.06116 0 0 / 0)'],
	['oklch(0.1 0.2 20deg / 110%)', 'rgb(17, 0, 0)', 'color(display-p3 0.06116 0 0)'],
	['oklch(0.1 0.2 1.28rad)', 'rgb(10, 2, 0)', 'color(display-p3 0.03405 0.0064 0)'],
	['oklch(0.1 0.2 380deg)', 'rgb(17, 0, 0)', 'color(display-p3 0.06116 0 0)'],
	['oklch(0.1 0.2 -340deg)', 'rgb(17, 0, 0)', 'color(display-p3 0.06116 0 0)'],
	['oklch(0.1 0.2 740deg)', 'rgb(17, 0, 0)', 'color(display-p3 0.06116 0 0)'],
	['oklch(0.1 0.2 -700deg)', 'rgb(17, 0, 0)', 'color(display-p3 0.06116 0 0)'],
	['oklch(-0.4 0 0)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklch(0.2 -0.2 0)', 'rgb(0, 30, 23)', 'color(display-p3 0 0.11866 0.09185)'],
	['oklch(0 0 0 / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['oklch(0.1 0.2 20 / 110%)', 'rgb(17, 0, 0)', 'color(display-p3 0.06116 0 0)'],
	['oklch(0.1 0.2 -700)', 'rgb(17, 0, 0)', 'color(display-p3 0.06116 0 0)'],
	['oklch(calc(0.5 * 3) calc(0.5 - 1) calc(20deg * 2) / calc(-0.5 + 1))', 'rgba(255, 255, 255, 0.5)', 'color(display-p3 1 1 1 / 0.5)'],
	['oklch(calc(-0.5 * 3) calc(0.5 + 1) calc(-20deg * 2) / calc(-0.5 * 2))', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['oklch(none none none / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],
	['oklch(none none none)', 'rgb(0, 0, 0)', 'color(display-p3 0 0 0)'],
	['oklch(0.2 none none / none)', 'rgba(22, 22, 22, 0)', 'color(display-p3 0.0861 0.0861 0.0861 / 0)'],
	['oklch(none none none / 0.5)', 'rgba(0, 0, 0, 0.5)', 'color(display-p3 0 0 0 / 0.5)'],
	['oklch(0 0 0 / none)', 'rgba(0, 0, 0, 0)', 'color(display-p3 0 0 0 / 0)'],

	['lch(20 120 10 / 0.5)', 'rgba(118, 0, 48, 0.5)', 'color(display-p3 0.43858 0 0.18219 / 0.5)'],
	['lch(20% 80% 10/0.5)', 'rgba(118, 0, 48, 0.5)', 'color(display-p3 0.43858 0 0.18219 / 0.5)'],
	['oklch(0.2 0.24 10 / 0.5)', 'rgba(54, 0, 11, 0.5)', 'color(display-p3 0.19929 0 0.04185 / 0.5)'],
	['oklch(20% 60% 10/0.5)', 'rgba(54, 0, 11, 0.5)', 'color(display-p3 0.19929 0 0.04185 / 0.5)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);

	assert.deepStrictEqual(
		serialize_P3_data(color(parse(test[0]))),
		test[2],
		`"${test[0]}" : ${test[2]}`,
	);
}
