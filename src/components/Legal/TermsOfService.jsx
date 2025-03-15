import React from "react";
import Layout from "../General/Layout";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Terms of Service
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Welcome to DailyInspire
          </h2>
          <p className="text-gray-700 mb-4">
            These terms and conditions outline the rules and regulations for the
            use of DailyInspire's website and services.
          </p>
          <p className="text-gray-700 mb-4">
            By accessing this website and using our services, we assume you
            accept these terms and conditions in full. Do not continue to use
            DailyInspire if you do not accept all of the terms and conditions
            stated on this page.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            License
          </h2>
          <p className="text-gray-700 mb-4">
            Unless otherwise stated, DailyInspire and/or its licensors own the
            intellectual property rights for all material on DailyInspire. All
            intellectual property rights are reserved. You may view and/or print
            pages from DailyInspire for your own personal use subject to
            restrictions set in these terms and conditions.
          </p>
          <p className="text-gray-700 mb-4">You must not:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li className="mb-2">Republish material from DailyInspire</li>
            <li className="mb-2">
              Sell, rent or sub-license material from DailyInspire
            </li>
            <li className="mb-2">
              Reproduce, duplicate or copy material from DailyInspire
            </li>
            <li className="mb-2">
              Redistribute content from DailyInspire (unless content is
              specifically made for redistribution)
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            User Account
          </h2>
          <p className="text-gray-700 mb-4">
            If you create an account with us, you are responsible for
            maintaining the security of your account, and you are fully
            responsible for all activities that occur under the account and any
            other actions taken in connection with it.
          </p>
          <p className="text-gray-700 mb-4">
            You must immediately notify DailyInspire of any unauthorized uses of
            your account or any other breaches of security. DailyInspire will
            not be liable for any acts or omissions by you, including any
            damages of any kind incurred as a result of such acts or omissions.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            In no event shall DailyInspire, nor any of its officers, directors
            and employees, be liable to you for anything arising out of or in
            any way connected with your use of this website, whether such
            liability is under contract, tort or otherwise.
          </p>
          <p className="text-gray-700 mb-4">
            DailyInspire, including its officers, directors and employees shall
            not be liable for any indirect, consequential or special liability
            arising out of or in any way related to your use of this website.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Indemnification
          </h2>
          <p className="text-gray-700 mb-4">
            You hereby indemnify to the fullest extent DailyInspire from and
            against any and all liabilities, costs, demands, causes of action,
            damages and expenses (including reasonable attorney's fees) arising
            out of or in any way related to your breach of any of the provisions
            of these Terms.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Severability
          </h2>
          <p className="text-gray-700 mb-4">
            If any provision of these Terms is found to be unenforceable or
            invalid under any applicable law, such unenforceability or
            invalidity shall not render these Terms unenforceable or invalid as
            a whole, and such provisions shall be deleted without affecting the
            remaining provisions herein.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Changes to Terms
          </h2>
          <p className="text-gray-700 mb-4">
            DailyInspire reserves the right to modify these terms at any time.
            If we make changes, we will provide notice of such changes by
            updating the date at the bottom of these terms and by providing
            additional notification as appropriate.
          </p>
          <p className="text-gray-700 mb-4">
            Your continued use of the platform following the posting of revised
            terms means that you accept and agree to the changes.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms, please contact us at:
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

export default TermsOfService;
