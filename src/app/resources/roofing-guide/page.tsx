
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Roofing Materials and Installation Guide | HomeCalc Pro',
    description: 'Learn about different roofing materials like asphalt shingles, metal, and tile. Understand roof pitch and the essential components of a roofing system.',
};

const relevantCalculators = ['roofing-materials'];

export default function RoofingGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Roofing Materials & Installation Guide</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    A new roof is a major investment. Understanding the basics of materials, pitch, and the installation process will help you make informed decisions for your home.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Common Roofing Materials</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Asphalt Shingles</h3>
                                <p className="text-muted-foreground">The most popular roofing material in North America. They are affordable, come in many styles and colors, and are relatively easy to install. Lifespan is typically 20-30 years.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Metal Roofing</h3>
                                <p className="text-muted-foreground">Known for its durability, longevity (50+ years), and energy efficiency. Available in panels or shingles. Higher initial cost but low maintenance.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">Clay or Concrete Tiles</h3>
                                <p className="text-muted-foreground">Extremely durable and fire-resistant, offering a classic look for specific architectural styles (like Spanish or Mediterranean). They are heavy and require reinforced roof framing.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Slate</h3>
                                <p className="text-muted-foreground">A premium, natural material with a lifespan of over 100 years. It's beautiful, but also very heavy, expensive, and requires specialized installation.</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Understanding Roof Pitch</CardTitle>
                            <CardDescription>
                                Roof pitch (or slope) is the steepness of your roof. It's expressed as a ratio of vertical rise to horizontal run, like 6/12.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">A 6/12 pitch means the roof rises 6 inches for every 12 inches it runs horizontally. Pitch is crucial because:</p>
                             <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                <li>It determines which roofing materials are suitable (some materials can't be used on low-slope roofs).</li>
                                <li>It significantly affects the total surface area of your roof. A steeper pitch means more surface area and requires more materials.</li>
                                <li>It impacts water and snow shedding.</li>
                            </ul>
                        </CardContent>
                    </Card>

                     <Alert variant="destructive">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle as="h3">Safety First: Hire a Professional</AlertTitle>
                         <AlertDescription>
                            Roofing is one of the most dangerous home improvement projects. It involves working at heights, lifting heavy materials, and using specialized tools. For safety and warranty purposes, it is almost always best to hire a licensed and insured roofing contractor.
                         </AlertDescription>
                    </Alert>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Plan Your Project</CardTitle>
                                <CardDescription>Estimate your material needs with our calculator.</CardDescription>
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
    );
}
