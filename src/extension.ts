'use strict';

import * as vscode from 'vscode';

import { fixAllFunctionsInFile } from './commands/fixAllFunctionsInFile';
import { fixPointedFunctions } from './commands/fixPointedFunctions';

export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let registeredCommand1 = vscode.commands.registerCommand(
		'extension.fixPointedFunctions',
		fixPointedFunctions,
	);

	let registeredCommand2 = vscode.commands.registerCommand(
		'extension.fixAllFunctionsInFile',
		fixAllFunctionsInFile,
	);

	context.subscriptions.push(registeredCommand1, registeredCommand2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
