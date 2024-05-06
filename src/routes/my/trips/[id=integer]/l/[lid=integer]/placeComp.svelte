<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	export let place;
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { enhance } from '$app/forms';
	import { LoaderCircle } from 'lucide-svelte';
    import { Trash } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	let delAnim = false;
    let deled = false
</script>

<form
class="{deled ? 'hidden' : ''}"
	method="POST"
	action="?/edit_place"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		delAnim = true;

		return async ({ result, update }) => {
            toast.success(`Deleted ${place.name}`);
            delAnim = false;
            deled = true;
			update();
		};
	}}
>
	<input type="hidden" value={place.id} name="place_id" />
	<div class="flex items-center justify-between space-x-4">
		<div class="flex items-center space-x-4">
			<Avatar.Root>
				<!-- <Avatar.Image src="{person.avatar} "/> -->
				<Avatar.Fallback></Avatar.Fallback>
			</Avatar.Root>
			<div>
				<p class="text-sm font-medium leading-none">
					{place.name}
				</p>
				<!-- <p class="text-sm text-muted-foreground">
                    {location.longitude} {location.latitude}
                </p> -->
			</div>
		</div>
		{#if delAnim}
			<Button variant="outline" disabled>
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			</Button>
		{:else}
			<Button variant="outline" type="submit"><Trash class="w-3/4"/></Button>
		{/if}
	</div>
</form>
