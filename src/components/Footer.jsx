import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" left-0 right-0 bg-white text-gray-800 py-10 px-6 md:px-20 shadow-inner z-50">
      <div className="max-w-6xl mx-auto">

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          <button className="text-gray-800 hover:text-blue-600 text-xl transition-all duration-300" aria-label="Facebook">
            <FaFacebookF />
          </button>
          <button className="text-gray-800 hover:text-pink-500 text-xl transition-all duration-300" aria-label="Instagram">
            <FaInstagram />
          </button>
          <button className="text-gray-800 hover:text-blue-400 text-xl transition-all duration-300" aria-label="Twitter">
            <FaTwitter />
          </button>
          <button className="text-gray-800 hover:text-red-600 text-xl transition-all duration-300" aria-label="YouTube">
            <FaYoutube />
          </button>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm text-center">
          <ul className="space-y-3">
            <li><button className="hover:underline">Audio Description</button></li>
            <li><button className="hover:underline">Investor Relations</button></li>
            <li><button className="hover:underline">Legal Notices</button></li>
          </ul>
          <ul className="space-y-3">
            <li><button className="hover:underline">Help Centre</button></li>
            <li><button className="hover:underline">Jobs</button></li>
            <li><button className="hover:underline">Cookie Preferences</button></li>
          </ul>
     <ul className="space-y-3">
            <li><button className="hover:underline">Gift Cards</button></li>
            <li>
              <Link to="/terms/and/conditions" className="hover:underline">
                Terms and Conditions
              </Link>
            </li>
            <li><button className="hover:underline">Corporate Information</button></li>
          </ul>

          <ul className="space-y-3">
            <li><button className="hover:underline">Media Centre</button></li>
            <li>
              <Link to="/privacy/policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/contact/us" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>

  <div className="mt-6 text-center text-sm space-x-4">
          <Link to="/cancellation/and/refund/policy" className="hover:underline">
            Cancellation & Refund Policy
          </Link>
          <Link to="/shipping/and/delivery/policy" className="hover:underline">
            Shipping & Delivery Policy
          </Link>
        </div>


        </div>

        {/* Service Code Button */}
        <div className="mt-6 flex justify-center">
          <button className="border border-gray-800 text-gray-800 py-2 px-4 text-sm hover:bg-gray-700 hover:text-white transition-all duration-300">
            Service Code
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-xs text-gray-800">
          © 2025 codeConnect. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
