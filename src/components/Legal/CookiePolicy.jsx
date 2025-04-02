import React from "react";
import Layout from "../General/Layout";

const CookiePolicy = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Cookie Policy
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            What Are Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            Cookies are small pieces of text sent to your web browser by a
            website you visit. A cookie file is stored in your web browser and
            allows the service or a third-party to recognize you and make your
            next visit easier and the service more useful to you.
          </p>
          <p className="text-gray-700 mb-4">
            Cookies can be "persistent" or "session" cookies. Persistent cookies
            remain on your personal computer or mobile device when you go
            offline, while session cookies are deleted as soon as you close your
            web browser.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            How DailyInspire Uses Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            When you use and access DailyInspire, we may place a number of
            cookies files in your web browser.
          </p>
          <p className="text-gray-700 mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">To enable certain functions of the service</li>
            <li className="mb-2">To provide analytics</li>
            <li className="mb-2">To store your preferences</li>
            <li className="mb-2">
              To enable advertisements delivery, including behavioral
              advertising
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            We use both session and persistent cookies on the service and we use
            different types of cookies to run the service:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Essential cookies. We may use essential cookies to authenticate
              users and prevent fraudulent use of user accounts.
            </li>
            <li className="mb-2">
              Preferences cookies. We may use preferences cookies to remember
              information that changes the way the service behaves or looks,
              such as the "remember me" functionality.
            </li>
            <li className="mb-2">
              Analytics cookies. We may use analytics cookies to track
              information about how the service is used so that we can make
              improvements.
            </li>
            <li className="mb-2">
              Marketing cookies. These are used to track visitors across
              websites. The intention is to display ads that are relevant and
              engaging for the individual user.
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Third-Party Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            In addition to our own cookies, we may also use various
            third-parties cookies to report usage statistics of the service,
            deliver advertisements on and through the service, and so on.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            What Are Your Choices Regarding Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            If you'd like to delete cookies or instruct your web browser to
            delete or refuse cookies, please visit the help pages of your web
            browser.
          </p>
          <p className="text-gray-700 mb-4">
            Please note, however, that if you delete cookies or refuse to accept
            them, you might not be able to use all of the features we offer, you
            may not be able to store your preferences, and some of our pages
            might not display properly.
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              For the Chrome web browser, please visit this page from Google:{" "}
              <a
                href="https://support.google.com/accounts/answer/32050"
                className="text-indigo-600 hover:underline"
              >
                https://support.google.com/accounts/answer/32050
              </a>
            </li>
            <li className="mb-2">
              For the Firefox web browser, please visit this page from Mozilla:{" "}
              <a
                href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored"
                className="text-indigo-600 hover:underline"
              >
                https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
              </a>
            </li>
            <li className="mb-2">
              For the Safari web browser, please visit this page from Apple:{" "}
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                className="text-indigo-600 hover:underline"
              >
                https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
              </a>
            </li>
            <li className="mb-2">
              For any other web browser, please visit your web browser's
              official web pages.
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Changes to This Cookie Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update our Cookie Policy from time to time. We will notify
            you of any changes by posting the new Cookie Policy on this page.
          </p>
          <p className="text-gray-700 mb-4">
            You are advised to review this Cookie Policy periodically for any
            changes. Changes to this Cookie Policy are effective when they are
            posted on this page.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about our Cookie Policy, please contact us
            at:
          </p>
          <p className="text-gray-700 font-medium">support@dailyinspire.xyz</p>
        </div>

        <p className="text-gray-500 text-center">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </Layout>
  );
};

export default CookiePolicy;
