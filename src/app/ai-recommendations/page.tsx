
import { AiRecommendations } from "@/components/calculators/AiRecommendations";
import type { Metadata } from 'next';
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";

export const metadata: Metadata = {
    title: 'AI Project Assistant | Calculator Recommendations',
    description: 'Not sure where to start? Describe your home project to our AI assistant and get instant recommendations for the most relevant calculators to help you plan.',
};

export default function AiRecommendationsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <AiRecommendations />
            <div className="max-w-2xl mx-auto">
                <ReportAnIssue />
            </div>
        </div>
    );
}
