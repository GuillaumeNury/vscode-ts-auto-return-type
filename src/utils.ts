import * as ts from 'typescript';

import {
	FonctionNode,
	IPosition,
	ITextToInsert,
	IVisitedFunction,
} from './models';

export function isFunctionNode(
	node: ts.Node,
): node is ts.FunctionDeclaration | ts.MethodDeclaration {
	return (
		ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)
	);
}

export function functionsAtPosition(
	file: ts.SourceFile,
	nodes: FonctionNode[],
	_position: IPosition,
): FonctionNode[] {
	const position = lineAndCharacterToPosition(file, _position);

	return nodes.filter(
		node => position >= node.getStart() && position <= node.getEnd(),
	);
}

export function positionToLineAndCharacter(
	file: ts.SourceFile,
	position: number,
): IPosition {
	return file.getLineAndCharacterOfPosition(position);
}

export function lineAndCharacterToPosition(
	file: ts.SourceFile,
	{ line, character }: IPosition,
): number {
	return file.getPositionOfLineAndCharacter(line, character);
}

export function getTextModificationForVisitedFunctions(
	functions: IVisitedFunction[],
): ITextToInsert[] {
	return functions.reduce(
		(acc, func) => {
			if (func.textToInsert) {
				acc.push(func.textToInsert);
			}

			return acc;
		},
		[] as ITextToInsert[],
	);
}
