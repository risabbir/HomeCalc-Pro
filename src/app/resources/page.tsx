import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ListChecks, Map, Ruler } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | HomeCalc Pro',
  description: 'Helpful guides, checklists, and resources to help you plan and execute your home projects with confidence.',
};

const resources = [
    {
        title: "U.S. Climate Zone Map",
        description: "Find your climate zone to get accurate recommendations for HVAC and insulation calculators.",
        href: "/resources/climate-zone-map",
        Icon: Map,
    },
    {
        title: "How to Measure a Room",
        description: "Learn the proper way to measure a room's dimensions for paint, flooring, or wallpaper.",
        href: "/resources/how-to-measure",
        Icon: Ruler,
    },
    {
        title: "Deck Building Checklist",
        description: "A step-by-step checklist to ensure your deck building project goes smoothly from start to finish.",
        href: "/resources/deck-checklist",
        Icon: ListChecks,
    },
]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-4">Helpful Resources</h1>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Planning is the key to a successful project. Use these guides and checklists to help you get started right.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
                <Link href={resource.href} key={resource.title} className="group flex">
                    <Card className="h-full w-full bg-card transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/50 flex flex-col justify-between">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-secondary p-3 rounded-lg">
                                    <resource.Icon className="h-8 w-8 text-primary" />
                                </div>
                                <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </div>
                            <CardTitle className="font-headline text-xl">{resource.title}</CardTitle>
                            <CardDescription className="pt-2">{resource.description}</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>

      </div>
    </div>
  );
}
