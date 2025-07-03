import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import appStore from "./utils/appStore";
import CreateTeam from "./ems/CreateTeam";
import Connections from "./components/Connections";
import Request from "./components/Request";
import Premium from "./components/Premium";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import CancellationAndRefundPolicy from "./components/Cancellation";
import ShippingAndDeliveryPolicy from "./components/Shipping";
import ContactUs from "./components/ContactUs";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/connections" element={<Connections />} />
              <Route path="/requests" element={<Request/>} />
              <Route path="/create/team" element={<CreateTeam />} />
              <Route path="/premium" element={<Premium />} />
               <Route path="/privacy/policy" element={<PrivacyPolicy />} />
        <Route path="/terms/and/conditions" element={<TermsAndConditions />} />
        <Route path="/cancellation/and/refund/policy" element={<CancellationAndRefundPolicy />} />
        <Route path="/shipping/and/delivery/policy" element={<ShippingAndDeliveryPolicy />} />
        <Route path="/contact/us" element={<ContactUs />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
};

export default App;
