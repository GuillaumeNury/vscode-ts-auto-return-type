import * as path from 'path';
import * as ts from 'typescript';

import {
	IPosition,
	ITextToInsert,
	ITsAutoReturnTypeExecution,
} from './models';
import { enrichFunctionNodes, getFunctionNodes } from './parser';
import {
	functionsAtPosition,
	getTextModificationForVisitedFunctions,
} from './utils';

export function startNewExecution(
	fileName: string,
): ITsAutoReturnTypeExecution {
	const normalizedFileName = path.normalize(fileName);

	const program = ts.createProgram([normalizedFileName], {
		target: ts.ScriptTarget.ES2015,
		module: ts.ModuleKind.CommonJS,
	});
	const typeChecker = program.getTypeChecker();

	const files = program
		.getSourceFiles()
		.filter(
			file =>
				file.fileName.indexOf('node_modules') === -1 &&
				!file.isDeclarationFile,
		);

	const [selectedFile] = files.filter(
		file => path.normalize(file.fileName) === normalizedFileName,
	);

	return {
		program,
		typeChecker,
		files,
		selectedFile,
	};
}

export function getModificationsAtPosition(
	fileName: string,
	position: IPosition,
): ITextToInsert[] {
	const { selectedFile, typeChecker } = startNewExecution(fileName);

	const functionNodes = getFunctionNodes(selectedFile);
	const matchingNodes = functionsAtPosition(
		selectedFile,
		functionNodes,
		position,
	);

	const enriched = enrichFunctionNodes(
		selectedFile,
		matchingNodes,
		typeChecker,
	);

	return getTextModificationForVisitedFunctions(enriched);
}

export function getModificationsForFile(
	fileName: string,
): ITextToInsert[] {
	const { selectedFile, typeChecker } = startNewExecution(fileName);

	const functionNodes = getFunctionNodes(selectedFile);

	const enriched = enrichFunctionNodes(
		selectedFile,
		functionNodes,
		typeChecker,
	);

	return getTextModificationForVisitedFunctions(enriched);
}
