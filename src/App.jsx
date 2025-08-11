import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import appStore from "./utils/appStore";
import Connections from "./components/Connections";
import Request from "./components/Request";
import Premium from "./components/Premium";
import PrivacyPolicy from "./footer/PrivacyPolicy";
import TermsAndConditions from "./footer/TermsAndConditions";
import CancellationAndRefundPolicy from "./footer/Cancellation";
import ShippingAndDeliveryPolicy from "./footer/Shipping";
import ContactUs from "./footer/ContactUs";
import Newsapp from "./components/News";
import Chat from "./components/Chat";
import MediaCentre from "./footer/MediaCentre";
import { createSocketConnection } from "./utils/socket";
import VideoCall from "./components/VideoCall";
import CodeConnectLandingPage from "./components/CodeConnectLandingPage";
import UserProfilePage from "./components/UserProfilePage";
import GithubCallback from "./components/GithubCallback";
const socket = createSocketConnection();
function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CodeConnectLandingPage />} />
                    <Route path="/login" element={<Login />} />
            <Route element={<Body />}>
              <Route path="/feed" element={<Feed />} />
                      <Route path="/profile/:userId" element={<UserProfilePage />} />
<Route path="/auth/github/callback" element={<GithubCallback />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/user/connections" element={<Connections />} />
              <Route path="/requests" element={<Request />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/cancellation-and-refund-policy" element={<CancellationAndRefundPolicy />} />
              <Route path="/shipping-and-delivery-policy" element={<ShippingAndDeliveryPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/tech-news" element={<Newsapp />} />
              <Route path="/media-centre" element={<MediaCentre />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/video-login" element={<VideoCall />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
};

export default App;
