import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsPinterest,
} from "react-icons/bs";

const FooterComponent = () => {
  return (
    <Footer
      container
      className="border-t-4 border-gray-200 bg-gray-100 dark:bg-gray-800"
    >
      <div className="w-full p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Left Section */}
          <div>
            <Link to="/" className="inline-block">
              <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md font-semibold">
                ByteThoughts
              </div>
            </Link>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              Your daily dose of insights, stories, and ideas. Join the
              community!
            </p>
          </div>

          {/* Middle Section - Links */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Our Story</Footer.Link>
                <Footer.Link href="#">Team</Footer.Link>
                <Footer.Link href="#">Careers</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Help" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">FAQs</Footer.Link>
                <Footer.Link href="#">Contact Us</Footer.Link>
                <Footer.Link href="#">Support</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider className="my-6" />

        {/* Bottom Section */}
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="ByteThoughts"
            year={new Date().getFullYear()}
            className="text-gray-600 dark:text-gray-400"
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsPinterest} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
