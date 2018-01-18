import * as vscode from 'vscode';

import { ITextToInsert } from 'ts-auto-return-type';
import { applyModifications } from './vs-code-utils';

export async function baseCommand(
	modificationGetter: (editor: vscode.TextEditor) => ITextToInsert[],
): Promise<string | void> {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return vscode.window.showErrorMessage(
			'TsAutoReturnType: VSCode is not ready at the moment, retry later.',
		);
	}
	if (editor.document.isUntitled || editor.document.isDirty) {
		return vscode.window.showErrorMessage(
			'TsAutoReturnType use saved file version in order to make static analysis. Save your file and try again.',
		);
	}

	const editions = modificationGetter(editor);

	try {
		await applyModifications(editor, editions);
	} catch (e) {
		return vscode.window.showErrorMessage(
			'TsAutoReturnType: An error occured :( : ' + e.message,
		);
	}
}
