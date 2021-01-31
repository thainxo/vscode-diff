//	Imports ____________________________________________________________________

import { DiffFile } from '../../../types';

import { L13Class, L13Component, L13Element, L13Query } from '../../@l13/core';

import { L13DiffSearchViewModelService } from './l13-diff-search.service';
import { L13DiffSearchViewModel } from './l13-diff-search.viewmodel';

import { msg, parseIcons, setLabel } from '../common';
import styles from '../styles';
import templates from '../templates';

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

@L13Component({
	name: 'l13-diff-search',
	service: L13DiffSearchViewModelService,
	styles: [parseIcons(styles['l13-diff-search/l13-diff-search.css'])],
	template: templates['l13-diff-search/l13-diff-search.html'],
})
export class L13DiffSearchComponent extends L13Element<L13DiffSearchViewModel> {
	
	@L13Query('#l13_resizer')
	private resizer:HTMLElement;
	
	@L13Query('#l13_searchterm')
	@L13Class({ '-error': 'error' })
	private inputSearchterm:HTMLInputElement;
	
	@L13Query('#l13_case_sensitive')
	private inputCaseSensitive:HTMLInputElement;
	
	@L13Query('#l13_use_regexp')
	private inputRegExp:HTMLInputElement;
	
	@L13Query('#l13_use_files')
	private inputFiles:HTMLInputElement;
	
	@L13Query('#l13_use_folders')
	private inputFolders:HTMLInputElement;
	
	@L13Query('#l13_use_symlinks')
	private inputSymlinks:HTMLInputElement;
	
	@L13Query('#l13_use_conflicts')
	private inputConflicts:HTMLInputElement;
	
	@L13Query('#l13_use_others')
	private inputOthers:HTMLInputElement;
	
	@L13Query('button')
	private button:HTMLButtonElement;
		
	private right:number = 0;
	
	private resizerOffsetX:number = 0;
	
	public focused:boolean = false;
	
	public constructor () {
		
		super();
		
		setLabel(this.inputCaseSensitive, 'Match Case');
		setLabel(this.inputRegExp, 'Use Regular Expression');
		setLabel(this.inputFiles, 'Show Files');
		setLabel(this.inputFolders, 'Show Folders');
		setLabel(this.inputSymlinks, 'Show Symbolic Links');
		setLabel(this.inputConflicts, 'Show Conflicts');
		setLabel(this.inputOthers, 'Show Errors and Others');
		setLabel(this.button, 'Close');
		
		this.inputRegExp.addEventListener('mouseup', () => this.inputSearchterm.focus());
		this.inputCaseSensitive.addEventListener('mouseup', () => this.inputSearchterm.focus());
		
		this.inputSearchterm.placeholder = 'Find';
		
		this.inputSearchterm.addEventListener('focus', () => {
			
			this.focused = true;
			msg.send('context', { name: 'l13DiffSearchFocus', value: true });
			
		});
		
		this.inputSearchterm.addEventListener('blur', () => {
			
			this.focused = false;
			msg.send('context', { name: 'l13DiffSearchFocus', value: false });
			
		});
		
		this.inputSearchterm.addEventListener('dragover', (event) => event.preventDefault());
		
		this.inputSearchterm.addEventListener('drop', ({ dataTransfer }:DragEvent) => {
			
			if (dataTransfer) {
				const file = dataTransfer.getData('data-diff-file');
				if (file) this.viewmodel.searchterm = (<DiffFile>JSON.parse(file)).name;
			}
			
		});
		
		this.button.addEventListener('click', () => this.close());
		
		this.resizer.addEventListener('mousedown', this.resizeDown);
		
	}
		
	private resizeDown = (event:MouseEvent) => {
		
		document.documentElement.classList.add('-unselectable');
		document.body.style.cursor = 'col-resize';
		
		this.right = this.getBoundingClientRect().right;
		this.resizerOffsetX = event.offsetX;
		
		event.preventDefault();
		
		document.addEventListener('mousemove', this.resizeMove);
		document.addEventListener('mouseup', this.resizeUp);
		
	}
	
	private resizeMove = (event:MouseEvent) => {
		
		if (!event.which) return this.resizeUp();
		
		const width = this.right + this.resizerOffsetX - event.clientX;
		
		this.style.width = width + 'px';
		
	}
		
	private resizeUp = () => {
		
		document.removeEventListener('mousemove', this.resizeMove);
		document.removeEventListener('mouseup', this.resizeUp);
		
		document.documentElement.classList.remove('-unselectable');
		document.body.style.cursor = '';
		
	}
	
	public focus () {
		
		const input = this.inputSearchterm;
		
		input.focus();
		
		if (input.value) input.select();
		
	}
	
	public close () {
		
		this.dispatchCustomEvent('close');
		
	}
	
}

//	Functions __________________________________________________________________

