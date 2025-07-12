
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Ruler } from "lucide-react";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";

export const metadata: Metadata = {
    title: 'Kitchen Layout Planning Guide (5 Common Designs) | HomeCalc Pro',
    description: 'Discover the fundamental principles of kitchen design, including the work triangle and 5 common layouts, to plan a beautiful and functional space.',
};

const relevantCalculators = [
    'kitchen-remodel-cost',
    'flooring-area',
    'paint-coverage',
];

const layouts = [
    {
        name: "Galley Kitchen",
        description: "Two parallel walls with a walkway in between. Highly efficient for a single cook, making great use of a smaller, narrow space.",
        pros: "Very efficient workflow, compact footprint.",
        cons: "Can feel cramped, not ideal for multiple cooks.",
        diagram: <div className="h-32 w-full bg-secondary/50 border rounded-lg p-4 flex flex-col justify-between">
            <div className="h-8 bg-background border rounded"></div>
            <div className="h-8 bg-background border rounded"></div>
        </div>
    },
    {
        name: "L-Shaped Kitchen",
        description: "Two perpendicular walls of cabinets and appliances. A versatile layout that opens up the kitchen to adjacent dining or living areas.",
        pros: "Good work triangle, open and social.",
        cons: "Corner cabinet can be inefficient without smart storage.",
        diagram: <div className="h-32 w-full bg-secondary/50 border rounded-lg p-4 relative">
            <div className="absolute top-4 left-4 h-8 w-[calc(100%-2rem)] bg-background border rounded"></div>
            <div className="absolute top-4 left-4 h-[calc(100%-2rem)] w-8 bg-background border rounded"></div>
        </div>
    },
    {
        name: "U-Shaped Kitchen",
        description: "Cabinets and appliances are arranged along three walls. This layout offers abundant storage and counter space.",
        pros: "Maximum storage and counter space, keeps traffic out.",
        cons: "Can feel enclosed, requires a larger room.",
        diagram: <div className="h-32 w-full bg-secondary/50 border rounded-lg p-4 relative">
            <div className="absolute top-4 left-4 w-8 h-[calc(100%-2rem)] bg-background border rounded"></div>
            <div className="absolute bottom-4 left-4 h-8 w-[calc(100%-2rem)] bg-background border rounded"></div>
            <div className="absolute top-4 right-4 w-8 h-[calc(100%-2rem)] bg-background border rounded"></div>
        </div>
    },
    {
        name: "Island Kitchen",
        description: "An L-shaped or U-shaped kitchen with a separate, freestanding island. The island can provide extra prep space, storage, or seating.",
        pros: "Very social, adds functionality, focal point.",
        cons: "Requires a lot of space, can disrupt workflow if placed incorrectly.",
        diagram: <div className="h-32 w-full bg-secondary/50 border rounded-lg p-4 relative">
            <div className="absolute top-4 left-4 h-8 w-[calc(100%-2rem)] bg-background border rounded"></div>
            <div className="absolute top-4 left-4 h-[calc(100%-2rem)] w-8 bg-background border rounded"></div>
            <div className="absolute bottom-8 right-8 h-8 w-1/2 bg-background border rounded"></div>
        </div>
    },
];

export default function KitchenLayoutGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Planning Your Perfect Kitchen Layout</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    A great kitchen starts with a great layout. Understanding the basics of workflow and space will help you create a room that's both beautiful and functional.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2">
                    <Alert className="mb-12">
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle as="h2">The Kitchen Work Triangle</AlertTitle>
                        <AlertDescription>
                            A core principle of kitchen design connects the three main work areas: the sink, the refrigerator, and the stove. For an efficient kitchen, the total distance between these three points should generally be no more than 26 feet, with no single leg of the triangle shorter than 4 feet or longer than 9 feet.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {layouts.map((layout) => (
                            <Card key={layout.name} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle as="h3">{layout.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    {layout.diagram}
                                    <p className="text-muted-foreground text-sm">{layout.description}</p>
                                    <div>
                                        <p className="text-sm"><strong>Pros:</strong> {layout.pros}</p>
                                        <p className="text-sm"><strong>Cons:</strong> {layout.cons}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="mb-12">
                        <CardHeader>
                            <CardTitle as="h2" className="flex items-center gap-2"><Ruler/>Key Measurement Guidelines</CardTitle>
                            <CardDescription>Keep these standard clearances in mind for a comfortable and safe kitchen.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                <li><strong>Walkways:</strong> Should be at least 36 inches wide. In the main cooking zone, 42-48 inches is ideal, especially for a two-cook kitchen.</li>
                                <li><strong>Countertop Height:</strong> Standard height is 36 inches from the floor.</li>
                                <li><strong>Space between Counters and Cabinets:</strong> Aim for at least 15-18 inches of clearance between your countertops and the bottom of your upper cabinets.</li>
                                <li><strong>Island Clearance:</strong> Ensure at least 36-42 inches of clearance on all sides of a kitchen island for comfortable movement and appliance access.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </main>

                <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Start Budgeting Your Remodel</CardTitle>
                                <CardDescription>Now that you have layout ideas, use our calculators to start planning your project.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4">
                                {relatedCalculators.map(calc => (
                                    <Button asChild variant="outline" className="justify-start gap-4 bg-background" key={calc.slug}>
                                        <Link href={`/calculators/${calc.slug}`}>
                                            <calc.Icon className="h-5 w-5 text-primary" />
                                            {calc.name}
                                        </Link>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                        <ReportAnIssue />
                    </div>
                </aside>
            </div>
        </div>
    )
}
