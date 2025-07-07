export const metadata = {
  title: "Legal Information | HomeCalc Pro",
  description: "Legal information including Privacy Policy and Terms of Service.",
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Legal Information</h1>
        
        <section>
          <h2 className="text-2xl font-bold font-headline">Privacy Policy</h2>
          <p>
            This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use HomeCalc Pro.
          </p>
          <p>
            <strong>Personal Information We Collect</strong><br/>
            When you use our calculators, we may collect information you provide, such as project dimensions and parameters. We use this information solely to perform the requested calculations. We do not store this information after your session ends.
          </p>
           <p>
            <strong>AI Features</strong><br/>
            When using AI-powered features, your inputs are sent to a third-party AI provider (e.g., Google) to generate responses. We do not include any personal identifying information in these requests.
          </p>
          <p>
            <strong>Changes</strong><br/>
            We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
          </p>
        </section>

        <section className="mt-12">
           <h2 className="text-2xl font-bold font-headline">Terms of Service</h2>
           <p>
            By accessing the website at HomeCalc Pro, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
           </p>
           <p>
            <strong>Use License</strong><br/>
            Permission is granted to temporarily download one copy of the materials (information or software) on HomeCalc Pro's website for personal, non-commercial transitory viewing only.
           </p>
            <p>
            <strong>Disclaimer</strong><br/>
            The materials on HomeCalc Pro's website are provided on an 'as is' basis. HomeCalc Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. The calculators are for estimation purposes only and should not be used as a substitute for professional advice.
           </p>
        </section>

      </div>
    </div>
  );
}
