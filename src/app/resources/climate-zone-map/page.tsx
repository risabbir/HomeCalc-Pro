import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

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

const climateZoneData = [
  { zone: "1", type: "Hot-Humid", states: "South Florida, Hawaii, Guam, Puerto Rico, Virgin Islands" },
  { zone: "2", type: "Hot-Dry / Mixed-Humid", states: "Most of Florida, south Texas, southern Louisiana, southern Arizona" },
  { zone: "3", type: "Warm-Humid / Warm-Dry", states: "Southeast US, coastal California, most of Texas and Arizona" },
  { zone: "4", type: "Mixed-Humid / Mixed-Dry", states: "Mid-Atlantic, Pacific Northwest, parts of California and the Midwest" },
  { zone: "5", type: "Cool-Humid / Cool-Dry", states: "Northeast, Midwest, and Rocky Mountains" },
  { zone: "6", type: "Cold-Humid / Cold-Dry", states: "Northern Midwest, New England, northern Rockies" },
  { zone: "7", type: "Very-Cold", states: "Northern Minnesota, Wisconsin, North Dakota, Maine, high elevations" },
  { zone: "8", type: "Subarctic", states: "Most of Alaska" },
]

export default function ClimateZoneMapPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold font-headline mb-4">Understanding U.S. Climate Zones</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        The U.S. Department of Energy's climate zone map is a critical tool for home construction and renovation. It divides the country into eight zones based on climate, which helps determine the most effective strategies for energy-efficient building.
                    </p>
                </article>

                <Image 
                    src="https://placehold.co/1200x600.png"
                    alt="Map of U.S. Climate Zones"
                    width={1200}
                    height={600}
                    className="rounded-lg my-8 object-cover"
                    data-ai-hint="climate zone map"
                />

                <article className="prose dark:prose-invert max-w-none mt-8">
                    <h2>Why Your Climate Zone Matters</h2>
                    <p>Using the correct climate zone for your location is essential for several of our most important calculators. An incorrect zone can lead to inaccurate estimates and poor project outcomes:</p>
                    <ul>
                        <li><strong>Heating & Cooling (HVAC):</strong> A home in Zone 7 (Very-Cold) requires a significantly more powerful heating system than a home in Zone 1 (Hot-Humid). Conversely, a home in a hot climate needs more cooling power. Using the wrong zone can lead to an undersized or oversized HVAC system, resulting in inefficiency, discomfort, and higher energy bills.</li>
                        <li><strong>Insulation (R-Value):</strong> Colder zones require higher R-value insulation in walls, attics, and floors to prevent heat loss in the winter. In hot climates, proper insulation helps keep cool air inside. Our insulation calculators use these zones to provide accurate recommendations.</li>
                        <li><strong>Building Materials:</strong> The choice of windows, siding, and roofing can also be influenced by your climate zone to maximize energy efficiency and durability.</li>
                    </ul>
                </article>

                <Card className="mt-12">
                    <CardHeader>
                        <CardTitle>Climate Zone Breakdown</CardTitle>
                        <CardContent className="pt-4 px-0 pb-0">
                           <p className="text-muted-foreground">You can typically find your zone by searching for "US DOE climate zone for [your county, state]".</p>
                        </CardContent>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Zone</TableHead>
                                    <TableHead>Climate Type</TableHead>
                                    <TableHead>Example Locations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {climateZoneData.map((zone) => (
                                    <TableRow key={zone.zone}>
                                        <TableCell className="font-medium">Zone {zone.zone}</TableCell>
                                        <TableCell>{zone.type}</TableCell>
                                        <TableCell>{zone.states}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="mt-16 bg-accent/50">
                    <CardHeader>
                        <CardTitle>Use Your Zone in These Calculators</CardTitle>
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
