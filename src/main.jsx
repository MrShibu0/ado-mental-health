import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/i18n'
import { Loader } from './components/ui/Loader'
import { ImageCMSProvider } from './context/ImageCMSContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <ImageCMSProvider>
        <App />
      </ImageCMSProvider>
    </Suspense>
  </StrictMode>,
)
