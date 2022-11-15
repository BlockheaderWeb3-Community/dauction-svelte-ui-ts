<script lang="ts">
	import CardTopTemplate from '$lib/components/user/CardTopTemplate.svelte';
	import type { Auction } from '$lib/interfaces';
	import { onMount } from 'svelte';

	let drawerContent: HTMLDivElement;
	onMount(() => {
		const _scroll = drawerContent.scrollTo;
		window.scrollTo = function () {
			_scroll.apply(drawerContent);
		};
	});

	const auction: Auction = {
		id: Math.floor(1000 + Math.random() * 9000),
		profile_name: 'Bored Ape Yacht Club',
		profile_desc: 'BoredApeYachtClub #8867',
		profile_pic: '/images/profile-images/Bored-Ape-Yach-Club.png',
		nft: '/images/hero-nft-1.png',
		crypto_price: 95.2,
		usd_price: 125029,
		liked: false,
		bids: Math.floor(Math.random() * 90 + 10)
	};
	const auctions: Auction[] = [];
	// 	auction,
	// 	{
	// 		id: Math.floor(1000 + Math.random() * 9000),
	// 		profile_name: 'Strange Connections',
	// 		profile_desc: 'Strange Connections #1414',
	// 		profile_pic: '/images/profile-images/Strange-Connections.png',
	// 		nft: '/images/hero-nft-2.png',
	// 		crypto_price: 85.2,
	// 		usd_price: 122029,
	// 		liked: false,
	// 		bids: Math.floor(Math.random() * 90 + 10)
	// 	}
	// ];
</script>

<div
	bind:this={drawerContent}
	class="assets-on-auction user-template"
	style="width: 100%;height: 100%"
>
	{#if auctions.length > 0}
		<div class="top">
			<div class="toolbar">
				<div class="search-container">
					<input type="text" name="search" placeholder="Search by items " />
					<img src="/icons/search-icon.svg" alt="" />
				</div>
				<select name="catergory">
					<option value="1">Catergory 1</option>
				</select>
			</div>
		</div>
		<div class="auctions-container">
			{#each auctions as auction}
				<div class="auction">
					<div class="auction-card">
						<div class="content">
							<CardTopTemplate
								profile_name={auction.profile_name}
								profile_desc={auction.profile_desc}
								profile_pic={auction.profile_pic}
								nft={auction.nft}
								liked={auction.liked}
							/>
							<div class="auction-card-bottom">
								<div class="left">
									<span>Base Bid</span>
									<h4>{auction.crypto_price.toLocaleString()}<span>MATIC</span></h4>
									<span class="usd">${auction.usd_price.toLocaleString()}</span>
								</div>
								<div class="right">
									<span>Remaning Time</span>
									<h4>09h 24m 02s</h4>
									<p><span class="usd" style="font-weight: 700">{auction.bids}</span>bids placed</p>
								</div>
							</div>
							<div class="auction-btns">
								<button class="btn-outline-primary auction-btn-explore" style="width: 100%;">
									<span>View</span>
								</button>
							</div>
						</div>
						<div class="bg " />
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-disp">
			<h1>No items up for auction</h1>
			<span>
				Create new auctions or select assets from your created tab and list them up for auction
			</span>
			<button class="btn-primary short-button">
				<span>Explore Auctions</span>
				<img src="/icons/arrow-forward-black.svg" alt="" />
			</button>
		</div>
	{/if}
</div>

<style>
	* {
		font-family: 'Darker Grotesque', sans-serif;
	}
	
	.assets-on-auction .top {
		margin-bottom: 24px;
	}

	.assets-on-auction .auctions-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, 232px);
		grid-gap: 16px;
		z-index: 10;
		padding-bottom: 20px;
	}

	.assets-on-auction .auctions-container .auction .auction-card {
		position: relative;
		z-index: 10;
	}

	.assets-on-auction .auction-card {
		margin-bottom: 16px;
	}

	.assets-on-auction .auction-card .content {
		padding: 13.35px 13.11px;
	}

	.assets-on-auction .auction-card .content .auction-card-bottom .left > span,
	.assets-on-auction .auction-card .content .auction-card-bottom .right > span,
	.assets-on-auction .auction-card .content .auction-card-bottom .right p {
		font-size: 11.47px;
	}

	.assets-on-auction .auction-card .content .auction-card-bottom .right p {
		font-weight: 500;
	}
	.assets-on-auction .auction-card .content .auction-card-bottom .left h4,
	.assets-on-auction .auction-card .content .auction-card-bottom .right h4 {
		font-size: 18.02px;
	}
	.assets-on-auction .auction-card .content .auction-btns {
		align-items: normal;
	}
	.assets-on-auction .auction-card .content .auction-btns .auction-btn-explore {
		padding: 5px 20px;
		font-weight: 400;
		font-size: 14px;
	}

	.assets-on-auction .auction-card .bg {
		background: #1d220d;
		border: 1.05854px solid #d3f85a;
		position: absolute;
		width: 230px;
		height: 389.46px;
		top: 12px;
		left: 12px;
		z-index: 1;
		display: none;
	}

	/* Hover */
	.assets-on-auction .auction-card:hover .content .auction-btns .auction-btn-explore {
		padding-top: 10px;
		padding-bottom: 10px;
		font-size: 15px;
	}

	.assets-on-auction .auction-card:hover {
		margin-bottom: 0px;
	}

	.assets-on-auction .auction-card:hover .bg {
		display: block;
		z-index: -1;
	}
</style>
