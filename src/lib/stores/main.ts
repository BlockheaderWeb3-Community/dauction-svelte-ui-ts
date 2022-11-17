import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const web3Modal = writable<any>(null);

export const currentAuction = writable<Auction | null>(null);

export interface Auction {
	auctionStatus: string;
	bidders: string[];
	endTime: number;
	image: string;
	minBidPrice: string;
	owner: string;
	revealDuration: number;
	startTime: number;
	tokenId: number;
}

// export const AVAILABLE_AUCTIONS = writable<Auction[]>([]);

const auctionJson: string = (browser && localStorage.getItem('AVAILABLE_AUCTIONS')) || '';
export const AVAILABLE_AUCTIONS = writable<Auction[]>(
	(auctionJson !== '' && JSON.parse(auctionJson)) || []
);
AVAILABLE_AUCTIONS.subscribe(
	(value) => browser && (localStorage.AVAILABLE_AUCTIONS = JSON.stringify(value))
);
