export const metadata = {
  title: "Privacy Policy | HomeCalc Pro",
  description: "Our Privacy Policy describes how your information is collected, used, and shared when you use HomeCalc Pro.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Privacy Policy</h1>

        <p><strong>Last Updated:</strong> July 7, 2025</p>

        <section>
          <h2 className="text-2xl font-bold font-headline">1. Introduction</h2>
          <p>
            Welcome to HomeCalc Pro ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">2. Information We Collect</h2>
          <p>
            We collect information that you voluntarily provide to us when you use our calculators. This includes the parameters you input, such as project dimensions, material choices, costs, and other relevant data points.
          </p>
          <p>
            This data is processed in real-time to perform the requested calculation. We do not store, save, or associate this input data with any personal identifiers after your session on the Site ends.
          </p>
        </section>

        <section className="mt-8">
           <h2 className="text-2xl font-bold font-headline">3. AI-Powered Features</h2>
           <p>
            Our Site uses AI-powered features to provide assistance and recommendations. When you use these features, the inputs you provide (such as text descriptions or calculation parameters) are sent to a third-party AI provider (Google's Gemini models) to generate a response.
          </p>
          <p>
            We do not include any personal identifying information in these requests. The data is used only to generate the AI response for your immediate use and is not used for any other purpose by us. For more information, please review the privacy policy of our AI provider.
           </p>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">4. Cookies and Tracking Technologies</h2>
           <p>
            We may use cookies and other tracking technologies to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
           </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">5. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">6. Policy for Children</h2>
          <p>
            We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">8. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: support@homecalcpro.com.
          </p>
        </section>
      </div>
    </div>
  );
}
