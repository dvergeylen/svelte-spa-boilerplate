/*
 * Static APP → When user isn't connected
 */

/* Components */
import Auth from '../../components/Auth.svelte';

const app = new Auth({
  target: document.getElementById('signin-container'),
  props: {},
});

export default app;
