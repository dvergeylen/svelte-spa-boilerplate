/*
 * Users APP
 */

/* Components */
import Users from '../../components/Users.svelte';

const app = new Users({
  target: document.body,
  props: {
    name: 'Users',
  },
});

export default app;
