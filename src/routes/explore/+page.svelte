<script lang="ts">
	import {
		connected,
		chainId,
		selectedAccount,
		defaultEvmStores as evm,
		web3,
		//@ts-ignore
		contracts
	} from 'svelte-web3';
	import { onMount } from 'svelte';

	import { openModal, closeModal } from 'svelte-modals';
	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import { NFT_CONTRACT_ADDRESS_ON_GOERLI } from '$lib/utils/constants';
	import ExploreCardTopTemplate from '$lib/components/ExploreCardTopTemplate.svelte';
	import { goto } from '$app/navigation';
	import CountdownTimer from '$lib/components/reusables/CountdownTimer.svelte';
	import { datetoUnix, unixToDate } from '$lib/utils/timeUtils';
	import { currentAuction } from '$lib/stores/main';
	import { formatPrice, fromWei } from '$lib/utils/conversionUtils';

	let auctionsOnDNFT: any[] = [];
	let auctionsOnDNFT_: any[] = [];
	let totalMinted = 0;

	const RANDOM_PROFILE = [
		'/images/profile-images/Strange-Connections.png',
		'/images/profile-images/Blockheader-Digital-Assets.png',
		'/images/profile-images/GardenLockdown.png'
	];

	onMount(() => {});

	const getTotalMintedNFTs = async () => {
		totalMinted = await $contracts.nftContract.methods.totalMinted().call();
		console.log('total mint _______', totalMinted);
		return;
	};

	const populateAuctions = async () => {
		try {
			openModal(LoadingModal);
			await getTotalMintedNFTs();
			for (let i = 0; i < 9; i++) {
				let auction = await getAuctionDetails(NFT_CONTRACT_ADDRESS_ON_GOERLI, `${i}`);
				if (auction.owner !== '0x0000000000000000000000000000000000000000') {
					auctionsOnDNFT_ = [...auctionsOnDNFT_, { tokenId: i, ...auction }];
				}
			}

			// get images
			// auctionsOnDNFT_ = await auctionsOnDNFT_.map(async (auction) => {
			// 	let image = await getNFTImage($contracts.nftContract, auction.tokenId);
			// 	let newAuction = await { ...auction, image: image };
			// 	return newAuction;
			// });
			for (let i = 0; i < auctionsOnDNFT_.length; i++) {
				let image = await getNFTImage($contracts.nftContract, auctionsOnDNFT_[i].tokenId);
				let newAuction = await { ...auctionsOnDNFT_[i], image: image };
				auctionsOnDNFT = [...auctionsOnDNFT, newAuction];
			}

			console.log(auctionsOnDNFT);

			closeModal();
		} catch (error: any) {
			const msg = error.message;
			alert(msg.split('{')[0]);
			closeModal();
			return;
		}
	};

	$: if ($connected) {
		// getNFTImage($contracts);
	}

	$: if ($connected && $selectedAccount !== null) {
		populateAuctions();
	}

	const getNFTImage = async (nftContract: any, tokenID: string) => {
		if (!$connected) {
			return;
		}
		const nftJSONURL = await nftContract?.methods.tokenURI(tokenID).call();
		try {
			const response = await fetch(nftJSONURL);
			const cResponse = await response.json();
			return cResponse.image;
		} catch (error) {
			console.log(error);
			return '';
		}
	};

	const getAuctionDetails = async (nftAddress: string, tokenID: string) => {
		const auctionDetail = await $contracts.dauctionContract.methods
			.auctions(nftAddress, tokenID)
			.call();
		return auctionDetail;
		// try {
		// 	const response = await fetch(nftJSONURL);
		// 	const cResponse = await response.json();
		// 	return cResponse.image;
		// } catch (error) {
		// 	console.log(error);
		// 	return '';
		// }
	};

	const handlePlaceBid = async (auction: any) => {
		await currentAuction.set(auction);
		goto(`/user/bid-auction/${auction.tokenId}`);
	};
</script>

<div class="wrapper">
	<div class="explore-auctions-section">
		<div class="top">
			<h1>Explore Auctions</h1>
			<div class="toolbar">
				<div class="search-container">
					<input type="text" name="search" placeholder="Search by items or sellers" />
					<img src="/icons/search-icon.svg" alt="" />
				</div>
				<select name="catergory">
					<option value="1">Catergory 1</option>
				</select>
				<select name="Price">
					<option value="1">Price 1</option>
				</select>
			</div>
		</div>
		<!-- <div class="auctions">Auction</div> -->
		{#if $connected}
			<!-- <div style="color: red; font-size:30px" class="" /> -->
			<!-- {#await getNFTImage($contracts?.nftContract, '2')}
			<p>...waiting</p>
		{:then data}
			<img src={data} alt="Dog" width="500px" />
		{:catch error}
			<p>An error occurred!</p>
		{/await} -->

			<div class="explore">
				<div class="auctions-container">
					{#each auctionsOnDNFT as auction}
						<div class="auction">
							<div class="auction-card">
								<div class="content">
									<ExploreCardTopTemplate
										profile_name={'auction.profile_name'}
										profile_desc={'auction.profile_desc'}
										profile_pic={RANDOM_PROFILE[Math.floor(Math.random() * RANDOM_PROFILE.length)]}
										nft={auction.image}
										liked={false}
									/>
									<div class="auction-card-bottom">
										<div class="left">
											<span>Base Bid</span>
											<h4>${formatPrice(auction.minBidPrice)}</h4>
											<!-- <span class="usd" style="font-weight: 700"
												>${auction.minBidPrice.toLocaleString()}</span
											> -->
										</div>
										<div class="right">
											<span>Remaning Time</span>
											<h4>
												<CountdownTimer endTime={unixToDate(auction.endTime)} />
											</h4>
											<p><span class="usd">{'auction.bids'}</span>bids placed</p>
										</div>
									</div>
									<!-- {#if datetoUnix(new Date()) < auction.endTime} -->
									<div class="auction-btns">
										<button
											class="btn-primary auction-btn-place"
											on:click={() => handlePlaceBid(auction)}
											disabled={datetoUnix(new Date()) >= auction.endTime}
										>
											<span>Place a Bid</span>
										</button>
										<button class="btn-outline-primary auction-btn-explore" style="width: 50%;">
											<span>View</span>
										</button>
									</div>
									<!-- {/if} -->
								</div>
								<div class="bg " />
							</div>
						</div>
					{:else}
						<div class="title">
							<h1>Noting to Display</h1>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.explore {
		width: 100%;
	}
	.explore .auctions-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, 282px);
		grid-gap: 24px;
		z-index: 10;
		padding-bottom: 20px;
	}

	.explore .auctions-container .auction .auction-card {
		position: relative;
		z-index: 10;
	}

	.explore .auction-card {
		margin-bottom: 16px;
	}

	.explore .auction-card .content {
		padding: 16px;
	}

	.explore .auction-card .content .auction-card-bottom .left > span,
	.explore .auction-card .content .auction-card-bottom .right > span,
	.explore .auction-card .content .auction-card-bottom .right p {
		font-size: 14px;
	}

	.explore .auction-card .content .auction-card-bottom .right p {
		font-weight: 700;
	}
	.explore .auction-card .content .auction-card-bottom .left h4,
	.explore .auction-card .content .auction-card-bottom .right h4 {
		font-size: 22px;
	}
	.explore .auction-card .content .auction-btns {
		align-items: normal;
	}
	.explore .auction-card .content .auction-btns .auction-btn-place,
	.explore .auction-card .content .auction-btns .auction-btn-explore {
		padding: 10px 20px;
		font-weight: 400;
		font-size: 14px;
	}

	.explore .auction-card .bg {
		background: #1d220d;
		border: 1.05854px solid #d3f85a;
		position: absolute;
		width: 282px;
		height: 459.46px;
		top: 12px;
		left: 12px;
		z-index: 1;
		display: none;
	}

	/* Hover */
	.explore .auction-card:hover .content .auction-btns .auction-btn-place,
	.explore .auction-card:hover .content .auction-btns .auction-btn-explore {
		padding-top: 10px;
		padding-bottom: 10px;
		font-size: 15px;
	}

	.explore .auction-card:hover {
		margin-bottom: 0px;
	}

	.explore .auction-card:hover .bg {
		display: block;
		z-index: -1;
	}

	.explore-auctions-section .title {
		text-align: center;
		width: 100%;
		color: var(--white-background);
		grid-column-end: span 4;
	}
</style>
