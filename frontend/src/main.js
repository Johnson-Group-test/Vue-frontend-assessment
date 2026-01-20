import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import styles in order
import './styles/variables.css';
import './styles/base.css';
import './styles/utilities.css';
import './style.css'; // Keep existing styles for backward compatibility

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
