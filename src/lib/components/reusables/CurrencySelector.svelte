<script lang="ts">
	export let name: string;
	export let label: string;
	export let required = false;
	export let value: string;
	export let data: Currency[];

	interface Currency {
		address: string;
		image: string;
		name: string;
	}
</script>

<fieldset>
	{#if label}
		<label for="tokenID">
			{label}
			{#if required}
				<span>*</span>
			{/if}
		</label>
	{/if}

	<select {name} bind:value>
		{#each data as d}
			<option value={d.address}>
				<!-- <img src={d.image} alt="" /> -->
				<span>{d.name}</span>
			</option>
		{/each}
	</select>
</fieldset>

<style>
	fieldset {
		display: flex;
		flex-direction: column;
		border: none;
		gap: 8px;
		width: 100%;
	}

	fieldset label {
		display: flex;
		gap: 4px;
		border: none;
		font-weight: 500;
		font-size: 20px;
	}

	fieldset label span {
		color: #f15b5b;
	}

	fieldset select {
		background-color: #131b2e;
		border-radius: 4px;
		padding: 16px;
		color: #fff;
		font-weight: 400;
		font-size: 20px;
		width: 100%;
		border: 1px solid #595c64;
		border-radius: 8px;
	}
</style>
