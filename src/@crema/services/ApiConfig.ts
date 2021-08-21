import axios from 'axios';
import {setupCache} from 'axios-cache-adapter';

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

export default axios.create({
  adapter: cache.adapter,

  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },

  cache: {
    exclude: {
      // Only exclude PUT, PATCH and DELETE methods from cache
      methods: ['post', 'put', 'patch', 'delete'],
    },
  },
});
