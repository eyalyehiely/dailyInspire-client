import React from "react";
import Layout from "../General/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Privacy Policy
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            At DailyInspire, we value your privacy and are committed to
            protecting your personal data. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our
            service.
          </p>
          <p className="text-gray-700 mb-4">
            By using DailyInspire, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We collect several types of information for various purposes to
            provide and improve our service to you:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">
              Personal Data: While using our service, we may ask you to provide
              certain personally identifiable information that can be used to
              contact or identify you, such as your email address and name.
            </li>
            <li className="mb-2">
              Usage Data: We may also collect information on how the service is
              accessed and used.
            </li>
            <li className="mb-2">
              Cookies Data: We use cookies and similar tracking technologies to
              track activity on our service and hold certain information.
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            DailyInspire uses the collected data for various purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">To provide and maintain our service</li>
            <li className="mb-2">To notify you about changes to our service</li>
            <li className="mb-2">To provide customer support</li>
            <li className="mb-2">
              To gather analysis or valuable information so that we can improve
              our service
            </li>
            <li className="mb-2">To monitor the usage of our service</li>
            <li className="mb-2">
              To detect, prevent and address technical issues
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            The security of your data is important to us, but remember that no
            method of transmission over the Internet or method of electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your personal data, we cannot guarantee
            its absolute security.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date at the top of this Privacy
            Policy.
          </p>
          <p className="text-gray-700 mb-4">
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="text-gray-700 font-medium">support@dailyinspire.com</p>
        </div>

        <p className="text-gray-500 text-center">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
