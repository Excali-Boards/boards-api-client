import { SingleOutput } from '../external/types';
import { BoardsManager } from '../core/manager';

export class APICalendar {
	constructor (private web: BoardsManager) { }

	public async getCalendar({ auth, groupId }: CalendarFunctionsInput['getCalendar']) {
		return await this.web.request<GetCalendarResponse>({
			method: 'GET', auth,
			endpoint: `/groups/${groupId}/calendar`,
		});
	}

	public async getHolidays({ auth, countryCode, year }: CalendarFunctionsInput['getHolidays']) {
		return await this.web.request<FormattedHoliday[]>({
			method: 'GET', auth,
			endpoint: `/holidays/${countryCode}/${year}`,
		});
	}

	public async createEvent({ auth, groupId, event }: CalendarFunctionsInput['createEvent']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: `/ groups / ${groupId} / calendar`,
			body: event,
		});
	}

	public async updateEvent({ auth, groupId, eventId, event }: CalendarFunctionsInput['updateEvent']) {
		return await this.web.request<string>({
			method: 'PATCH', auth,
			endpoint: `/ groups / ${groupId} / calendar / ${eventId}`,
			body: event,
		});
	}

	public async deleteEvent({ auth, groupId, eventId }: CalendarFunctionsInput['deleteEvent']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: `/ groups / ${groupId} / calendar / ${eventId}`,
		});
	}
}

// Input types
export type CalendarFunctionsInput = {
	'getCalendar': { auth: string; groupId: string; };
	'getHolidays': { auth: string; countryCode: string; year: number; };
	'createEvent': { auth: string; groupId: string; event: EventObject; };
	'updateEvent': { auth: string; groupId: string; eventId: string; event: Partial<EventObject>; };
	'deleteEvent': { auth: string; groupId: string; eventId: string; };
};

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
	group: SingleOutput;
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

export type HolidayEvent = {
	date: string;
	localName: string;
	name: string;
	countryCode: string;
	global: boolean;
	counties: string[] | null;
	launchYear: number | null;
	types: ClosedStatus[];
};

export type FormattedHoliday = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	color: string;
	description: string;
	types: ClosedStatus[];
};
