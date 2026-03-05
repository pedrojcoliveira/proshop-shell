import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const MonolithFrame = () => {
  const location = useLocation();
  const iframeRef = useRef(null);
  
  const iframeUrl = `http://localhost:3001${location.pathname}${location.search}`;
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const handleLoad = () => {
      // Enviar dados de localStorage para iframe
      const cart = localStorage.getItem('cart');
      const userInfo = localStorage.getItem('userInfo');
      
      iframe.contentWindow.postMessage({
        type: 'SYNC_STORAGE',
        cart: cart,
        userInfo: userInfo
      }, 'http://localhost:3001');
      
      console.log('Shell enviou dados para iframe:', { cart: cart ? 'SIM' : 'NÃO', userInfo: userInfo ? 'SIM' : 'NÃO' });
    };
    
    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [location.pathname]);
  
  return (
    <iframe
      ref={iframeRef}
      src={iframeUrl}
      style={{
        width: "100%",
        minHeight: "calc(100vh - 150px)",
        border: "none",
        display: "block",
      }}
      title="ProShop Content"
    />
  );
};

export default MonolithFrame;
