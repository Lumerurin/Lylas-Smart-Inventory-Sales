import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/admin/dashboard";
import CreateOrder from "./pages/admin/create-order";
import ProductsPage from "./pages/admin/products";
import NewProduct from "./pages/admin/products/new-product";
import InventoryPage from "./pages/admin/inventory";
import { LoginPage } from "./pages/login";
import EventInventoryPage from "./pages/admin/inventory/event-inventory";
import SalesTrackingPage from "./pages/admin/sales-tracking";
import CheckoutPage from "./pages/admin/create-order/checkout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login/" />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/create-order" element={<CreateOrder />} />
        <Route path="/admin/create-order/checkout" element={<CheckoutPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route
          path="/admin/inventory/event-inventory"
          element={<EventInventoryPage />}
        />
        <Route path="/admin/products/new-product" element={<NewProduct />} />
        <Route path="/admin/sales-tracking" element={<SalesTrackingPage />} />
        <Route path="/login/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
