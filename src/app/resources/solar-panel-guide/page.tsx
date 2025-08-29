
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
                   Installing solar panels is a significant home upgrade that can reduce or eliminate your electricity bill, increase your home's value, and shrink your carbon footprint.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">How Home Solar Works: The Basics</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                                <li><strong>Panels Generate DC Power:</strong> Photovoltaic (PV) solar panels on your roof convert sunlight into direct current (DC) electricity.</li>
                                <li><strong>Inverter Converts to AC Power:</strong> An inverter converts the DC electricity from the panels into alternating current (AC) electricity, which is the type of power used by your home's appliances.</li>
                                <li><strong>Power Your Home:</strong> The AC power flows through your home's electrical panel to power your lights and appliances.</li>
                                <li><strong>Excess Power Goes to the Grid:</strong> If your system produces more power than you are using, the excess is sent back to the utility grid. Through a program called "net metering," your utility company will credit you for this excess power, further reducing your bill.</li>
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
                                <p className="text-muted-foreground">The primary driver of cost. The size of the system you need depends on your annual electricity consumption (measured in kWh), which you can find on your utility bills.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Sunlight Exposure</h3>
                                <p className="text-muted-foreground">The amount of direct, unobstructed sunlight your roof receives daily is crucial. Shading from trees or adjacent buildings will reduce system output.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Roof Condition and Orientation</h3>
                                <p className="text-muted-foreground">Your roof should be in good condition before installation. For the northern hemisphere, a south-facing roof is ideal, but east and west-facing roofs are also viable.</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle as="h3">Incentives are Key</AlertTitle>
                        <AlertDescription>
                            <p>The financial viability of solar often depends heavily on government incentives. These can dramatically reduce the net cost of your system. Key incentives to research are:</p>
                           <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Federal Solar Tax Credit (ITC):</strong> Allows you to deduct a significant percentage of your system's cost from your federal taxes.</li>
                                <li><strong>State & Local Rebates:</strong> Many states, municipalities, and utility companies offer additional cash rebates or tax credits.</li>
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
