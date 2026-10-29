import { store } from './core/store.js';
import { loadContent } from './core/content.js';
import { initRouter } from './core/router.js';

async function bootstrap() {
  try {
    store.init();
    await loadContent();
    initRouter();
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'screen-message';
      const p1 = document.createElement('p');
      p1.textContent = 'Error al iniciar la aplicación.';
      const p2 = document.createElement('p');
      const small = document.createElement('small');
      small.textContent = err.message || String(err);
      p2.appendChild(small);
      div.appendChild(p1);
      div.appendChild(p2);
      app.appendChild(div);
    }
  }
}

bootstrap();