//	Imports ____________________________________________________________________

import { detectPlatform, isMacOs } from '../@l13/core';

import icons from './icons';

//	Variables __________________________________________________________________

const findStyleUrl = /url\s*\(\s*"([^"]+)"\s*\)/g;

//	Initialize _________________________________________________________________

 // Fixes async dom loading bug on windows in a virtual machine?!?
window.addEventListener('load', () => {
	
	detectPlatform();
	
	document.body.appendChild(document.createElement('l13-diff'));
	
});

//	Exports ____________________________________________________________________

export const vscode = acquireVsCodeApi();

export function isMetaKey (ctrlKey:boolean, metaKey:boolean) :boolean {
	
	return isMacOs && metaKey || !isMacOs && ctrlKey;
	
}

export function parseIcons (text:string) {
	
	return text.replace(findStyleUrl, (match:string, url:string) => {
		
		const image = (<any>icons)[url];
		
		if (image) match = `url("data:image/svg+xml;base64,${btoa(image)}")`;
		
		return match;
	
	});
	
}

export function removeChildren (node:Node) {
	
	let child;
	
	while ((child = node.lastChild)) child.remove();
	
}

export function scrollElementIntoView (parent:HTMLElement, element:HTMLElement) {
		
	const offsetTop = element.offsetTop;
	const offsetHeight = parent.offsetHeight;
	const scrollTop = parent.scrollTop;
	
	if (scrollTop > offsetTop) {
		parent.scrollTop = offsetTop;
	} else if (scrollTop + offsetHeight < offsetTop + element.offsetHeight) {
		parent.scrollTop = (offsetTop + element.offsetHeight) - offsetHeight;
	}
	
}

//	Functions __________________________________________________________________