import type { ColorData } from '../color-data';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenType } from '@csstools/css-tokenizer';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { calcFromComponentValues } from '@csstools/css-calc';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { normalizeChannelValuesFn } from './normalize-channel-values';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { mathFunctionNames } from '@csstools/css-calc';

export function threeChannelSpaceSeparated(
	colorFunctionNode: FunctionNode,
	normalizeChannelValues: normalizeChannelValuesFn,
	colorNotation: ColorNotation,
	syntaxFlags: Array<SyntaxFlag>,
): ColorData | false {
	const channel1: Array<ComponentValue> = [];
	const channel2: Array<ComponentValue> = [];
	const channel3: Array<ComponentValue> = [];
	const channelAlpha: Array<ComponentValue> = [];

	const colorData: ColorData = {
		colorNotation: colorNotation,
		channels: [0, 0, 0],
		alpha: 1,
		syntaxFlags: (new Set(syntaxFlags)),
	};

	let focus = channel1;
	for (let i = 0; i < colorFunctionNode.value.length; i++) {
		let node = colorFunctionNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			// consume as much whitespace as possible
			while (isWhitespaceNode(colorFunctionNode.value[i + 1]) || isCommentNode(colorFunctionNode.value[i + 1])) {
				i++;
			}

			if (!channel1.length) {
				continue;
			}

			if (focus === channel1) {
				focus = channel2;
				continue;
			}

			if (focus === channel2) {
				focus = channel3;
				continue;
			}

			continue;
		}

		if (isTokenNode(node) && node.value[0] === TokenType.Delim && node.value[4].value === '/') {
			if (focus === channelAlpha) {
				return false;
			}

			focus = channelAlpha;
			continue;
		}

		if (isFunctionNode(node)) {
			if (focus === channelAlpha && toLowerCaseAZ(node.getName()) === 'var') {
				colorData.syntaxFlags.add(SyntaxFlag.HasVariableAlpha);
				focus.push(node);
				continue;
			}

			if (!mathFunctionNames.has(toLowerCaseAZ(node.getName()))) {
				return false;
			}

			const [[result]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });
			if (
				!result ||
				!isTokenNode(result) ||
				(
					(
						result.value[0] === TokenType.Percentage ||
						result.value[0] === TokenType.Number ||
						result.value[0] === TokenType.Dimension
					) &&
					Number.isNaN(result.value[4].value)
				)
			) {
				return false;
			}

			node = result;
		}

		if (isTokenNode(node)) {
			focus.push(node);
			continue;
		}

		return false;
	}

	if (focus.length !== 1) {
		return false;
	}

	if (
		channel1.length !== 1 ||
		channel2.length !== 1 ||
		channel3.length !== 1
	) {
		return false;
	}

	if (
		!isTokenNode(channel1[0]) ||
		!isTokenNode(channel2[0]) ||
		!isTokenNode(channel3[0])
	) {
		return false;
	}

	const channelValues: Array<CSSToken> = [
		channel1[0].value,
		channel2[0].value,
		channel3[0].value,
	];

	if (channelAlpha.length === 1) {
		colorData.syntaxFlags.add(SyntaxFlag.HasAlpha);

		if (isTokenNode(channelAlpha[0])) {
			channelValues.push(channelAlpha[0].value);
		} else {
			colorData.alpha = channelAlpha[0];
		}
	}

	const normalizedChannelValues = normalizeChannelValues(channelValues, colorData);
	if (normalizedChannelValues === false) {
		return false;
	}

	colorData.channels = [
		normalizedChannelValues[0][4].value,
		normalizedChannelValues[1][4].value,
		normalizedChannelValues[2][4].value,
	];

	if (normalizedChannelValues.length === 4) {
		colorData.alpha = normalizedChannelValues[3][4].value;
	}

	return colorData;
}
