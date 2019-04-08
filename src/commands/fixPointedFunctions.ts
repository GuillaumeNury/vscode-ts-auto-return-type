import { baseCommand } from '../utils/base_command';
import { getModificationsAtPosition } from 'ts-auto-return-type';
import { getConfig } from '../utils/vs-code-utils';

export async function fixPointedFunctions(): Promise<string | void> {
	return baseCommand(editor => {
		const position = editor.selection.start;
		const fileName = editor.document.fileName;

		return getModificationsAtPosition(fileName, position, getConfig());
	});
}
