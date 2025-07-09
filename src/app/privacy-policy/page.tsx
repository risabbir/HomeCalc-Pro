
export const metadata = {
  title: "Privacy Policy | HomeCalc Pro",
  description: "Our Privacy Policy describes how your information is collected, used, and shared when you use HomeCalc Pro.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Privacy Policy</h1>

        <p><strong>Last Updated:</strong> June 9, 2025</p>

        <section>
          <h2 className="text-2xl font-bold font-headline">1. Our Commitment to Privacy</h2>
          <p>
            Welcome to HomeCalc Pro ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website and tools (the "Service"). Please read this policy carefully. If you do not agree with these terms, please do not access the Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">2. Information We Process</h2>
          <p>
            We process information that you voluntarily provide when you use our calculators. This includes the parameters you input, such as project dimensions, material choices, and other data points.
          </p>
          <p>
            This data is processed in your browser or sent to our servers for real-time calculation. <strong>We do not store, save, or log this input data</strong> after your session on the Service ends. Your calculations are your own.
          </p>
        </section>

        <section className="mt-8">
           <h2 className="text-2xl font-bold font-headline">3. AI-Powered Features</h2>
           <p>
            Our Service uses AI-powered features (like the AI Assistant and chatbot) to provide assistance and recommendations. When you use these features, the inputs you provide (such as text descriptions or calculation parameters) are sent to a third-party AI provider (Google's Gemini models) to generate a response.
          </p>
          <p>
            We do not include any personal identifying information in these requests. The data is used only to generate the AI response for your immediate use and is not used for any other purpose by us or our provider.
           </p>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">4. Cookies and Tracking Technologies</h2>
           <p>
            We may use cookies and other standard web technologies to help customize the Service and improve your experience (e.g., remembering your theme preference). When you access the Service, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Service.
           </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">5. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to protect our Service. While we have taken reasonable steps to secure the platform, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">6. Policy for Children</h2>
          <p>
            Our Service is not intended for children under the age of 13, and we do not knowingly solicit information from or market to them. If you become aware of any data we have inadvertently collected from children under age 13, please contact us.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by a new "Last Updated" date. We encourage you to review this policy periodically to stay informed.
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
