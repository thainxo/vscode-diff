//	Imports ____________________________________________________________________

import * as vscode from 'vscode';

import * as commands from '../common/commands';

import { DiffPanel } from '../panel/DiffPanel';

//	Variables __________________________________________________________________

let updateFiles:string[] = [];
let timeoutId:NodeJS.Timeout = null;

//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export function activate (context:vscode.ExtensionContext) {
	
	commands.register(context, {
		
		'l13Diff.action.panel.open': () => DiffPanel.create(context),
		
		'l13Diff.action.panel.openAndCompare': (left, right, newPanel, openToSide) => {
			
			if (newPanel) DiffPanel.create(context, [left, right], true, openToSide);
			else DiffPanel.createOrShow(context, [left, right], true);
			
		},
		
	});
	
	if (vscode.window.registerWebviewPanelSerializer) {
		
		vscode.window.registerWebviewPanelSerializer(DiffPanel.viewType, {
			
			async deserializeWebviewPanel (webviewPanel:vscode.WebviewPanel) {
				
				DiffPanel.revive(webviewPanel, context);
				
			},
			
		});
	}
	
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(({ fileName }) => {
		
		if (fileName && DiffPanel.currentPanel) {
			if (timeoutId !== null) clearTimeout(timeoutId);
			updateFiles.push(fileName);
			timeoutId = setTimeout(sendUpdateFiles, 200);
		}
		
	}));
	
}

//	Functions __________________________________________________________________

function sendUpdateFiles () {
	
	DiffPanel.sendAll('update:files', { files: updateFiles });
	updateFiles = [];
	timeoutId = null;
	
}