import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import { FunctionNode, isTokenNode } from '@csstools/css-parser-algorithms';
import { ColorNotation } from '../color-notation';
import { SyntaxFlag } from '../color-data';
import { normalize_legacy_sRGB_ChannelValues, normalize_modern_sRGB_ChannelValues } from './rgb-normalize-channel-values';
import { threeChannelLegacySyntax } from './three-channel-legacy-syntax';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';
import { TokenType } from '@csstools/css-tokenizer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function rgb(rgbNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	if (rgbNode.value.some((x) => isTokenNode(x) && x.value[0] === TokenType.Comma)) {
		const output = rgbCommaSeparated(rgbNode);
		if (output !== false) {
			return output;
		}
	} else {
		const output = rgbSpaceSeparated(rgbNode);
		if (output !== false) {
			return output;
		}
	}

	return false;
}

function rgbCommaSeparated(rgbNode: FunctionNode): ColorData | false {
	return threeChannelLegacySyntax(
		rgbNode,
		normalize_legacy_sRGB_ChannelValues,
		ColorNotation.RGB,
		[
			SyntaxFlag.LegacyRGB,
		],
	);
}

function rgbSpaceSeparated(rgbNode: FunctionNode): ColorData | false {
	return threeChannelSpaceSeparated(
		rgbNode,
		normalize_modern_sRGB_ChannelValues,
		ColorNotation.RGB,
		[],
	);
}
