<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import './styles.css';

	import { onMount } from 'svelte';
	import { web3Modal } from '$lib/stores/main';
	import { ethers } from 'ethers';

	import Dauction from '$lib/contracts/Dauction.json';
	import MockUSDT from '$lib/contracts/MockUSDT.json';
	import NFTContract from '$lib/contracts/NFTContract.json';
	import ERC721 from '$lib/contracts/ERC721.json';
	//@ts-ignore
	import NFT from '$lib/contracts/NFT.json';

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

	const DAUCTION_ADDRESS_ON_MUMBAI = '0x9c21864573e04C8c2e601c4B25d8595125490a08';
	// const MOCK_USDT_ADDRESS_ON_MUMBAI = '0x8a103012233e0885285C571ef8C627C3d65408c0';
	const NFT_CONTRACT_ADDRESS_ON_MUMBAI = '0x130e8c89F3583BD4329496D88124877Fc52D1A86';

	// const NFT_ADDRESS_ON_GOERLI = '0xFc5981357a457A39CC246fB7ce4b7093b348978b';

	//@ts-ignore
	evm.attachContract('dauctionContract', DAUCTION_ADDRESS_ON_MUMBAI, Dauction.abi);
	//@ts-ignore
	// evm.attachContract('mockUSDTConract', MOCK_USDT_ADDRESS_ON_MUMBAI, MockUSDT.abi);

	// const nftContractInstance = (contractAddress) => {
	// 	//@ts-ignore
	// 	return evm.attachContract('nftContract', contractAddress, ERC721.abi);
	// };

	//@ts-ignore
	evm.attachContract('nftContract', NFT_CONTRACT_ADDRESS_ON_MUMBAI, NFTContract.abi);

	//@ts-ignore
	// evm.attachContract('nftContractz', NFT_ADDRESS_ON_GOERLI, NFT);

	// const dauctionContract = new Web3();
	// const dauctionContract = makeContractStore(Dauction, DAUCTION_ADDRESS_ON_GOERLI);
	$: console.log($contracts);

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

		if (network !== 80001) {
			// goerli
			alert('Please Choose Mumbai chain');
			disconnectWallet();
		}
	};
	$: if ($connected && $selectedAccount !== null) {
		console.log($chainData);
		console.log($chainId);
	}

	$: checkNetwork($chainId);
	console.log(ethers);
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

<!-- <div class="app"> -->
<Header {disconnectWallet} />

<main>
	<slot />
</main>

<Footer />
<!-- </div> -->
