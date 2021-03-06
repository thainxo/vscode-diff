//	Imports ____________________________________________________________________

import { DiffFile } from '../../types';

import { DiffResult } from '../output/DiffResult';

import { DiffPanel } from '../panel/DiffPanel';

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export function init (currentDiffPanel:DiffPanel) {
	
	currentDiffPanel.msg.on('delete:files', (data:DiffResult) => currentDiffPanel.delete.showDeleteFilesDialog(data));
	currentDiffPanel.msg.on('delete:left', (data:DiffResult) => currentDiffPanel.delete.showDeleteFileDialog(data, 'left'));
	currentDiffPanel.msg.on('delete:right', (data:DiffResult) => currentDiffPanel.delete.showDeleteFileDialog(data, 'right'));
	
	currentDiffPanel.delete.onDidCancel(() => currentDiffPanel.msg.send('cancel'), null, currentDiffPanel.disposables);
	
	currentDiffPanel.delete.onDidDeleteFile((file:DiffFile) => {
		
		currentDiffPanel.output.log(`Deleted ${file.type} "${file.path}"`);
		
	}, null, currentDiffPanel.disposables);
	
	currentDiffPanel.delete.onDidDeleteFiles((data:DiffResult) => {
		
		currentDiffPanel.msg.send('delete:files', data);
		currentDiffPanel.sendOthers('update:multi', data);
		
	}, null, currentDiffPanel.disposables);
	
}

//	Functions __________________________________________________________________

