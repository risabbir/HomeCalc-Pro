
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heater, Layers3, Building, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'U.S. Climate Zone Guide for Homeowners | HomeCalc Pro',
    description: 'Use official government resources to find your U.S. climate zone. Essential for correctly sizing your HVAC system, choosing insulation, and planning energy-efficient home projects.',
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
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">U.S. Climate Zone Guide for Homeowners</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    The U.S. Department of Energy (DOE) divides the country into eight climate zones. Identifying your specific zone is the critical first step for any energy-efficient home project.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12 lg:gap-y-0">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Find Your Exact Climate Zone</CardTitle>
                            <CardDescription>
                                The most reliable way to find your climate zone is by using the official county-by-county lookup tools provided by U.S. government agencies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Official Government Resources</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc pl-5 mt-2 space-y-3">
                                        <li>
                                            <a href="https://www.energystar.gov/products/heating_cooling/heating_cooling_basics/climate_zone_map" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">
                                                ENERGY STAR Climate Zone Finder
                                            </a>
                                            <p className="text-xs text-muted-foreground">The most user-friendly tool. Select your state and county to instantly find your zone.</p>
                                        </li>
                                        <li>
                                            <a href="https://www.energy.gov/eere/buildings/building-energy-codes-program" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">
                                                U.S. Department of Energy (DOE)
                                            </a>
                                            <p className="text-xs text-muted-foreground">Provides detailed maps and information about building energy codes for each state.</p>
                                        </li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
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
                            <CardDescription>To determine your zone with certainty, use the county-by-county lookup tools on the official U.S. Department of Energy or ENERGY STAR websites. The table below provides a general overview.</CardDescription>
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
