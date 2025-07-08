import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Heater, Layers3, Building } from 'lucide-react';

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
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Understanding U.S. Climate Zones</h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        The U.S. Department of Energy divides the country into eight zones. Knowing your zone is the key to energy-efficient home projects.
                    </p>
                </div>

                <Card className="overflow-hidden mb-12">
                     <CardContent className="p-0">
                        <Image 
                            src="https://storage.googleapis.com/fs-apps-production.appspot.com/1-1181283350/2024-07-16/climatemap.png"
                            alt="Map of U.S. Climate Zones"
                            width={1200}
                            height={675}
                            className="w-full h-auto object-cover"
                        />
                    </CardContent>
                </Card>

                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Why Your Climate Zone Matters</CardTitle>
                        <CardDescription>Using the correct climate zone is essential for getting accurate calculations and achieving the best results for your home.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Heater className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Heating & Cooling (HVAC)</h3>
                                <p className="text-muted-foreground">A home in a cold zone needs a powerful furnace, while one in a hot zone needs a robust AC. An incorrectly sized system leads to inefficiency, discomfort, and high energy bills.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Layers3 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Insulation (R-Value)</h3>
                                <p className="text-muted-foreground">Colder zones require higher R-value insulation in walls, attics, and floors to prevent heat loss. In hot climates, insulation is key to keeping cool air in. Our calculators use these zones for accurate recommendations.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Building className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Building Materials</h3>
                                <p className="text-muted-foreground">Your choice of windows, siding, and roofing should be influenced by your climate zone to maximize energy efficiency and durability against the elements.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Climate Zone Breakdown</CardTitle>
                        <CardDescription>Find your zone by searching online for "US DOE climate zone for [your county, state]". Then, use the table below to understand its characteristics.</CardDescription>
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

                <Card className="bg-secondary">
                    <CardHeader>
                        <CardTitle>Use Your Zone in These Calculators</CardTitle>
                        <CardDescription>Now that you know your zone, apply it in these relevant calculators for precise results.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
        </div>
    )
}