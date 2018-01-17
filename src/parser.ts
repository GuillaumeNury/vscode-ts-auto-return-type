import * as ts from 'typescript';

import {
	FonctionNode,
	ITextToInsert,
	IVisitedFunction,
} from './models';
import { isFunctionNode, positionToLineAndCharacter } from './utils';

export function enrichFunctionNodes(
	file: ts.SourceFile,
	nodes: FonctionNode[],
	typeChecker: ts.TypeChecker,
): IVisitedFunction[] {
	return nodes.reduce(
		(acc, node) => [
			...acc,
			...enrichFunctionNode(file, node, typeChecker),
		],
		[] as IVisitedFunction[],
	);
}

export function enrichFunctionNode(
	file: ts.SourceFile,
	node: FonctionNode,
	typeChecker: ts.TypeChecker,
): IVisitedFunction[] {
	const symbol = typeChecker.getSymbolAtLocation(
		node.name as any, // Hack: it do not work with just "node"
	);

	if (symbol !== undefined) {
		const typeOfFunction = typeChecker.getTypeOfSymbolAtLocation(
			symbol,
			node,
		);

		return typeOfFunction.getCallSignatures().map(signature => {
			const type = signature.getReturnType();
			const typeAsString = typeChecker.typeToString(type);

			const textToInsert = getTextToInsert(file, node, typeAsString);

			return {
				name: symbol.name,
				inferredReturnType: typeAsString,
				textToInsert,
			};
		});
	}
}

export function getFunctionNodes(node: ts.Node): FonctionNode[] {
	return node.getChildren().reduce(
		(acc, child) => {
			if (isFunctionNode(child)) {
				acc.push(child);
			}

			return [...acc, ...getFunctionNodes(child)];
		},
		[] as FonctionNode[],
	);
}

function getTextToInsert(
	file: ts.SourceFile,
	node: FonctionNode,
	type: string,
): ITextToInsert {
	let parenthesisPosition = -1;
	let colonPosition = -1;

	node.getChildren().forEach(child => {
		if (child.kind === ts.SyntaxKind.CloseParenToken) {
			parenthesisPosition = child.getEnd();
		}

		// Find a ":" after a ")"
		if (
			parenthesisPosition >= 0 &&
			child.kind === ts.SyntaxKind.ColonToken
		) {
			colonPosition = child.getEnd();
		}
	});

	// if colonPosition >= 0, it means that here is already a return type
	const noInsertion = parenthesisPosition === -1 || colonPosition >= 0;

	if (noInsertion) {
		return null;
	}

	const text = `: ${type}`;
	const position = positionToLineAndCharacter(
		file,
		parenthesisPosition,
	);

	return parenthesisPosition >= 0 ? { position, text } : null;
}
