<script lang="ts">
	import { cn } from "$lib/utils.js";
    import BadgePlus from "lucide-svelte/icons/badge-plus";
	import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
	import type { Location } from "./location";
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";


	let className: string | undefined | null = undefined;
	export let location: Location;
	export let tripId: number;
	export let aspectRatio: "portrait" | "square" = "square";
	export let width: number;
	export let height: number;
	export { className as class };
	import {LoaderCircle} from "lucide-svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
	let delAnim = false;
    let deled = false;
	let dialogOpen = false;
</script>
<div>
<div class={cn("space-y-3", className)} {...$$restProps}>
	<a href="{tripId}/l/{location.id}">
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<div class="overflow-hidden rounded-md">
				<img
					class={cn(
						"h-auto w-auto object-cover transition-all hover:scale-105",
						aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
					)}
					src="https://picsum.photos/300/300/"
					alt={location.name}
					{width}
					{height}
				/>
			</div>
		</ContextMenu.Trigger>
		<ContextMenu.Content class="w-40">
			<ContextMenu.Item><a href="{tripId}/l/{location.id}">Edit places</a></ContextMenu.Item>
			<ContextMenu.Separator />
			<ContextMenu.Item on:click={() => {dialogOpen = true;}}>Delete location</ContextMenu.Item>
		</ContextMenu.Content>
	
	</ContextMenu.Root>
	<div class="space-y-4 mt-3 text-md">
		<h3 class="font-medium leading-none">{location.name}</h3>
	</div>
</a>
</div>
</div>
<AlertDialog.Root bind:open={dialogOpen}>
	<!-- <AlertDialog.Trigger asChild let:builder>
	  <Button builders={[builder]} variant="outline">Show Dialog</Button>
	</AlertDialog.Trigger> -->
	<AlertDialog.Content>
	  <AlertDialog.Header>
		<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
		<AlertDialog.Description>
		  This action cannot be undone.
		</AlertDialog.Description>
	  </AlertDialog.Header>
	  <AlertDialog.Footer>
		<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
		<form
class="{deled ? 'hidden' : ''}"
	method="POST"
	action="?/edit_location"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		delAnim = true;

		return async ({ result, update }) => {
            toast.success(`Deleted ${location.name}`);
            delAnim = false;
            deled = true;
			dialogOpen = false;
			update();
		};
	}}
>
<input type="hidden" value={location.id} name="location_id" />
{#if delAnim}
			<Button disabled>
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			</Button>
		{:else}
		<Button>
			<button type="submit">Continue</button>
		</Button>
		{/if}
		
		</form>
	  </AlertDialog.Footer>
	</AlertDialog.Content>
  </AlertDialog.Root>