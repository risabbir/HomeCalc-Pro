
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: 'A Homeowner\'s Guide to Paint Finishes | HomeCalc Pro',
    description: 'Learn the difference between paint finishes like matte, eggshell, satin, and semi-gloss to choose the perfect one for any room and surface in your home.',
};

const relevantCalculators = [
    'paint-coverage',
];

const finishes = [
    {
        name: "Matte (Flat)",
        sheen: "No Shine",
        durability: "Low",
        description: "Has a non-reflective, velvety texture that excels at hiding surface imperfections like bumps or patches. Its sophisticated look is perfect for low-traffic areas.",
        uses: ["Ceilings", "Adult Bedrooms", "Formal Dining Rooms"]
    },
    {
        name: "Eggshell",
        sheen: "Low Sheen",
        durability: "Medium",
        description: "Provides a soft glow, reminiscent of an eggshell. It's more washable and durable than matte, making it a popular, versatile choice for most living spaces.",
        uses: ["Living Rooms", "Hallways", "Entryways"]
    },
    {
        name: "Satin",
        sheen: "Soft Glow",
        durability: "Medium-High",
        description: "Often considered the best all-around finish. It offers a beautiful, pearl-like sheen and stands up well to cleaning and light scrubbing in moderately busy areas.",
        uses: ["Kitchens", "Family Rooms", "Kids' Rooms", "High-Traffic Areas"]
    },
    {
        name: "Semi-Gloss",
        sheen: "Noticeable Shine",
        durability: "High",
        description: "Sleek, radiant, and highly durable, this finish is moisture and stain-resistant, making it perfect for hardworking surfaces. Its shine will highlight any wall imperfections, so prep work is key.",
        uses: ["Trim & Molding", "Doors", "Cabinets", "Bathrooms"]
    },
    {
        name: "High-Gloss",
        sheen: "Very Shiny",
        durability: "Very High",
        description: "Creates a hard, ultra-shiny, light-reflecting surface like glass. It's the most durable and easiest to clean, but requires flawless surface preparation as it shows every flaw.",
        uses: ["Front Doors", "Furniture", "Accent Trim", "Architectural Details"]
    },
];

export default function PaintFinishGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Choosing the Right Paint Finish</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    The finish, or sheen, you choose is as important as the color. It affects the final look, durability, and cleanability of your walls. Use this guide to make the perfect choice for every surface.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12">
                <main className="lg:col-span-2">
                    <Alert className="mb-12">
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>The Golden Rule of Paint Sheen</AlertTitle>
                        <AlertDescription className="space-y-1">
                            <p><strong>Higher Sheen = Higher Durability & Shine.</strong> This makes it easy to clean, perfect for high-traffic or high-moisture areas like kitchens, bathrooms, and trim.</p>
                            <p><strong>Lower Sheen = Better at Hiding Imperfections.</strong> Its non-reflective nature conceals minor flaws in walls, making it ideal for living areas and ceilings.</p>
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {finishes.map((finish) => (
                            <Card key={finish.name} className="flex flex-col border-2">
                                <CardHeader>
                                    <CardTitle>{finish.name}</CardTitle>
                                    <CardDescription>{finish.sheen} | {finish.durability} Durability</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground text-sm">{finish.description}</p>
                                </CardContent>
                                <CardFooter className="flex-wrap gap-2">
                                    <p className="text-xs font-semibold mr-2">Best For:</p>
                                    {finish.uses.map(use => (
                                        <Badge key={use} variant="secondary">{use}</Badge>
                                    ))}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </main>

                 <aside className="lg:col-span-1">
                    <div className="sticky top-28">
                        <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Ready to Start Painting?</CardTitle>
                                 <CardDescription>Now that you've chosen your finish, use our calculator to determine exactly how much paint you'll need for your project.</CardDescription>
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
                    </div>
                </aside>
            </div>
        </div>
    )
}
