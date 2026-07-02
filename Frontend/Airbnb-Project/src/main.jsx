/* Import StrictMode application into the root HTML element
Imported React DOM to render the application
Imported global styles
*/
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import App from "./App.jsx"
import "./index.css"

// Render the React application into the root HTML element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>

)
