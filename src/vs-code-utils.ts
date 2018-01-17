import * as vscode from 'vscode';

import { ITextToInsert } from './models';

export function applyModifications(
	editor: vscode.TextEditor,
	editions: ITextToInsert[],
): void {
	if (editions.length) {
		editor.edit(mutator => {
			for (const edition of editions) {
				const { line, character } = edition.position;

				const position = new vscode.Position(line, character);

				mutator.insert(position, edition.text);
			}
		});
	}
}
