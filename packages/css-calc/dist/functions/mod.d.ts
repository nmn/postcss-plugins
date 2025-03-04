import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
export declare function solveMod(modNode: FunctionNode, a: TokenNode, b: TokenNode): Calculation | -1;
