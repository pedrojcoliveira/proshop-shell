// Event Bus centralizado, que é acessível por todos os MFEs via window.__eventBus
// O emissor não conhece os consumidores
// Qualquer MFE pode subscrever

const eventBus = {
  publish: (event, data) => {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  subscribe: (event, callback) => {
    window.addEventListener(event, callback);
  },
  unsubscribe: (event, callback) => {
    window.removeEventListener(event, callback);
  },
};

window.__eventBus = eventBus;

export default eventBus;
