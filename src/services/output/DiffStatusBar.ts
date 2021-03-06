//	Imports ____________________________________________________________________

import * as vscode from 'vscode';

import { remove } from '../../@l13/arrays';

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export class DiffStatusBar {
	
	private static statusBarItem:vscode.StatusBarItem|undefined;
	
	public static currentStatusBar:DiffStatusBar|undefined;
	
	private static activeStatusBars:DiffStatusBar[] = [];
	
	private currentText = '';
	
	public constructor (context:vscode.ExtensionContext) {
		
		if (!DiffStatusBar.statusBarItem) {
			DiffStatusBar.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			DiffStatusBar.statusBarItem.command = 'l13Diff.action.output.show';
			DiffStatusBar.statusBarItem.tooltip = 'Diff Folders Output';
			DiffStatusBar.statusBarItem.show();
			context.subscriptions.push(DiffStatusBar.statusBarItem);
		}
		
		DiffStatusBar.currentStatusBar = this;
		DiffStatusBar.activeStatusBars.push(this);
		
		this.update();
		
	}
	
	public activate () {
		
		if (DiffStatusBar.currentStatusBar !== this) {
			DiffStatusBar.currentStatusBar = this;
			DiffStatusBar.statusBarItem.text = this.currentText;
		}
		
	}
	
	public update (text:string = '') :void {
		
		this.currentText = '$(file-submodule) ' + (text || 'Diff Folders');
		
		if (DiffStatusBar.currentStatusBar === this) DiffStatusBar.statusBarItem.text = this.currentText;
		
	}
	
	public dispose () :void {
		
		remove(DiffStatusBar.activeStatusBars, this);
		
		if (!DiffStatusBar.activeStatusBars.length && DiffStatusBar.statusBarItem) {
			DiffStatusBar.statusBarItem.dispose();
			DiffStatusBar.statusBarItem = undefined;
		}
		
	}
	
}

//	Functions __________________________________________________________________

