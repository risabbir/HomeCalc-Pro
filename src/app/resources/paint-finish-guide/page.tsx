import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { Paintbrush, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: 'Paint Finish Guide | HomeCalc Pro',
    description: 'Learn the difference between paint finishes like matte, eggshell, and semi-gloss to choose the right one for your project.',
};

const relevantCalculators = [
    'paint-coverage',
];

const finishes = [
    {
        name: "Matte (or Flat)",
        sheen: "No Shine",
        durability: "Low",
        description: "Hides imperfections on walls beautifully, making it ideal for low-traffic areas like adult bedrooms and formal dining rooms. Not easily cleanable.",
        uses: ["Ceilings", "Adult Bedrooms", "Low-Traffic Areas"]
    },
    {
        name: "Eggshell",
        sheen: "Low Sheen",
        durability: "Medium",
        description: "Offers a soft, low-sheen finish that's more durable and washable than matte. A great middle-ground for most rooms in the house.",
        uses: ["Living Rooms", "Hallways", "Dining Rooms"]
    },
    {
        name: "Satin",
        sheen: "Soft Glow",
        durability: "Medium-High",
        description: "The most popular choice for its balance of a soft sheen and good durability. It stands up to cleaning and light scrubbing.",
        uses: ["Kitchens", "Bathrooms", "Kids' Rooms", "High-Traffic Areas"]
    },
    {
        name: "Semi-Gloss",
        sheen: "Noticeable Shine",
        durability: "High",
        description: "Sleek and durable, this finish is highly resistant to moisture and stains, making it perfect for hardworking surfaces. Its shine will highlight imperfections.",
        uses: ["Trim & Molding", "Doors", "Cabinets", "Bathrooms"]
    },
    {
        name: "High-Gloss",
        sheen: "Very Shiny",
        durability: "Very High",
        description: "Creates a hard, ultra-shiny, light-reflecting surface. It's the most durable and easiest to clean, but requires meticulous surface prep.",
        uses: ["Front Doors", "Furniture", "Accent Trim"]
    },
];

export default function PaintFinishGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Paintbrush className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Choosing the Right Paint Finish</h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        The finish, or sheen, you choose is as important as the color. It affects durability, cleanability, and the final look of your room. Use this guide to make the perfect choice.
                    </p>
                </div>
                
                 <Card className="mb-12">
                    <CardContent className="p-0 overflow-hidden rounded-lg">
                        <Image 
                            src="https://placehold.co/1200x500.png"
                            alt="A wall with paint swatches of different finishes, from matte to high-gloss"
                            width={1200}
                            height={500}
                            className="w-full h-auto object-cover"
                            data-ai-hint="paint swatches wall"
                        />
                    </CardContent>
                 </Card>

                <Alert className="mb-12">
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>The Basic Rule of Thumb</AlertTitle>
                    <AlertDescription>
                        Higher Sheen = Higher Durability & Shine. Lower Sheen = Better at Hiding Imperfections.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {finishes.map((finish) => (
                        <Card key={finish.name} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{finish.name}</CardTitle>
                                <CardDescription>{finish.sheen} | {finish.durability} Durability</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground text-sm">{finish.description}</p>
                            </CardContent>
                            <CardFooter className="flex-wrap gap-2">
                                {finish.uses.map(use => (
                                    <Badge key={use} variant="secondary">{use}</Badge>
                                ))}
                            </CardFooter>
                        </Card>
                    ))}
                </div>


                 <Card className="mt-16 bg-secondary">
                    <CardHeader>
                        <CardTitle>Ready to Start Painting?</CardTitle>
                         <CardDescription>Now that you've chosen your finish, use our calculator to determine exactly how much paint you'll need for your project.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        {relatedCalculators.map(calc => (
                            <Button asChild variant="outline" className="justify-start gap-4 bg-background" key={calc.slug}>
                                <Link href={`/calculators/${calc.slug}`}>
                                    <calc.Icon className="h-5 w-5 text-primary" />
                                    {calc.name}
                                </Link>
                            </Button>
                        ))}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}