<script>
	import '../app.pcss';
    // @ts-ignore
    import { Nav } from "$lib/components/navbar/index.ts";
	import { Toaster } from 'svelte-sonner';
</script>

<Nav/>

<div class="flex-1 space-y-4 p-8 pt-6">
<slot />
<Toaster />
</div>
