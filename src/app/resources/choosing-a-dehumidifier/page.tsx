
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { Lightbulb, AlertTriangle, Droplets } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Choosing the Right Dehumidifier for Your Home',
    description: 'A complete guide to selecting the correct dehumidifier size. Learn about pint capacity, new vs. old sizing standards, and features like auto-draining.',
};

const relevantCalculators = ['dehumidifier-size'];

export default function DehumidifierGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Choosing the Right Dehumidifier</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    High humidity can make your home uncomfortable and lead to problems like mold and mildew. A dehumidifier is the solution, but choosing the right size is critical for it to be effective.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                     <Alert className="border-l-4 border-primary">
                        <Droplets className="h-4 w-4" />
                        <AlertTitle as="h2">The New DOE Sizing Standard (2019)</AlertTitle>
                        <AlertDescription>
                            <p>Dehumidifier testing standards changed in 2019. New models are tested at a lower, more realistic temperature (65°F vs. 80°F), so their pint capacity ratings appear lower. The key takeaway is:</p>
                            <p className="font-bold mt-2">A new 35-pint model is roughly equivalent to an old 50-pint model.</p>
                            <p className="text-xs mt-1">Our calculator uses the older, more commonly understood sizing convention, but be aware of this change when shopping.</p>
                        </AlertDescription>
                    </Alert>
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Sizing Your Dehumidifier</CardTitle>
                             <CardDescription>Sizing depends on two main factors: the square footage of the space and its initial moisture level.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold mb-2">1. Determine the Moisture Level:</h3>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                <li><strong>Moderately Damp:</strong> The air feels clammy or sticky, and you may notice a slight musty odor.</li>
                                <li><strong>Very Damp:</strong> The air smells musty, and you see dark stains on walls or floors.</li>
                                <li><strong>Wet:</strong> You can see moisture beads (condensation) on walls or floors, or you experience some seepage.</li>
                                <li><strong>Extremely Wet:</strong> The area has standing water or obvious, active leaks. (You should fix leaks before running a dehumidifier).</li>
                            </ul>
                            <h3 className="font-semibold mt-4 mb-2">2. Measure the Area:</h3>
                            <p className="text-muted-foreground">Calculate the square footage (length x width) of the room you need to treat. For oddly shaped rooms, break them into smaller rectangles and add the areas together.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Essential Dehumidifier Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Continuous Draining</h3>
                                <p className="text-muted-foreground">Constantly emptying a collection bucket is a chore. Look for models with a connection for a standard garden hose to allow for continuous, gravity-fed draining into a floor drain or sump pump.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Built-in Pump</h3>
                                <p className="text-muted-foreground">If you need to drain water upwards (e.g., into a utility sink), a model with a built-in condensate pump is a must-have feature. It provides much more flexibility for placement.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">Humidistat</h3>
                                <p className="text-muted-foreground">An adjustable humidistat allows you to set your desired humidity level (typically 45-50%). The unit will automatically cycle on and off to maintain that level, saving energy and preventing the air from becoming too dry.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Auto-Defrost</h3>
                                <p className="text-muted-foreground">Essential for use in cool spaces like basements. This feature prevents the unit's coils from icing over when operating at lower temperatures, which would stop it from working.</p>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Calculate Your Needs</CardTitle>
                                <CardDescription>Use our calculator to get a quick recommendation for your space.</CardDescription>
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
