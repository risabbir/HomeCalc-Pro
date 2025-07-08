import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

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
        sheen: "No shine",
        durability: "Low",
        uses: "Ceilings, adult bedrooms, and other low-traffic areas. Excellent for hiding imperfections on walls.",
    },
    {
        name: "Eggshell",
        sheen: "Low sheen, like an eggshell",
        durability: "Medium",
        uses: "Living rooms, dining rooms, and hallways. Offers better washability than matte.",
    },
    {
        name: "Satin",
        sheen: "Soft, velvety sheen",
        durability: "Medium-High",
        uses: "The most popular choice for high-traffic areas like kitchens, bathrooms, and kids' rooms. It's durable and easy to clean.",
    },
    {
        name: "Semi-Gloss",
        sheen: "Sleek and radiant",
        durability: "High",
        uses: "Best for trim, doors, cabinets, and bathrooms. Very durable and moisture-resistant, but its shine will highlight imperfections.",
    },
    {
        name: "High-Gloss",
        sheen: "Very shiny and reflective",
        durability: "Very High",
        uses: "Used for high-impact areas like furniture, front doors, and decorative trim. The most durable and easiest to clean, but requires careful prep work as it shows every flaw.",
    },
];

export default function PaintFinishGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                     <Image 
                        src="https://placehold.co/1200x400.png"
                        alt="A wall with paint swatches of different finishes"
                        width={1200}
                        height={400}
                        className="rounded-lg mb-8 object-cover"
                        data-ai-hint="paint swatches"
                    />
                    <h1 className="text-4xl font-bold font-headline mb-4">Choosing the Right Paint Finish</h1>
                    <p className="text-lg text-muted-foreground mb-12">
                        The color of your paint is important, but the finish (or sheen) you choose is just as critical. The finish affects the paint's durability, washability, and how it looks on the wall. Using the right finish can make the difference between a room that looks great for years and one that needs a repaint sooner than you'd like.
                    </p>
                    
                    <h2>Understanding Sheen and Durability</h2>
                    <p>As a general rule, as the amount of sheen increases, so does the paint's durability and stain resistance. A higher sheen means the finish is harder and smoother, making it easier to clean. However, it also means it will reflect more light and highlight any imperfections on the surface.</p>
                </article>

                <Card className="mt-12">
                    <CardHeader>
                        <CardTitle>Paint Finish Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Finish Name</TableHead>
                                    <TableHead>Sheen Level</TableHead>
                                    <TableHead>Durability</TableHead>
                                    <TableHead>Best For</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {finishes.map((finish) => (
                                    <TableRow key={finish.name}>
                                        <TableCell className="font-medium">{finish.name}</TableCell>
                                        <TableCell>{finish.sheen}</TableCell>
                                        <TableCell>{finish.durability}</TableCell>
                                        <TableCell>{finish.uses}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card className="mt-16 bg-accent/50">
                    <CardHeader>
                        <CardTitle>Ready to Start Painting?</CardTitle>
                         <CardContent className="pt-4 px-0 pb-0">
                            <p className="text-muted-foreground">Now that you've chosen your finish, use our calculator to determine exactly how much paint you'll need for your project.</p>
                        </CardContent>
                    </CardHeader>
                    <CardFooter>
                        {relatedCalculators.map(calc => (
                            <Button asChild variant="outline" className="justify-start gap-4" key={calc.slug}>
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
