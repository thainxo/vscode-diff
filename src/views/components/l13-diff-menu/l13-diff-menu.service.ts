//	Imports ____________________________________________________________________

import { ViewModelService } from '../../@l13/component/view-model-service.abstract';
import { ViewModelConstructor } from '../../@types/components';

import { L13DiffMenuViewModel } from './l13-diff-menu.viewmodel';

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

export class L13DiffMenuViewModelService extends ViewModelService<L13DiffMenuViewModel> {
	
	public vmc:ViewModelConstructor<L13DiffMenuViewModel> = L13DiffMenuViewModel;
	
}

//	Functions __________________________________________________________________

