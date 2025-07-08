import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: 'U.S. Climate Zone Map | HomeCalc Pro',
    description: 'Find your U.S. climate zone to accurately size your HVAC system and determine insulation needs.',
};

const relevantCalculators = [
    'hvac-load',
    'attic-insulation',
    'furnace-cost',
    'heat-pump-cost'
]

export default function ClimateZoneMapPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold font-headline mb-4">Understanding U.S. Climate Zones</h1>
                    <p className="text-lg text-muted-foreground mb-12">
                        The U.S. Department of Energy has divided the country into eight climate zones. These zones are crucial for building and construction, as they help determine the appropriate heating, ventilation, and air conditioning (HVAC) system size, as well as the recommended level of insulation for a home. You can typically find your zone by searching for "US DOE climate zone for [your state]".
                    </p>
                    
                    <h2>Why Your Climate Zone Matters</h2>
                    <p>Using the correct climate zone is essential for accurate calculations:</p>
                    <ul>
                        <li><strong>Heating & Cooling:</strong> A home in Zone 7 (e.g., Minnesota) requires a much more powerful heating system than a home in Zone 1 (e.g., Florida). Conversely, a home in a hot, humid climate needs more cooling power. Using the wrong zone can lead to an undersized or oversized HVAC system, resulting in inefficiency and discomfort.</li>
                        <li><strong>Insulation (R-Value):</strong> Colder zones require higher R-value insulation in walls, attics, and floors to prevent heat loss. Proper insulation keeps your home comfortable and your energy bills low.</li>
                    </ul>
                </article>

                <Card className="mt-16 bg-accent/50">
                    <CardHeader>
                        <CardTitle>Related Calculators</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedCalculators.map(calc => (
                            <Button asChild variant="outline" className="justify-start gap-4" key={calc.slug}>
                                <Link href={`/calculators/${calc.slug}`}>
                                    <calc.Icon className="h-5 w-5 text-primary" />
                                    {calc.name}
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
