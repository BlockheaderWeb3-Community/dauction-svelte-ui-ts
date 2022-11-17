import { browser } from '$app/environment';
import type { Auction } from '$lib/interfaces';
import { writable } from 'svelte/store';

export const web3Modal = writable<any>(null);

export const currentAuction = writable<Auction | null>(null);

// export const AVAILABLE_AUCTIONS = writable<Auction[]>([]);

const auctionJson: string = (browser && localStorage.getItem('AVAILABLE_AUCTIONS')) || '';
export const AVAILABLE_AUCTIONS = writable<Auction[]>(
	(auctionJson !== '' && JSON.parse(auctionJson)) || []
);
AVAILABLE_AUCTIONS.subscribe(
	(value) => browser && (localStorage.AVAILABLE_AUCTIONS = JSON.stringify(value))
);
