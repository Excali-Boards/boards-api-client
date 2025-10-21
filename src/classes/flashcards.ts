import { SingleOutput } from 'src/external/types';
import { BoardsManager } from '../core/manager';

// Data.
export class APIFlashcards {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getDeck({ auth, groupId, categoryId, boardId }: FlashcardsFunctionsInput['getDeck']) {
		return await this.web.request<FlashcardDeckResponse>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards`),
		});
	}

	public async initializeDeck({ auth, groupId, categoryId, boardId }: FlashcardsFunctionsInput['initializeDeck']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards/initialize`),
		});
	}

	public async destroyDeck({ auth, groupId, categoryId, boardId }: FlashcardsFunctionsInput['destroyDeck']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards/destroy`),
		});
	}

	public async createCards({ auth, groupId, categoryId, boardId, body }: FlashcardsFunctionsInput['createCards']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards`),
		});
	}

	public async updateCards({ auth, groupId, categoryId, boardId, body }: FlashcardsFunctionsInput['updateCards']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards`),
		});
	}

	public async deleteCards({ auth, groupId, categoryId, boardId, body }: FlashcardsFunctionsInput['deleteCards']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards`),
		});
	}

	public async overrideCards({ auth, groupId, categoryId, boardId, body }: FlashcardsFunctionsInput['overrideCards']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards/override`),
		});
	}

	public async updateProgress({ auth, groupId, categoryId, boardId, body }: FlashcardsFunctionsInput['updateProgress']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards/progress`),
		});
	}

	public async resetProgress({ auth, groupId, categoryId, boardId }: FlashcardsFunctionsInput['resetProgress']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards/progress`),
		});
	}

	public async reorderCards({ auth, groupId, categoryId, boardId, body }: FlashcardsFunctionsInput['reorderCards']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/flashcards/reorder`),
		});
	}
}

// Types.
export type FlashcardsFunctionsInput = {
	getDeck: { auth: string; groupId: string; categoryId: string; boardId: string; };
	initializeDeck: { auth: string; groupId: string; categoryId: string; boardId: string; };
	destroyDeck: { auth: string; groupId: string; categoryId: string; boardId: string; };
	createCards: { auth: string; groupId: string; categoryId: string; boardId: string; body: CardInput[]; };
	updateCards: { auth: string; groupId: string; categoryId: string; boardId: string; body: CardUpdateInput[]; };
	deleteCards: { auth: string; groupId: string; categoryId: string; boardId: string; body: string[]; };
	overrideCards: { auth: string; groupId: string; categoryId: string; boardId: string; body: CardInput[]; };
	updateProgress: { auth: string; groupId: string; categoryId: string; boardId: string; body: ProgressInput; };
	resetProgress: { auth: string; groupId: string; categoryId: string; boardId: string; };
	reorderCards: { auth: string; groupId: string; categoryId: string; boardId: string; body: string[]; };
};

// External.
export type CardInput = {
	front: string;
	back: string;
};

export type CardUpdateInput = {
	id: string;
	front?: string;
	back?: string;
};

export type ProgressInput = {
	currentIndex: number;
	completed?: boolean;
};

export type FlashcardDeckResponse = {
	board: SingleOutput;
	deck: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
	};
	cards: FlashcardCard[];
	progress: {
		completed: boolean;
		lastStudied: Date;
		currentIndex: number;
	} | null;
};

export type FlashcardCard = {
	id: string;
	front: string;
	back: string;
	index: number;
	createdAt: Date;
	updatedAt: Date;
};
