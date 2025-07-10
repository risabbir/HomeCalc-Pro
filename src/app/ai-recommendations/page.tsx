import { AiRecommendations } from "@/components/calculators/AiRecommendations";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Calculator Recommendations',
    description: 'Describe your project and let our AI assistant recommend the perfect calculators to help you plan.',
};

export default function AiRecommendationsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <AiRecommendations />
        </div>
    );
}
