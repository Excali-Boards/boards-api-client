import { SingleOutput } from '../external/types';
import { BoardsManager } from '../core/manager';
import { WithHeaders } from '../types';

export class APICalendar {
	constructor (private web: BoardsManager) { }

	public async getCalendar({ auth, groupId, ...rest }: CalendarFunctionsInput['getCalendar']) {
		return await this.web.request<GetCalendarResponse>({
			method: 'GET', auth, ...rest,
			endpoint: `/groups/${groupId}/calendar`,
		});
	}

	public async getHolidays({ auth, countryCode, year, ...rest }: CalendarFunctionsInput['getHolidays']) {
		return await this.web.request<FormattedHoliday[]>({
			method: 'GET', auth, ...rest,
			endpoint: `/holidays/${countryCode}/${year}`,
		});
	}

	public async updateGroupCalendarCode({ auth, groupId, calCode, ...rest }: CalendarFunctionsInput['updateGroupCalendarCode']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, ...rest,
			endpoint: `/groups/${groupId}/calendar`,
			body: { calCode },
		});
	}

	public async createEvent({ auth, groupId, event, ...rest }: CalendarFunctionsInput['createEvent']) {
		return await this.web.request<string>({
			method: 'POST', auth, ...rest,
			endpoint: `/groups/${groupId}/calendar`,
			body: event,
		});
	}

	public async updateEvent({ auth, groupId, eventId, event, ...rest }: CalendarFunctionsInput['updateEvent']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, ...rest,
			endpoint: `/groups/${groupId}/calendar/${eventId}`,
			body: event,
		});
	}

	public async deleteEvent({ auth, groupId, eventId, ...rest }: CalendarFunctionsInput['deleteEvent']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, ...rest,
			endpoint: `/groups/${groupId}/calendar/${eventId}`,
		});
	}
}

// Input types
export type CalendarFunctionsInput = WithHeaders<{
	'getCalendar': { auth: string; groupId: string };
	'getHolidays': { auth: string; countryCode: string; year: number };
	'createEvent': { auth: string; groupId: string; event: EventObject };
	'updateGroupCalendarCode': { auth: string; groupId: string; calCode: string | null };
	'updateEvent': { auth: string; groupId: string; eventId: string; event: Partial<EventObject> };
	'deleteEvent': { auth: string; groupId: string; eventId: string };
}>;

// Types.
export type EventObject = {
	title: string;
	start: Date;
	end: Date;
	color: string; // hex color
	description?: string;
	where?: string;
};

export type GetCalendarResponse = {
	group: SingleOutput & { calendarCode: string | null; };
	events: CalendarEvent[];
};

export type CalendarEvent = {
	id: string;
	title: string;
	color: string;
	description: string | null;
	where: string | null;
	start: Date;
	end: Date;
	createdAt: Date;
	updatedAt: Date;
	createdBy: {
		displayName: string;
		avatarUrl: string | null;
	};
};

export type ClosedStatus = 'Public' | 'Bank' | 'School' | 'Authorities' | 'Optional' | 'Observance';

export type FormattedHoliday = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	color: string;
	description: string;
	types: ClosedStatus[];
};
