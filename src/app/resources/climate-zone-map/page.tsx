
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Heater, Layers3, Building } from 'lucide-react';

export const metadata: Metadata = {
    title: 'U.S. Climate Zone Map for HVAC & Insulation | HomeCalc Pro',
    description: 'Find your U.S. climate zone using our accurate map. Essential for correctly sizing your HVAC system, choosing insulation, and planning energy-efficient home projects.',
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
  { zone: "3", type: "Warm-Humid / Warm-Dry", states: "The Southeast, coastal California, most of Texas and Arizona" },
  { zone: "4", type: "Mixed-Humid / Mixed-Dry", states: "Mid-Atlantic, Pacific Northwest, parts of California, the Midwest" },
  { zone: "5", type: "Cool-Humid / Cool-Dry", states: "The Northeast, Midwest, and the Rocky Mountains" },
  { zone: "6", type: "Cold-Humid / Cold-Dry", states: "Northern Midwest, New England, northern Rockies" },
  { zone: "7", type: "Very-Cold", states: "Northern Minnesota, Wisconsin, North Dakota, Maine, high elevations" },
  { zone: "8", type: "Subarctic", states: "Most of Alaska" },
]

export default function ClimateZoneMapPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Understanding U.S. Climate Zones</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    The U.S. Department of Energy (DOE), following the International Energy Conservation Code (IECC), divides the country into eight climate zones. Identifying your specific zone is the critical first step for any energy-efficient home project.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12 lg:gap-y-0">
                <main className="lg:col-span-2 space-y-12">
                    <Card className="overflow-hidden border-2">
                             <CardContent className="p-0 bg-white">
                                <Image
                                    src="https://placehold.co/1200x927.png"
                                    data-ai-hint="climate zone map"
                                    alt="A map of the United States showing the 8 building climate zones as defined by the U.S. Department of Energy."
                                    width={1200}
                                    height={927}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground">
                            <p>Map courtesy of the U.S. Department of Energy.</p>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Why Your Climate Zone is Critical</CardTitle>
                            <CardDescription>Using the correct zone is essential for getting accurate calculations, saving money, and ensuring your home is comfortable.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Heater className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Accurate HVAC Sizing</h3>
                                    <p className="text-muted-foreground">Your zone determines the precise heating and cooling capacity (size) your HVAC system needs. An undersized system won't keep up on extreme days, while an oversized system will cycle inefficiently, fail to dehumidify properly, and increase energy bills.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Layers3 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Proper Insulation (R-Value)</h3>
                                    <p className="text-muted-foreground">Colder zones require much higher insulation R-values in walls, attics, and floors to prevent heat loss. In hot climates, insulation is just as crucial for keeping cool, conditioned air inside. Using the wrong R-value leads to significant energy waste and discomfort.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Building className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Informed Building Material Choices</h3>
                                    <p className="text-muted-foreground">Your choice of windows (e.g., U-factor and SHGC ratings), siding, and roofing should be directly influenced by your climate zone to maximize energy efficiency and long-term durability against the elements.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Climate Zone Breakdown</CardTitle>
                            <CardDescription>To determine your zone with certainty, use the county-by-county lookup tools on the official U.S. Department of Energy or ENERGY STAR websites. A search for "DOE climate zone by county" will provide the most accurate results. Use the table below to understand your zone's general characteristics.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/6">Zone</TableHead>
                                        <TableHead>Climate Type</TableHead>
                                        <TableHead>General Locations</TableHead>
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
                </main>

                <aside className="lg:col-span-1">
                    <div className="sticky top-28">
                             <Card className="bg-secondary">
                                <CardHeader>
                                    <CardTitle>Related Calculators</CardTitle>
                                    <CardDescription>Apply your knowledge with these tools.</CardDescription>
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
                    </div>
                </aside>
            </div>
        </div>
    )
}
