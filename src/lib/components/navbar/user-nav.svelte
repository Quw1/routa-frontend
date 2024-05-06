<script lang="ts">
	// import AvatarImgs from "$lib/img/avatars/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import { goto } from "$app/navigation";
	export let data;
	const email = data.user.email;
	const username = data.user.username;
	
	async function logOut() {
		const res = await fetch(`/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
            body: '',
		});
		goto('/login');
	}

	async function changePassword() {
		const res = await fetch(`/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
            body: '',
		});
		goto('/login');
	}

	const avatarName = () => {
		const sp = username.split(" ");
		let av;
		if (sp.length > 1) {
			av = sp[0][0] + sp[1][0];
		}
		else {
			av = username[0] + username[1];
		}
		return av.toUpperCase();
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src={'https://raw.githubusercontent.com/huntabyte/shadcn-svelte/main/apps/www/src/lib/img/avatars/04.png'} alt="@shadcn" />
				<Avatar.Fallback>{avatarName()}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{username}</p>
				<p class="text-xs leading-none text-muted-foreground">{email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<!--<DropdownMenu.Group>
			<DropdownMenu.Item on:click= {() => changePassword()}>
				Change password
				 <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group> 
		<DropdownMenu.Separator />-->
		<DropdownMenu.Item on:click= {() => logOut()}>
			Log out

			<!-- <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut> -->
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>