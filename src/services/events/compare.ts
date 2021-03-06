//	Imports ____________________________________________________________________

import * as vscode from 'vscode';

import { StatsMap } from '../../types';

import { formatAmount } from '../../@l13/formats';
import { pluralEntries } from '../../@l13/units/files';

import { DiffResult } from '../output/DiffResult';
import { DiffStats } from '../output/DiffStats';

import { DiffPanel } from '../panel/DiffPanel';

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export function init (currentDiffPanel:DiffPanel) {
	
	currentDiffPanel.msg.on('create:diffs', (data:DiffResult) => currentDiffPanel.compare.initCompare(data));
	
	currentDiffPanel.compare.onInitCompare(() => {
		
		currentDiffPanel.status.update();
		currentDiffPanel.output.clear();
		currentDiffPanel.output.msg('LOG\n');
		
	}, null, currentDiffPanel.disposables);
	
	currentDiffPanel.compare.onDidNotCompare(({ error, pathA, pathB}) => {
		
		currentDiffPanel.output.log(`${error}`);
		
		if (error instanceof Error) currentDiffPanel.output.msg(`${error.stack}`);
		
		currentDiffPanel.msg.send('create:diffs', new DiffResult(pathA, pathB));
		
	}, null, currentDiffPanel.disposables);
	
// compare files
	
	currentDiffPanel.compare.onStartCompareFiles(({ data, pathA, pathB }) => {
		
		currentDiffPanel.saveHistory(data, pathA, pathB);
		currentDiffPanel.setTitle(pathA, pathB);
		currentDiffPanel.output.log(`Comparing "${pathA}" ↔ "${pathB}"`);
		
	}, null, currentDiffPanel.disposables);
	
	currentDiffPanel.compare.onDidCompareFiles((data:DiffResult) => {
		
		currentDiffPanel.msg.send('create:diffs', data);
		
	}, null, currentDiffPanel.disposables);
	
//	compare folders
	
	currentDiffPanel.compare.onStartCompareFolders(({ data, pathA, pathB }) => {
		
		currentDiffPanel.saveHistory(data, pathA, pathB);
		currentDiffPanel.setTitle(pathA, pathB);
		currentDiffPanel.output.log(`Start comparing "${pathA}" ↔ "${pathB}"`);
		
	}, null, currentDiffPanel.disposables);
	
	currentDiffPanel.compare.onStartScanFolder((pathname:string) => {
		
		currentDiffPanel.output.log(`Scanning "${pathname}"`);
		
	}, null, currentDiffPanel.disposables);
	
	currentDiffPanel.compare.onEndScanFolder((result:StatsMap) => {
		
		const total = Object.entries(result).length;
		
		currentDiffPanel.output.log(`Found ${formatAmount(total, pluralEntries)}`);
		
	}, null, currentDiffPanel.disposables);
	
	currentDiffPanel.compare.onDidCompareFolders((data:DiffResult) => {
		
		currentDiffPanel.output.log('Creating stats for diff result');
		
		const diffStats = new DiffStats(data);
		const ignoredEntries = diffStats.ignored.entries;
		const comparedEntries = diffStats.all.entries - ignoredEntries;
		let text = `Compared ${formatAmount(comparedEntries, pluralEntries)}`;
		
		currentDiffPanel.status.update(text);
		
		if (ignoredEntries) text += `, ignored ${formatAmount(ignoredEntries, pluralEntries)}`;
		
		currentDiffPanel.output.log(`${text}\n\n\n`);
		currentDiffPanel.output.msg(diffStats.report());
		
		if (!comparedEntries) vscode.window.showInformationMessage('No files or folders to compare.');
		
		currentDiffPanel.msg.send('create:diffs', data);
		
	}, null, currentDiffPanel.disposables);
	
//	compare multi
	
	currentDiffPanel.msg.on('compare:multi', () => {
		
		currentDiffPanel.sendAll('compare:multi');
		
	});
	
}

//	Functions __________________________________________________________________

