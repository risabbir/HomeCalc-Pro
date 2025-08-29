
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Beginner\'s Guide to Solar Panel Installation | HomeCalc Pro',
    description: 'Learn the basics of home solar energy systems, from sizing and cost to incentives and finding a qualified installer. Understand your potential ROI.',
};

const relevantCalculators = ['solar-savings'];

export default function SolarGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">A Homeowner's Guide to Going Solar</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                   Installing solar panels is a significant home upgrade that can reduce or eliminate your electricity bill, increase your home's value, and shrink your carbon footprint. This guide covers the key concepts you need to know.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">How Home Solar Works: The Basics</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-3">
                                <li><strong>Panels Generate DC Power:</strong> Photovoltaic (PV) solar panels on your roof contain silicon cells that absorb sunlight. This solar energy excites electrons in the cells, generating direct current (DC) electricity.</li>
                                <li><strong>Inverter Converts to AC Power:</strong> An inverter, a crucial component of your system, converts the DC electricity from the panels into alternating current (AC) electricity. AC power is the standard form of electricity used by your home's appliances, lights, and outlets.</li>
                                <li><strong>Power Your Home:</strong> The AC power flows from the inverter to your home's main electrical panel (breaker box). From there, it is distributed throughout your home to power your everyday needs. Your home will always draw from the solar system first before pulling power from the utility grid.</li>
                                <li><strong>Excess Power Goes to the Grid (Net Metering):</strong> On sunny days, your system will often produce more electricity than your home is consuming. This excess power is automatically sent back to the utility grid. Through a billing mechanism called "net metering," your utility company credits you for this power, effectively spinning your meter backward and further reducing your bill.</li>
                            </ol>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Key Factors Affecting Cost and Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h3 className="font-semibold">System Size (kW)</h3>
                                <p className="text-muted-foreground">The primary driver of cost is the system's capacity, measured in kilowatts (kW). The size you need depends on your annual electricity consumption (measured in kWh, found on your utility bills). A larger home with higher energy use will require a larger, more expensive system to offset its consumption.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Sunlight Exposure ("Peak Sun Hours")</h3>
                                <p className="text-muted-foreground">The amount of direct, unobstructed sunlight your roof receives daily is the most critical performance factor. An ideal roof has a clear view of the sun, especially during the middle of the day. Shading from trees, chimneys, or adjacent buildings will significantly reduce system output. Your location's climate (e.g., Arizona vs. Washington) determines your average daily "peak sun hours."</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Roof Condition, Angle, and Orientation</h3>
                                <p className="text-muted-foreground">Your roof should be in good condition with at least 10-15 years of life remaining before installing panels. For the northern hemisphere, a south-facing roof is ideal for maximum sun exposure. East and west-facing roofs are also viable but will produce slightly less energy. The angle (pitch) of the roof also affects performance.</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle as="h3">Incentives are Key to Your ROI</AlertTitle>
                        <AlertDescription>
                            <p>The financial viability of a solar installation often depends heavily on government and utility incentives. These can dramatically reduce the net cost of your system and shorten your payback period. Key incentives to research for your specific location are:</p>
                           <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Federal Solar Tax Credit (ITC):</strong> Also known as the Residential Clean Energy Credit, this allows you to deduct a significant percentage (currently 30%) of your system's total cost from your federal taxes.</li>
                                <li><strong>State & Local Rebates:</strong> Many states, municipalities, and even local utility companies offer additional cash rebates or tax credits to encourage solar adoption.</li>
                           </ul>
                        </AlertDescription>
                    </Alert>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Estimate Your Savings</CardTitle>
                                <CardDescription>Calculate the potential financial return of a solar installation.</CardDescription>
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
