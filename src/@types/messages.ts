//	Imports ____________________________________________________________________

import { Uri } from '../types';

import { Diff, DiffFile } from './diffs';

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export type DiffCopyMessage = {
	diffs:Diff[],
	multi:boolean,
	pathA:string,
	pathB:string,
};

export type DiffDialogMessage = {
	fsPath:string,
};

export type DiffFavoriteMessage = {
	pathA:string,
	pathB:string,
};

export type DiffGoToMessage = {
	files:DiffFile[],
	openToSide:boolean,
};

export type DiffInitMessage = {
	pathA:string,
	pathB:string,
};

export type DiffInitViewMessage = {
	panel:DiffPanelStateMessage,
	uris:Uri[],
	workspaces:string[],
	compare:boolean,
};

export type DiffMultiCopyMessage = {
	ids:string[],
	pathA:string,
	pathB:string,
};

export type DiffOpenMessage = {
	diffs:Diff[],
	pathA:string,
	pathB:string,
	openToSide:boolean,
};

export type DiffPanelStateMessage = {
	views: {
		unchangedChecked:boolean,
		deletedChecked:boolean,
		modifiedChecked:boolean,
		untrackedChecked:boolean,
		ignoredChecked:boolean,
	},
	search: {
		searchterm:string,
		useRegExp:boolean,
		useCaseSensitive:boolean,
		useFiles:boolean,
		useFolders:boolean,
		useSymlinks:boolean,
		useConflicts:boolean,
		useOthers:boolean,
	},
};

export type DiffResultMessage = {
	diffs:Diff[],
	pathA:string,
	pathB:string,
};

export type DiffUpdatePathsMessage = {
	uris:Uri[],
	compare:boolean,
};

export type MessageListener = (...args:any[]) => void;

//	Functions __________________________________________________________________

