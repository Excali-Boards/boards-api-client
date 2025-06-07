import { WebDataManager } from '../core/manager';
import { GetRoomsOutput } from './admin';

// Data.
export class APIRooms {
	constructor (private web: WebDataManager) { }

	// Methods.
	public async getRoomData<T>({ auth, boardId }: RoomsFunctionsInput['getRoomData']) {
		return await this.web.request<GetRoomsOutput<T>[]>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/rooms/${boardId}`),
		});
	}
}

// Types.
export type RoomsFunctionsInput = {
	'getRoomData': { auth: string; boardId: string; };
}
