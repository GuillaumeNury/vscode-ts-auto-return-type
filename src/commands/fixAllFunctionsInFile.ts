import { baseCommand } from '../utils/base_command';
import { getModificationsForFile } from 'ts-auto-return-type';
import { getConfig } from '../utils/vs-code-utils';

export async function fixAllFunctionsInFile(): Promise<string | void> {
	return baseCommand(editor => {
		const fileName = editor.document.fileName;

		return getModificationsForFile(fileName, getConfig());
	});
}
