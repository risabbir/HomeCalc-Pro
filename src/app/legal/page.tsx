

export const metadata = {
  title: "Terms of Service | HomeCalc Pro",
  description: "Review the Terms of Service for using the HomeCalc Pro website and tools.",
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">Terms of Service</h1>
        
        <p><strong>Last Updated:</strong> July 12, 2025</p>

        <section>
          <h2 className="text-2xl font-bold font-headline">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the HomeCalc Pro website and its associated tools (the "Service"), you agree to be bound by these Terms of Service ("Terms"), all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this Service.
          </p>
        </section>

        <section className="mt-8">
           <h2 className="text-2xl font-bold font-headline">2. Use License & Disclaimer of Accuracy</h2>
           <p>
            Permission is granted to temporarily use the calculators and information on HomeCalc Pro for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
           </p>
            <p>
            <strong>THE MATERIALS AND CALCULATORS ON THIS SERVICE ARE PROVIDED ON AN 'AS IS' BASIS.</strong> HomeCalc Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
           </p>
           <p>
            All calculation results are intended for **estimation purposes only**. They are not a substitute for professional advice from qualified experts such as contractors, engineers, or financial advisors. You should always consult with a licensed professional for critical projects. HomeCalc Pro does not accept any liability for loss or damage suffered as a result of using the calculators.
           </p>
        </section>

        <section className="mt-8">
            <h2 className="text-2xl font-bold font-headline">3. AI-Powered Features</h2>
            <p>
                Our Service includes features that utilize artificial intelligence ("AI") to provide suggestions, hints, and chatbot responses. These AI-generated responses are for informational purposes only and may contain inaccuracies. You must independently verify any information provided by the AI before relying on it for financial or safety-critical decisions.
            </p>
        </section>

        <section className="mt-8">
            <h2 className="text-2xl font-bold font-headline">4. Limitations of Liability</h2>
            <p>
                In no event shall HomeCalc Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service, even if HomeCalc Pro or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
        </section>

        <section className="mt-8">
            <h2 className="text-2xl font-bold font-headline">5. Modifications to Terms</h2>
            <p>
                HomeCalc Pro may revise these Terms of Service for its Service at any time without notice. By using this Service, you are agreeing to be bound by the then-current version of these Terms of Service.
            </p>
        </section>
        
        <section className="mt-8">
            <h2 className="text-2xl font-bold font-headline">6. Governing Law</h2>
            <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the website owner is based, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
        </section>

      </div>
    </div>
  );
}
