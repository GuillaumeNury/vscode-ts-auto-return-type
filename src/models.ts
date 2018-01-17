import * as ts from 'typescript';

export interface ITsAutoReturnTypeResult {
	allFunctions: IVisitedFunction[];
	matchings: IVisitedFunction[];
	position: number;
}

export interface IVisitedFunction {
	name: string;
	inferredReturnType: string;
	textToInsert: ITextToInsert;
}

export interface IPosition {
	line: number;
	character: number;
}

export interface ITextToInsert {
	position: IPosition;
	text: string;
}

export interface ITsAutoReturnTypeExecution {
	program: ts.Program;
	typeChecker: ts.TypeChecker;
	files: ts.SourceFile[];
	selectedFile: ts.SourceFile;
}

export type FonctionNode =
	| ts.FunctionDeclaration
	| ts.MethodDeclaration;
