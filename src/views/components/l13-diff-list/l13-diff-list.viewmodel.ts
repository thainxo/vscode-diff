//	Imports ____________________________________________________________________

import { Diff, DiffResult, File } from '../../../types';
import { ViewModel } from '../../@l13/component/view-model.abstract';
import { ListFilter } from './l13-diff-list.interface';

import { L13DiffActionsViewModelService } from '../l13-diff-actions/l13-diff-actions.service';
import { L13DiffCompareViewModelService } from '../l13-diff-compare/l13-diff-compare.service';
import { L13DiffInputViewModelService } from '../l13-diff-input/l13-diff-input.service';
import { L13DiffPanelViewModelService } from '../l13-diff-panel/l13-diff-panel.service';
import { L13DiffSwapViewModelService } from '../l13-diff-swap/l13-diff-swap.service';
import { L13DiffViewsViewModelService } from '../l13-diff-views/l13-diff-views.service';

import { vscode } from '../common';

//	Variables __________________________________________________________________

const parse = JSON.parse;
const stringify = JSON.stringify;

const FILTERS = Symbol.for('filters');

const actionsService = new L13DiffActionsViewModelService();
const compareService = new L13DiffCompareViewModelService();
const folderService = new L13DiffInputViewModelService();
const panelService = new L13DiffPanelViewModelService();
const swapService = new L13DiffSwapViewModelService();
const viewsService = new L13DiffViewsViewModelService();

//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export class L13DiffListViewModel extends ViewModel {
	
	private [FILTERS]:ListFilter[] = [];
	
	private map:{ [name:string]:Diff } = {};
	
	public items:Diff[] = [];
	public filteredItems:Diff[] = [];
	
	public data:DiffResult = {
		pathA: '',
		pathB: '',
		total: 0,
		diffs: [],
	};
	
	public disabled:boolean = false;
	
	public disable () :void {
		
		this.disabled = true;
		this.requestUpdate();
		
	}
	
	public enable () :void {
		
		this.disabled = false;
		this.requestUpdate();
		
	}
	
	public constructor () {
		
		super();
		
		window.addEventListener('message', (event) => {
			
			const message = event.data;
			
			switch (message.command) {
				case 'create:diffs':
					enable();
					this.data = message.diffResult;
					this.map = {};
					this.data.diffs.forEach((diff:Diff) => this.map[diff.id] = diff);
					this.items = this.data.diffs;
					this.filter();
					this.dispatchEvent('compared');
					break;
				case 'copy:left':
				case 'copy:right':
					enable();
					const diffs = message.diffResult.diffs;
					diffs.forEach((diff:Diff) => { // Update original diff with new diff
						
						const originalDiff = this.map[diff.id];
						
						this.items.splice(this.items.indexOf(originalDiff), 1, diff);
						this.map[diff.id] = diff;
						
					});
					updateCopiedParentFolders(this.items, diffs);
					this.items = this.items.slice(); // Refreshs the view
					this.dispatchEvent('copied');
					break;
			}
			
		});
		
	}
	
	public getCopyListByIds (ids:string[]) :DiffResult {
		
		const items = ids.map((id) => this.map[id]);
		
		return {
			pathA: this.data.pathA,
			pathB: this.data.pathB,
			total: items.length,
			diffs: items,
		};
		
	}
	
	public getDiffById (id:string) :null|Diff {
		
		return this.map[id] || null;
		
	}
	
	public addFilter (viewmodel:ListFilter) {
		
		this[FILTERS].push(viewmodel);
		
	}
	
	public filter () :void {
		
		let items = this.items;
		
		this[FILTERS].forEach((viewmodel) => items = viewmodel.filter(items));
		
		this.filteredItems = items;
		
		this.requestUpdate();
		
		this.dispatchEvent('filtered');
		
	}
	
	public compare () :void {
		
		disable();
		
		vscode.postMessage({
			command: 'create:diffs',
			pathA: folderService.model('left').value,
			pathB: folderService.model('right').value,
		});
		
	}
	
	public copy (from:'left'|'right', ids:string[]) :void {
		
		vscode.postMessage({
			command: `copy:${from}`,
			diffResult: this.getCopyListByIds(ids),
		});
		
	}
	
}

//	Functions __________________________________________________________________

function enable () {
	
	panelService.model('panel').loading = false;
	
	actionsService.model('actions').enable();
	actionsService.model('actions').disableCopy();
	compareService.model('compare').enable();
	folderService.model('left').enable();
	folderService.model('right').enable();
	swapService.model('swap').enable();
	viewsService.model('views').enable();
	
}

function disable () {
	
	panelService.model('panel').loading = true;
		
	actionsService.model('actions').disable();
	compareService.model('compare').disable();
	folderService.model('left').disable();
	folderService.model('right').disable();
	swapService.model('swap').disable();
	viewsService.model('views').disable();
	
}

function copyDiffFile (diff:Diff, copiedDiff:Diff, from:'A'|'B', to:'A'|'B') :boolean {
	
	const fileFrom = `file${from}`;
	const file:File = (<any>diff)[fileFrom];
	
	if (file && (<any>copiedDiff)[fileFrom].path.startsWith(file.path)) {
		const clone:File = parse(stringify(file));
		const fileTo = `file${to}`;
		clone.folder = (<any>copiedDiff)[fileTo].folder;
		clone.path = clone.folder + clone.path.slice(0, file.folder.length);
		(<any>diff)[fileTo] = clone;
		diff.status = 'unchanged';
		return true;
	}
	
	return false;
	
}

function updateCopiedParentFolders (diffs:Diff[], copiedDiffs:Diff[]) {
	
	diffs.forEach((diff) => {
		
		if (diff.type === 'folder' && (!diff.fileA || !diff.fileB)) {
			
			copiedDiffs.some((copiedDiff:Diff) => {
				
				if (diff.id !== copiedDiff.id && copiedDiff.status === 'unchanged') {
					if (copyDiffFile(diff, copiedDiff, 'A', 'B')) return true;
					if (copyDiffFile(diff, copiedDiff, 'B', 'A')) return true;
				}
				
				return false;
				
			});
		}
		
	});
	
}