
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckSquare } from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";

export const metadata: Metadata = {
    title: 'DIY Seasonal HVAC Maintenance Checklist | HomeCalc Pro',
    description: 'Keep your heating and cooling system running efficiently and prevent costly repairs with our seasonal DIY HVAC maintenance guide for homeowners.',
};

const relevantCalculators = [
    'hvac-load',
    'seer-savings-calculator',
    'thermostat-savings',
];

const springSummerTasks = [
    { text: "Change Your Air Filter:", details: "This is the most important task. A clogged filter restricts airflow, reducing efficiency and straining your system. Check it monthly and replace when dirty." },
    { text: "Clean the Outdoor Condenser Unit:", details: "Turn off the power at the breaker. Gently hose down the fins to remove dirt, pollen, and debris. Trim back any plants or shrubs by at least two feet." },
    { text: "Inspect and Clear Condensate Drain Line:", details: "Ensure the drain line for your indoor unit is clear of blockages to prevent water damage. Pouring a cup of distilled vinegar down the line can help clear algae and gunk." },
    { text: "Check Refrigerant Lines:", details: "The two copper lines running to your outdoor unit should be covered with foam insulation. If it's frayed or missing, replace it to improve efficiency." },
    { text: "Test the System:", details: "Turn the AC on before the first hot day. Set your thermostat to 'cool' and ensure it's blowing cold air and cycling properly." },
];

const fallWinterTasks = [
    { text: "Change Your Air Filter (Again):", details: "Start the heating season with a fresh filter to ensure good airflow and efficiency for your furnace." },
    { text: "Clean Your Humidifier:", details: "If you have a whole-home humidifier, clean the evaporator panel and check for proper operation before turning it on for the season." },
    { text: "Test Your Furnace or Heat Pump:", details: "Turn your system to 'heat' well before the first cold snap to ensure it ignites and produces warm air correctly." },
    { text: "Cover the Outdoor AC Unit (Optional):", details: "Consider using a breathable cover for your outdoor condenser to protect it from falling ice and debris. Avoid plastic tarps that trap moisture and can cause rust." },
    { text: "Check Carbon Monoxide Detectors:", details: "This is a critical safety step. Test all CO detectors in your home and replace batteries as needed." },
];


export default function HvacMaintenancePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Seasonal HVAC Maintenance Checklist</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Regular maintenance keeps your heating and cooling system running efficiently, extends its lifespan, and can prevent expensive emergency repairs.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Spring & Summer (Cooling Season)</CardTitle>
                            <CardDescription>Prepare your air conditioner for the heat.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {springSummerTasks.map((item, itemIndex) => (
                                <React.Fragment key={item.text}>
                                    {itemIndex > 0 && <Separator className="my-4" />}
                                    <div className="flex items-start space-x-4 p-2">
                                        <CheckSquare className="h-5 w-5 text-primary mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-base">{item.text}</h3>
                                            <p className="text-sm text-muted-foreground">{item.details}</p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Fall & Winter (Heating Season)</CardTitle>
                            <CardDescription>Get your furnace or heat pump ready for the cold.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {fallWinterTasks.map((item, itemIndex) => (
                                <React.Fragment key={item.text}>
                                    {itemIndex > 0 && <Separator className="my-4" />}
                                    <div className="flex items-start space-x-4 p-2">
                                        <CheckSquare className="h-5 w-5 text-primary mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-base">{item.text}</h3>
                                            <p className="text-sm text-muted-foreground">{item.details}</p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </CardContent>
                    </Card>

                    <Alert variant="destructive">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle as="h3">When to Call a Professional</AlertTitle>
                         <AlertDescription>
                             This DIY checklist is for basic maintenance. You should schedule a professional tune-up annually. A qualified technician will check refrigerant levels, inspect electrical components, clean internal parts, and ensure your system is operating safely and at peak performance.
                         </AlertDescription>
                    </Alert>
                </main>

                <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                        <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Plan Your HVAC Projects</CardTitle>
                                <CardDescription>Use our calculators to make informed decisions about your HVAC system.</CardDescription>
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
