import { BoardsManager } from '../core/manager';

export class APICalendar {
	constructor (private web: BoardsManager) { }

	public async getCalendar({ auth, groupId }: CalendarFunctionsInput['getCalendar']) {
		return await this.web.request<GetCalendarResponse>({
			method: 'GET',
			auth,
			endpoint: `/groups/${groupId}/calendar`,
		});
	}

	public async createEvent({ auth, groupId, event }: CalendarFunctionsInput['createEvent']) {
		return await this.web.request<string>({
			method: 'POST',
			auth,
			endpoint: `/groups/${groupId}/calendar`,
			body: event,
		});
	}

	public async updateEvent({ auth, groupId, eventId, event }: CalendarFunctionsInput['updateEvent']) {
		return await this.web.request<string>({
			method: 'PATCH',
			auth,
			endpoint: `/groups/${groupId}/calendar/${eventId}`,
			body: event,
		});
	}

	public async deleteEvent({ auth, groupId, eventId }: CalendarFunctionsInput['deleteEvent']) {
		return await this.web.request<string>({
			method: 'DELETE',
			auth,
			endpoint: `/groups/${groupId}/calendar/${eventId}`,
		});
	}
}

// Input types
export type CalendarFunctionsInput = {
	'getCalendar': {
		auth: string;
		groupId: string;
	};
	'createEvent': {
		auth: string;
		groupId: string;
		event: EventObject;
	};
	'updateEvent': {
		auth: string;
		groupId: string;
		eventId: string;
		event: Partial<EventObject>;
	};
	'deleteEvent': {
		auth: string;
		groupId: string;
		eventId: string;
	};
};

// Schema types based on the server code
export type EventObject = {
	title: string;
	start: Date;
	end: Date;
	description?: string;
	color: string; // hex color
};

// Response types
export type GetCalendarResponse = {
	group: {
		id: string;
		name: string;
		index: number;
		accessLevel: string;
	};
	events: {
		id: string;
		title: string;
		color: string;
		description: string | null;
		start: Date;
		end: Date;
		createdAt: Date;
		updatedAt: Date;
		createdBy: {
			displayName: string;
			avatarUrl: string | null;
		};
	}[];
};
