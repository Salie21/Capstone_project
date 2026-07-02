// Imports Router from react and pages from the project
import { Routes, Route, useLocation } from "react-router-dom"
import Header from "./Components/Header.jsx"
import Home from "./pages/Home.jsx"
import Locations from "./pages/Locations.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/admin/Dashboard.jsx"
import CreateListing from "./pages/admin/Createlisting.jsx"
import Reservations from "./pages/admin/Reservations.jsx"
import ViewListings from "./pages/admin/ViewListings.jsx"
import UpdateListing from "./pages/admin/UpdateListing.jsx"
import ProtectedRoute from "./Components/ProtectedRoute.jsx"
import LocationPage from "./pages/LocationPage.jsx"
import NotFound from "./pages/NotFoundPage.jsx"
import ListingDetails from "./pages/admin/ListingDetails.jsx"

//Defines all the loctaions used for the app
const locations = [
  'All locations',
  'Paris, France',
  'Rome, Italy',
  'New York, USA',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Rio de Janeiro, Brazil',
  'Santorini, Greece',
  'Bordeaux, France',
  'Cape Town, South Africa',
  'Johannesburg, South Africa',
  'Durban, South Africa',
  'Pretoria, South Africa',
  'Sandton, South Africa',
  'Hyde Park, South Africa',
  'Rosebank, South Africa',
]

function App() {
  const location = useLocation()
  const isHomePage = location.pathname === "/" || location.pathname === "/home"
  const isAdminPage = location.pathname.toLowerCase().startsWith("/admin")
  const isLoginPage = location.pathname.toLowerCase() === "/login"
  const isListingPage = location.pathname.toLowerCase().startsWith("/listing/")

  return (
    <></>
      {!isAdminPage && !isLoginPage && (
        <Header
          logoType={isHomePage ? "white" : "default"}
          variant={isHomePage ? "home" : "default"}
          locations={locations}
          compactSearch={isListingPage}
        />
      )}
  //Define all application routes
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['host']}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/create" element={<ProtectedRoute allowedRoles={['host']}><CreateListing /></ProtectedRoute>} />
        <Route path="/admin/listings" element={<ProtectedRoute allowedRoles={['host']}><ViewListings /></ProtectedRoute>} />
        <Route path="/admin/update/:id" element={<ProtectedRoute allowedRoles={['host']}><UpdateListing /></ProtectedRoute>} />
        <Route path="/admin/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
        <Route path="/locations/:location" element={<LocationPage />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
