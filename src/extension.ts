'use strict';

import * as vscode from 'vscode';

import {
	getModificationsAtPosition,
	getModificationsForFile,
} from './executions';

import { applyModifications } from './vs-code-utils';

export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let registeredCommand1 = vscode.commands.registerCommand(
		'extension.fixPointedFunctions',
		() => {
			const editor = vscode.window.activeTextEditor;

			if (!editor || editor.document.isUntitled) {
				return;
			}

			const position = editor.selection.start;
			const fileName = editor.document.fileName;

			const editions = getModificationsAtPosition(fileName, position);

			applyModifications(editor, editions);

			if (!editions.length) {
				vscode.window.showInformationMessage(
					'TsAutoReturnType: Noting to do. Check that your cursor is not on a function and that the pointed function has no return type.',
				);
			}
		},
	);

	let registeredCommand2 = vscode.commands.registerCommand(
		'extension.fixAllFunctionsInFile',
		() => {
			const editor = vscode.window.activeTextEditor;

			if (!editor || editor.document.isUntitled) {
				return;
			}

			const fileName = editor.document.fileName;

			const editions = getModificationsForFile(fileName);

			applyModifications(editor, editions);

			if (!editions.length) {
				vscode.window.showInformationMessage(
					'TsAutoReturnType: Noting to do. Check that your cursor is not on a function and that the pointed function has no return type.',
				);
			}
		},
	);

	context.subscriptions.push(registeredCommand1, registeredCommand2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
