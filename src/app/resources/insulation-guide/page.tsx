
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";

export const metadata: Metadata = {
    title: 'A Homeowner\'s Guide to Insulation Types | HomeCalc Pro',
    description: 'Learn about the different types of home insulation, from fiberglass batts to spray foam, and find out which is best for your project.',
};

const relevantCalculators = [
    'attic-insulation',
    'hvac-load',
];

const insulationTypes = [
    {
        name: "Fiberglass (Batts & Rolls)",
        rValue: "3.1 - 4.3",
        description: "The most common and affordable type of insulation. Comes in pre-cut batts or rolls designed to fit between standard stud and joist spacing.",
        pros: ["Inexpensive", "DIY-friendly", "Widely available"],
        cons: ["Can be an irritant", "Loses R-value if compressed", "Susceptible to moisture"],
        bestFor: ["Unfinished Walls", "Floors", "Ceilings"]
    },
    {
        name: "Blown-In (Fiberglass or Cellulose)",
        rValue: "2.2 - 3.8",
        description: "Loose-fill insulation that is blown into place, making it ideal for filling enclosed existing walls, irregularly shaped areas, and topping up attic insulation.",
        pros: ["Fills gaps well", "Good for existing structures", "Cellulose is eco-friendly"],
        cons: ["Requires machine rental", "Can settle over time", "Messy installation"],
        bestFor: ["Existing Walls", "Attics", "Hard-to-reach areas"]
    },
    {
        name: "Spray Foam (Open & Closed-Cell)",
        rValue: "3.5 - 7.0",
        description: "A chemical insulation that is sprayed in liquid form and expands to create an air-tight seal. Offers superior performance and acts as an air barrier.",
        pros: ["Excellent R-value", "Creates an air seal", "Adds structural rigidity (closed-cell)"],
        cons: ["Expensive", "Requires professional installation", "Can shrink if installed improperly"],
        bestFor: ["New Construction", "Rim Joists", "Air Sealing"]
    },
    {
        name: "Rigid Foam Boards (XPS/EPS/Polyiso)",
        rValue: "3.6 - 6.5",
        description: "Large, sturdy boards of insulation made from plastics like polystyrene or polyisocyanurate. Excellent for continuous insulation over exterior walls.",
        pros: ["High R-value per inch", "Moisture resistant (XPS)", "Adds a thermal break"],
        cons: ["Joints must be taped", "Not for irregular spaces", "Can be damaged by UV light"],
        bestFor: ["Basement Walls", "Exterior Sheathing", "Slab Foundations"]
    },
    {
        name: "Mineral Wool (Rockwool)",
        rValue: "3.0 - 3.3",
        description: "Made from spun rock and slag fibers. It's naturally fire-resistant and has excellent sound-dampening properties, making it great for interior walls.",
        pros: ["Fire resistant", "Excellent soundproofing", "Moisture resistant"],
        cons: ["More expensive than fiberglass", "Heavier and denser", "Less common"],
        bestFor: ["Interior Walls", "Bedrooms", "Home Theaters"]
    },
];

export default function InsulationGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">A Homeowner's Guide to Insulation</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Choosing the right insulation is crucial for your home's comfort and energy efficiency. This guide breaks down the most common types available.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2">
                    <Alert className="mb-12">
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>What is R-Value?</AlertTitle>
                        <AlertDescription>
                            <p>R-Value measures an insulation's ability to resist heat flow. **The higher the R-value, the better its insulating performance.** Your required R-value depends on your climate zone and where you're insulating (attic, walls, etc.).</p>
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {insulationTypes.map((insulation) => (
                            <Card key={insulation.name} className="flex flex-col border-2">
                                <CardHeader>
                                    <CardTitle>{insulation.name}</CardTitle>
                                    <CardDescription>R-Value/inch: <span className="font-bold text-foreground">{insulation.rValue}</span></CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    <p className="text-muted-foreground text-sm">{insulation.description}</p>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Pros:</h4>
                                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                            {insulation.pros.map(pro => <li key={pro}>{pro}</li>)}
                                        </ul>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold text-sm mb-2">Cons:</h4>
                                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                            {insulation.cons.map(con => <li key={con}>{con}</li>)}
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-wrap gap-2">
                                    <p className="text-xs font-semibold mr-2">Best For:</p>
                                    {insulation.bestFor.map(use => (
                                        <Badge key={use} variant="secondary">{use}</Badge>
                                    ))}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </main>

                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Calculate Your Insulation Needs</CardTitle>
                                 <CardDescription>Now that you know the types, find out how much insulation you need for your project.</CardDescription>
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
