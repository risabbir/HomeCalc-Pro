
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { Lightbulb, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Understanding Home Ventilation: CFM and Air Quality',
    description: 'Learn why proper home ventilation is crucial for your health and home. Understand CFM, air changes per hour (ACH), and how to choose the right exhaust fan.',
};

const relevantCalculators = ['ventilation-fan-cfm', 'hvac-load'];

export default function VentilationGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">A Homeowner's Guide to Ventilation</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Proper ventilation is an essential but often overlooked aspect of a healthy home. It removes pollutants, moisture, and odors, improving indoor air quality and protecting your home's structure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Why is Ventilation Important?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                <li><strong>Health:</strong> Removes airborne pollutants like VOCs, allergens, and cooking fumes that can cause respiratory issues.</li>
                                <li><strong>Moisture Control:</strong> Prevents mold and mildew growth by exhausting humid air from bathrooms and kitchens, protecting your home from rot and structural damage.</li>
                                <li><strong>Comfort:</strong> Eliminates stale air and lingering odors, creating a fresher, more pleasant living environment.</li>
                                <li><strong>Safety:</strong> Vents combustion appliances like furnaces and water heaters, preventing the buildup of dangerous gases like carbon monoxide.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Key Ventilation Concepts</CardTitle>
                            <CardDescription>Understanding these terms will help you choose the right equipment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">CFM (Cubic Feet per Minute)</h3>
                                <p className="text-muted-foreground">This is the primary measurement of airflow for a fan. It tells you how many cubic feet of air the fan can move in one minute. A higher CFM rating means a more powerful fan. Our calculator helps you determine the CFM needed for your specific room.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">ACH (Air Changes per Hour)</h3>
                                <p className="text-muted-foreground">This measures how many times the entire volume of air in a room is replaced in one hour. Kitchens, for example, require a high ACH (around 15) to quickly clear smoke and odors, while a whole-house system might aim for a much lower, continuous rate.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">Sones</h3>
                                <p className="text-muted-foreground">This is a measure of sound. A lower sone rating means a quieter fan. For bathrooms, look for fans rated at 1.0 sones or less for quiet operation. For kitchens, where fan power is more critical, a higher sone rating is acceptable.</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle as="h3">Types of Ventilation</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Exhaust Ventilation (Most Common):</strong> Actively removes air from a specific area (e.g., bathroom fan, kitchen range hood). Simple and effective for spot ventilation.</li>
                                <li><strong>Supply Ventilation:</strong> Actively brings fresh, filtered air into the home, slightly pressurizing it.</li>
                                <li><strong>Balanced Ventilation:</strong> Systems like Heat Recovery Ventilators (HRVs) and Energy Recovery Ventilators (ERVs) remove stale air and supply fresh air in equal amounts, often transferring heat or humidity in the process for energy efficiency.</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                     <Alert variant="destructive">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle as="h3">Professional Consultation</AlertTitle>
                         <AlertDescription>
                            For whole-house ventilation systems or complex situations, always consult a qualified HVAC professional. They can perform detailed calculations (like ASHRAE 62.2) to design a system that is both effective and energy-efficient for your specific home and climate.
                         </AlertDescription>
                    </Alert>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Related Calculators</CardTitle>
                                <CardDescription>Find the right specs for your projects.</CardDescription>
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
