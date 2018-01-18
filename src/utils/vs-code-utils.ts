import * as vscode from 'vscode';

import { ITextToInsert } from 'ts-auto-return-type';

export async function applyModifications(
	editor: vscode.TextEditor,
	editions: ITextToInsert[],
): Promise<boolean> {
	if (editions.length) {
		return editor.edit(mutator => {
			for (const edition of editions) {
				const { line, character } = edition.position;

				const position = new vscode.Position(line, character);

				mutator.insert(position, edition.text);
			}
		});
	}
}
