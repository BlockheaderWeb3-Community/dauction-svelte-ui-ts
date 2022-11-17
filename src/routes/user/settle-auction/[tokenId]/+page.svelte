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
	import NumberInput from '$lib/components/reusables/NumberInput.svelte';
	import TextInput from '$lib/components/reusables/TextInput.svelte';
	import {
		CURRENCIES,
		DAUCTION_MARKETPLACE_ADDRESS_ON_GOERLI,
		DELAY_MINUTES,
		NFT_CONTRACT_ADDRESS_ON_GOERLI
	} from '$lib/utils/constants';
	import { combineDateTime, datetoUnix, minsToUnix } from '$lib/utils/timeUtils';
	import { onMount } from 'svelte/internal';

	import MockToken from '$lib/contracts/MockToken.json';
	import { openModal, closeModal, closeAllModals } from 'svelte-modals';
	import LoadingModal from '$lib/components/modals/LoadingModal.svelte';
	import { fromWei, toWei } from '$lib/utils/conversionUtils';
	import { currentAuction } from '$lib/stores/main';
	import { goto } from '$app/navigation';
	import { createSalt, hashCommitmentParams, theRandomNumber } from '$lib/utils/hexUtils';
	import InfoModal from '$lib/components/modals/InfoModal.svelte';
	import TextAreaInput from '$lib/components/reusables/TextAreaInput.svelte';
	import CurrencySelector from '$lib/components/reusables/CurrencySelector.svelte';

	let formState = {
		nftContractAddress: '',
		tokenId: '',
		bidPrice: 0,
		salt: '',
		currencyAddress: ''
	};

	let approved = false;

	const checkAllowance = async (address: string) => {
		approved = false;
		// if (!tokenId) return;
		// openModal(LoadingModal);
		// getApprovalStatus(tokenId);
		console.log(approved);
	};

	const getAllowanceStatus = async (address: string) => {
		// try {
		// 	//@ts-ignore
		// 	await evm.attachContract('mockToken', address, MockToken.abi);
		// 	const getAll = await $contracts.mockToken.methods.allowance($selectedAccount, DAUCTION_MARKETPLACE_ADDRESS_ON_GOERLI).call();
		// 	console.log('get allo___', getAll);
		// 	if (getAll == 0) {
		// 		approved = true;
		// 		closeModal();
		// 		return;
		// 	} else {
		// 		approved = false;
		// 		closeModal();
		// 		return;
		// 	}
		// 	// alert('Please Approve Dauction Contract');
		// } catch (error: any) {
		// 	approved = false;
		// 	const msg = error.message;
		// 	alert(msg.split('{')[0]);
		// 	closeModal();
		// 	return;
		// }
	};

	onMount(async () => {
		if (!$currentAuction) {
			goto('/explore');
		}

		if (
			$selectedAccount &&
			$currentAuction?.owner.toLowerCase() !== $selectedAccount?.toLowerCase()
		) {
			alert('You are not the owner of auction');
			goto('/explore');
		}
	});

	const settleAuction = async ({
		nftAddress,
		tokenId,
		bidValue,
		salt
	}: {
		nftAddress: string;
		tokenId: string;
		bidValue: string;
		salt: string;
	}) => {
		console.log(nftAddress, tokenId, bidValue, salt);

		try {
			const settleAuction = await $contracts.dauctionContract.methods
				.settleAuction(nftAddress, tokenId, bidValue, salt)
				.send({ from: $selectedAccount });
			console.log('reveal Bid _______', settleAuction);

			closeModal();
			alert('Bid Revealed, Awaiting Winner');
			// openModal(InfoModal, {
			// 	infoTitle: `Bid Reveal`,
			// 	infoText: `Write down your salt -  ${salt}`
			// });
			currentAuction.set(null);
		} catch (error: any) {
			console.log(error);
			const msg = error.message;
			closeModal();
			alert(msg.split('{')[0]);
			return;
		}
	};

	const onSubmit = () => {
		openModal(LoadingModal);
		let k: keyof typeof formState;
		for (k in formState) {
			const v = formState[k];
			if (!v) {
				alert(`${k} is required`);
				return;
			}
		}

		if ($selectedAccount?.toLowerCase() === $currentAuction?.owner.toLowerCase()) {
			closeModal();
			alert('Auctioneer cannot reveal bid');
			return;
		}

		settleAuction({
			nftAddress: formState.nftContractAddress,
			tokenId: formState.tokenId,
			bidValue: formState.bidPrice.toString(),
			salt: formState.salt
		});
	};
</script>

<div class="reveal-bid">
	<h1 class="title">Reveal Bid</h1>
	{#if $selectedAccount && $currentAuction?.bidders
			.join('')
			.toLowerCase()
			.includes($selectedAccount?.toLowerCase())}
		<form on:submit|preventDefault={onSubmit} novalidate class="mb-auto">
			<TextInput
				label="NFT Contract Address"
				name="nftContractAddress"
				required={true}
				bind:value={formState.nftContractAddress}
			/>
			<TextInput label="Token Id" name="tokenId" required={true} bind:value={formState.tokenId} />
			<NumberInput
				label="Bid Price ($)"
				name="baseBid"
				required={true}
				bind:value={formState.bidPrice}
			/>
			<CurrencySelector
				data={CURRENCIES}
				label="Choose Currency"
				name="currencyAddress"
				required={true}
				bind:value={formState.currencyAddress}
			/>
			<TextAreaInput
				label="Token Id"
				name="tokenId"
				required={true}
				bind:value={formState.tokenId}
			/>

			<div class="cta">
				<button type="submit" class="btn-primary submit">
					<span>Reveal Bid</span>
				</button>
				<button type="button" class="btn-outline-primary" on:click={() => goto('/explore')}>
					<span>Grant Approval</span>
				</button>
			</div>
		</form>
	{:else}
		<h1>You Didnt Bid</h1>
	{/if}
</div>

<style>
	.reveal-bid {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		color: var(--white-background);
	}

	.reveal-bid .title {
		font-family: 'Darker Grotesque';
		font-weight: 500;
		font-size: 88px;
		line-height: 85%;
	}

	.reveal-bid form {
		width: 588px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* .reveal-bid form .collection {
	} */

	.reveal-bid form .collection span {
		font-weight: 500;
		font-size: 20px;
		padding: 16px;
	}
	.reveal-bid form .collection div {
		display: flex;
	}

	.reveal-bid form .cta {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 10px;
	}

	.reveal-bid form .cta button {
		width: 50%;
	}
</style>
