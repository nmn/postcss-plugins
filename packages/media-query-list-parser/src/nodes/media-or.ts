import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent } from './media-in-parens';
import { NodeType } from '../util/node-type';

export class MediaOr {
	type = NodeType.MediaOr;

	modifier: Array<CSSToken>;
	media: MediaInParens;

	constructor(modifier: Array<CSSToken>, media: MediaInParens) {
		this.modifier = modifier;
		this.media = media;
	}

	tokens(): Array<CSSToken> {
		return [
			...this.modifier,
			...this.media.tokens(),
		];
	}

	toString(): string {
		return stringify(...this.modifier) + this.media.toString();
	}

	indexOf(item: MediaInParens): number | string {
		if (item === this.media) {
			return 'media';
		}

		return -1;
	}

	at(index: number | string): MediaInParens | undefined {
		if (index === 'media') {
			return this.media;
		}
	}

	walk(cb: (entry: { node: MediaOrWalkerEntry, parent: MediaOrWalkerParent }, index: number | string) => boolean | void): false | undefined {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}

	toJSON() {
		return {
			type: this.type,
			modifier: this.modifier,
			media: this.media.toJSON(),
		};
	}

	isMediaOr(): this is MediaOr {
		return MediaOr.isMediaOr(this);
	}

	static isMediaOr(x: unknown): x is MediaOr {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaOr)) {
			return false;
		}

		return x.type === NodeType.MediaOr;
	}
}

export type MediaOrWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaOrWalkerParent = MediaInParensWalkerParent | MediaOr;
