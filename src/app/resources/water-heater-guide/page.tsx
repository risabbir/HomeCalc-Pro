
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Guide to Water Heater Types and Efficiency | HomeCalc Pro',
    description: 'Compare conventional storage tank, tankless (on-demand), and heat pump water heaters to find the most efficient and cost-effective option for your home.',
};

const relevantCalculators = ['water-heater-energy-cost'];

export default function WaterHeaterGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">A Homeowner's Guide to Water Heaters</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                   Your water heater is a major energy consumer. Choosing the right type can lead to significant savings on your utility bills and improve your home's comfort.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Conventional Storage Tank Water Heater</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">This is the most common type. It consists of an insulated tank that holds and heats a ready reservoir of water. They are the least expensive to purchase and install.</p>
                            <div>
                                <h3 className="font-semibold">Pros:</h3>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li>Lower initial cost.</li>
                                    <li>Simple technology, easy to install and replace.</li>
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-semibold">Cons:</h3>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li>"Standby heat loss"—energy is constantly used to keep the water in the tank hot.</li>
                                    <li>Limited supply; can run out of hot water during high usage.</li>
                                    <li>Takes up significant floor space.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Tankless (On-Demand) Water Heater</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">Tankless heaters heat water instantly as it flows through the unit. They do not store hot water, eliminating standby heat loss.</p>
                             <div>
                                <h3 className="font-semibold">Pros:</h3>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li>Highly energy-efficient (no standby loss).</li>
                                    <li>Endless supply of hot water.</li>
                                    <li>Compact, space-saving design.</li>
                                    <li>Longer lifespan than tank heaters.</li>
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-semibold">Cons:</h3>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li>Higher upfront cost for the unit and installation.</li>
                                    <li>May require electrical or gas line upgrades.</li>
                                    <li>Flow rate can be limited, especially with multiple simultaneous uses.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Heat Pump (Hybrid) Water Heater</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">These units don't generate heat directly. Instead, they capture heat from the surrounding air and transfer it to the water in the tank—like a refrigerator in reverse. They are the most energy-efficient option available.</p>
                             <div>
                                <h3 className="font-semibold">Pros:</h3>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li>Extremely energy-efficient, offering the lowest annual operating costs.</li>
                                    <li>Eligible for significant tax credits and rebates.</li>
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-semibold">Cons:</h3>
                                <ul className="list-disc pl-5 text-muted-foreground">
                                    <li>Highest initial purchase price.</li>
                                    <li>Requires more space and clearance than other types.</li>
                                    <li>Cools the surrounding space, making it ideal for a garage or basement but not a finished living area.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Compare Your Options</CardTitle>
                                <CardDescription>Estimate the annual energy cost of different water heater types.</CardDescription>
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
