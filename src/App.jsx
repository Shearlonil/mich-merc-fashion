import { Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Product from "./Routes/Product";
import Category from "./Routes/Category";
import Shop from "./Routes/Shop";
import Dashboard from "./Routes/Dashboard";
import ViewItems from "./Routes/ViewItems";
import CreateItems from "./Routes/CreateItems";
import Orders from "./Routes/Orders";
import ChangePw from "./Routes/ChangePw";
import ViewItemsDetails from "./Routes/ViewItemsDetails";
import CheckoutSuccess from "./Routes/CheckoutSuccess";
import Cart from "./Routes/Cart";
import NavBar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./Routes/ProtectedRoute";
import Login from "./Routes/Login";
import OrderDetails from "./Routes/OrderDetails";
import PageNotFound from "./Routes/PageNotFound";
import Discount from "./Routes/Discounts";
import ReviewTermsAndAgreement from "./Routes/ReviewTermsAndAgreement";
import TermsAndAgreement from "./Routes/tc";

function App() {
  return (
    <div>
      <div className="d-flex flex-column" style={{ minHeight: "80vh" }}>
        <NavBar />
        <Routes>
          <Route index path={"/"} element={<Home />} />
          <Route index path={"/terms"} element={<TermsAndAgreement />} />
          <Route path="/about" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/checkout-success" element={<CheckoutSuccess />} />

          {/* Shop */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Category />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route path="/dashboard/view-items" element={<ViewItems />} />
            <Route path="/dashboard/discounts" element={<Discount />} />
            <Route path="/dashboard/tc" element={<ReviewTermsAndAgreement />} />
            <Route
              path="/dashboard/view-items/details/:id"
              element={<ViewItemsDetails />}
            />
            <Route path="/dashboard/create-items" element={<CreateItems />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route
              // order_id represent purchase id
              path="/dashboard/orders/:order_id"
              element={<OrderDetails />}
            />
            <Route path="/dashboard/pw" element={<ChangePw />} />
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <div className="mt-auSto">
        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
