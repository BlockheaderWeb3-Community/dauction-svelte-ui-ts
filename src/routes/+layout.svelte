<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import './styles.css';

	import { Modals, closeModal, openModal } from 'svelte-modals';

	import { onMount } from 'svelte';
	import { AVAILABLE_AUCTIONS, web3Modal } from '$lib/stores/main';
	import { ethers } from 'ethers';

	import Dauction from '$lib/contracts/Dauction.json';
	// import MockUSDT from '$lib/contracts/MockUSDT.json';
	import NFTContract from '$lib/contracts/NFTContract.json';
	// import ERC721 from '$lib/contracts/ERC721.json';
	//@ts-ignore
	// import NFT from '$lib/contracts/NFT.json';

	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import {
		connected,
		chainData,
		chainId,
		selectedAccount,
		defaultEvmStores as evm,
		web3,
		//@ts-ignore
		contracts,
		defaultEvmStores
	} from 'svelte-web3';
	import { goto } from '$app/navigation';
	import Web3Modal from 'web3modal';
	import { browserGet, browserSet } from '$lib/utils/requestUtils';
	import { variables } from '$lib/variables';
	import {
		DAUCTION_MARKETPLACE_ADDRESS_ON_GOERLI,
		NFT_CONTRACT_ADDRESS_ON_GOERLI
	} from '$lib/utils/constants';
	import { arrayIsNotEqual, sortArrayofObjects } from '$lib/utils/otherUtils';

	//@ts-ignore
	evm.attachContract('dauctionContract', DAUCTION_MARKETPLACE_ADDRESS_ON_GOERLI, Dauction.abi);
	//@ts-ignore
	evm.attachContract('nftContract', NFT_CONTRACT_ADDRESS_ON_GOERLI, NFTContract.abi);

	let auctionsOnDNFT: any[] = [];
	let auctionsOnDNFT_: any[] = [];
	let totalMinted = 0;

	const getTotalMintedNFTs = async () => {
		totalMinted = await $contracts.nftContract.methods.totalMinted().call();
		console.log('total mint _______', totalMinted);
		return;
	};

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

	const getBidders = async (nftAddress: string, tokenID: string) => {
		const biddersDetail = await $contracts.dauctionContract.methods
			.getBidders(nftAddress, tokenID)
			.call();
		return biddersDetail;
	};

	const populateAuctions = async () => {
		auctionsOnDNFT_ = [];
		auctionsOnDNFT = [];
		// AVAILABLE_AUCTIONS.set([]);
		try {
			openModal(LoadingModal);
			await getTotalMintedNFTs();
			for (let i = 0; i < totalMinted; i++) {
				let auction = await getAuctionDetails(NFT_CONTRACT_ADDRESS_ON_GOERLI, `${i}`);
				if (auction.owner !== '0x0000000000000000000000000000000000000000') {
					auctionsOnDNFT_ = [...auctionsOnDNFT_, { tokenId: i, ...auction }];
				}
			}

			for (let i = 0; i < auctionsOnDNFT_.length; i++) {
				let image = await getNFTImage($contracts.nftContract, auctionsOnDNFT_[i].tokenId);
				let bidders = [];
				if (Number(auctionsOnDNFT_[i].auctionStatus) >= 2) {
					bidders = await getBidders(NFT_CONTRACT_ADDRESS_ON_GOERLI, auctionsOnDNFT_[i].tokenId);
				}
				let newAuction = await {
					...auctionsOnDNFT_[i],
					image: image,
					bidders: bidders,
					liked: false
				};
				auctionsOnDNFT = [...auctionsOnDNFT, newAuction];
			}

			console.log(auctionsOnDNFT);
			if (arrayIsNotEqual($AVAILABLE_AUCTIONS, auctionsOnDNFT)) {
				AVAILABLE_AUCTIONS.set(sortArrayofObjects(auctionsOnDNFT, 'tokenId'));
			}

			closeModal();
		} catch (error: any) {
			const msg = error.message;
			alert(msg.split('{')[0]);
			closeModal();
			return;
		}
	};

	$: if ($connected && $selectedAccount !== null) {
		populateAuctions();
	}

	$: console.log($AVAILABLE_AUCTIONS.length);

	// TODO: move to store

	const connectWithWalletConnect = async () => {
		const provider = await $web3Modal.connect();
		defaultEvmStores.setProvider(provider);
	};

	// TODO: maybe move to store
	const disconnectWallet = async () => {
		await defaultEvmStores.disconnect();
		await $web3Modal.clearCachedProvider();
		browserSet('isWalletConnected', false);
	};

	const checkNetwork = async (network: any) => {
		if (!network) return;

		if (network !== 5) {
			// goerli
			alert('Please Choose Goerli chain');
			disconnectWallet();
		}
	};
	$: if ($connected && $selectedAccount !== null) {
		console.log($chainData);
		console.log($chainId);
	}

	$: checkNetwork($chainId);
	onMount(() => {
		if (typeof window.ethereum === 'undefined') {
			alert('Please Install MetaMask');
			return;
		}

		const providerOptions = {
			walletconnect: {
				package: window.WalletConnectProvider.default,
				options: { infuraId: variables.infuraId }
			}
		};
		// create instance
		$web3Modal = new Web3Modal({
			cacheProvider: true,
			providerOptions
		});

		// reconnect on mount
		if ($web3Modal.cacheProvider || browserGet('isWalletConnected') === 'true')
			connectWithWalletConnect();
	});
	// $: console.log('cache', web3Modal?.cacheProvider);
</script>

<Modals>
	<div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<Header {disconnectWallet} />

<main>
	<slot />
</main>

<Footer />

<style>
	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}

	:global(.modal) {
		z-index: 9999;
	}

	:global(.modal .contents) {
		z-index: 9999;
		background: rgba(255, 255, 255, 0.3) !important;
	}
</style>
