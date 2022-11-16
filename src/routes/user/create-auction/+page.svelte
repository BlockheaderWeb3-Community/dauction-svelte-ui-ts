<script lang="ts">
	// import { DateInput } from 'date-picker-svelte';
	// import { TimePicker } from 'svelte-time-picker';
	import NumberInput from '$lib/components/reusables/NumberInput.svelte';
	import TextInput from '$lib/components/reusables/TextInput.svelte';
	import TimeInput from '$lib/components/reusables/TimeInput.svelte';
	import DateInput from '$lib/components/reusables/DateInput.svelte';

	let formState = {
		nftContractAddress: '',
		tokenId: '',
		baseBid: 0,
		startDate: null,
		startTime: null,
		endDate: null,
		endTime: null,
		revealDuration: 0
	};

	let errors = [];

	const createAuction = () => {
		// add 3mins 180
	};

	const onSubmit = () => {
		// TODO Form Validations

		let k: keyof typeof formState;
		for (k in formState) {
			const v = formState[k];
			if (!v) {
				alert(`${k} is required`);
				return;
			}
		}

		alert(JSON.stringify(formState));
	};
</script>

<div class="create-auction">
	<h1 class="title">Create Auction</h1>

	<form on:submit|preventDefault={onSubmit} novalidate class="mb-auto">
		<TextInput
			label="NFT Contract Address"
			name="nftContractAddress"
			required={true}
			bind:value={formState.nftContractAddress}
		/>
		<TextInput label="Token Id" name="tokenId" required={true} bind:value={formState.tokenId} />
		<NumberInput
			label="Starting Bid Price"
			name="baseBid"
			required={true}
			bind:value={formState.baseBid}
		/>
		<div class="collection">
			<span>Start Date & Time</span>
			<div>
				<DateInput label="" name="startDate" required={true} bind:value={formState.startDate} />
				<TimeInput label="" name="startTime" required={true} bind:value={formState.startTime} />
			</div>
		</div>
		<div class="collection">
			<span>End Date & Time</span>
			<div>
				<DateInput label="" name="startDate" required={true} bind:value={formState.endDate} />
				<TimeInput label="" name="startTime" required={true} bind:value={formState.endTime} />
			</div>
		</div>
		<NumberInput
			label="Time Before Alowing Bid Reveals"
			name="revealDuration"
			required={true}
			bind:value={formState.revealDuration}
		/>
		<div class="cta">
			<button type="submit" class="btn-primary submit">
				<span>Create Auction</span>
			</button>
			<button type="submit" class="btn-outline-primary">
				<span>Go Back</span>
			</button>
		</div>
	</form>
</div>

<style>
	.create-auction {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		color: var(--white-background);
	}

	.create-auction .title {
		font-family: 'Darker Grotesque';
		font-weight: 500;
		font-size: 88px;
		line-height: 85%;
	}

	.create-auction form {
		width: 588px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* .create-auction form .collection {
	} */

	.create-auction form .collection span {
		font-weight: 500;
		font-size: 20px;
		padding: 16px;
	}
	.create-auction form .collection div {
		display: flex;
	}

	.create-auction form .cta {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 10px;
	}

	.create-auction form .cta button {
		width: 50%;
	}
</style>
