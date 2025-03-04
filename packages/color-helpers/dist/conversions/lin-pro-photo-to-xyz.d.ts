import type { Color } from 'types/color';
/**
 * Convert an array of linear-light prophoto-rgb values to CIE XYZ
 * using D50 (so no chromatic adaptation needed afterwards)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export declare function lin_ProPhoto_to_XYZ(rgb: Color): Color;
