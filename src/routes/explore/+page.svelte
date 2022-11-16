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
	// import Web3 from 'web3';

	// const getImage = () => {
	// 	contracts.
	// };

	// $: promise = getImage();

	$: console.log('dacutionContractMethods___________', $contracts.dauctionContract?.methods);
	$: console.log('dacutionContract___________', $contracts.dauctionContract);

	$: if ($connected) {
		// getNFTImage($contracts);
	}

	let nftImage;

	// const getNFTImage = async (contracts: any) => {
	// 	if (!$connected) {
	// 		return;
	// 	}
	// 	const nftJSONURL = await contracts?.nftContractz?.methods.tokenURI(1).call();
	// 	try {
	// 		const response = await fetch(nftJSONURL);
	// 		const cResponse = await response.json();
	// 		return cResponse.image;
	// 	} catch (error) {
	// 		console.log(error);
	// 		return '';
	// 	}
	// };
	const getNFTImage = async (contracts: any) => {
		if (!$connected) {
			return;
		}
		const nftJSONURL = await contracts?.nftContract?.methods.tokenURI(13).call();
		try {
			const response = await fetch(nftJSONURL);
			console.log(nftJSONURL);
			const cResponse = await response.json();
			return cResponse.image;
		} catch (error) {
			console.log(error);
			return '';
		}
	};
</script>

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
	<div class="auctions">Auction</div>
	{#if $connected}
		<div style="color: red; font-size:30px">
			{#await $contracts?.dauctionContract?.methods.totalExecutedAuctions().call()}
				<span>waiting...</span>
			{:then value}
				<span>result of contract call on my contract : {`${value}`} </span>
			{/await}
		</div>
		{#await getNFTImage($contracts)}
			<p>...waiting</p>
		{:then data}
			<img src={data} alt="Dog" width="500px" />
		{:catch error}
			<p>An error occurred!</p>
		{/await}
	{/if}
</div>
