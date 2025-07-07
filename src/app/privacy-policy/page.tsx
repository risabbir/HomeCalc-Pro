
export const metadata = {
  title: "Privacy Policy | HomeCalc Pro",
  description: "Our Privacy Policy describes how your information is collected, used, and shared when you use HomeCalc Pro.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Privacy Policy</h1>

        <p><strong>Last Updated:</strong> October 26, 2023</p>

        <section>
          <h2 className="text-2xl font-bold font-headline">Introduction</h2>
          <p>
            Welcome to HomeCalc Pro. We are committed to protecting your privacy. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our website (the "Site").
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">Information We Collect</h2>
          <p>
            When you use our calculators, we collect the data you input, such as project dimensions, material choices, and other parameters. We use this information solely to perform the requested calculations and provide you with accurate results.
          </p>
          <p>
            This data is processed in real-time and is not stored, saved, or associated with any personal identifiers after your session on the Site ends.
          </p>
        </section>

        <section className="mt-8">
           <h2 className="text-2xl font-bold font-headline">AI-Powered Features</h2>
           <p>
            Our Site uses AI-powered features to provide assistance and recommendations. When you use these features, the inputs you provide (such as text descriptions or calculation parameters) are sent to a third-party AI provider (Google's Gemini models) to generate a response.
          </p>
          <p>
            We do not include any personal identifying information in these requests. The data is used only to generate the AI response for your immediate use and is not used for any other purpose.
           </p>
        </section>
        
        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">How We Use Your Information</h2>
           <p>
            The information you provide is used exclusively for the following purposes:
           </p>
           <ul>
                <li>To operate and maintain the functionality of our calculators.</li>
                <li>To provide AI-assisted hints and recommendations.</li>
                <li>To understand usage patterns and improve our Site and services. All such analysis is done on aggregated, anonymous data.</li>
           </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">Sharing Your Information</h2>
           <p>
            We do not sell, trade, or otherwise transfer your information to outside parties, except for the purpose of providing the service as described above (e.g., sending data to our AI provider to generate a response). We do not store your calculation inputs.
           </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">Data Security</h2>
          <p>
            We take reasonable measures to protect the information transmitted through our Site. However, no internet-based site can be 100% secure, and we cannot guarantee the security of your information.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons. We encourage you to review this page periodically for the latest information on our privacy practices.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold font-headline">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@homecalcpro.com.
          </p>
        </section>

      </div>
    </div>
  );
}
