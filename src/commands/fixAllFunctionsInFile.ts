import { baseCommand } from '../utils/base_command';
import { getModificationsForFile } from 'ts-auto-return-type';

export async function fixAllFunctionsInFile(): Promise<string | void> {
	return baseCommand(editor => {
		const fileName = editor.document.fileName;

		return getModificationsForFile(fileName);
	});
}
