<script>
  import { onMount } from 'svelte';
  import {
    configureClient,
    isAuthenticated,
    login,
    logout,
  } from '../javascripts/utils/auth0';
  import { path2url } from '../javascripts/utils/helpers';

  let authenticated = false;

  onMount(async () => {
    await configureClient();
    authenticated = await isAuthenticated();
  });
</script>

<div class="buttons">
  <button id="sign-in" class="button is-link" class:is-hidden="{authenticated}"
    on:click={async () => await login(path2url('users.html'))}>
    <span class="icon is-small">
      <i class="fas fa-sign-in"></i>
    </span>
    <span>
      Sign In
    </span>
  </button>
  <button id="sign-out" class="button is-link" class:is-hidden="{!authenticated}" on:click={logout}>
    <span class="icon is-small">
      <i class="fas fa-sign-out"></i>
    </span>
    <span>
      Sign Out
    </span>
  </button>
  <button class="button is-link is-outlined" class:is-hidden="{authenticated}"
    on:click={async () => await login(path2url('users.html'))}>
    <span class="icon is-small">
      <i class="fas fa-sign-in-alt"></i>
    </span>
    <span>
      Sign Up
    </span>
  </button>
</div>

<style lang='scss'>
</style>