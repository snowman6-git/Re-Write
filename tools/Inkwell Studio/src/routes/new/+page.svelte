<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  async function new_book(event: Event) {
    event.preventDefault();
    await invoke("new_book");
  }
</script>

<style>
</style>