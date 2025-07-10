
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heater, Layers3, Building, AlertTriangle, Sprout } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'A Homeowner\'s Guide to U.S. Climate & Hardiness Zones | HomeCalc Pro',
    description: 'Understand the difference between DOE Climate Zones (for building) and USDA Plant Hardiness Zones (for gardening) and find your zone using official government maps.',
};

const relevantCalculators = [
    'hvac-load',
    'attic-insulation',
    'furnace-cost',
    'soil-volume'
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
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">A Homeowner's Guide to U.S. Climate & Hardiness Zones</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    It's a common point of confusion: "Climate Zones" for building are different from "Plant Hardiness Zones" for gardening. This guide clarifies the two and directs you to the right official resource.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12 lg:gap-y-0">
                <main className="lg:col-span-2 space-y-12">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building className="h-6 w-6" /> DOE Climate Zones (For Building & HVAC)</CardTitle>
                            <CardDescription>
                                For projects like insulation or HVAC sizing, use the Department of Energy (DOE) / Building America climate zones. These are based on heating and cooling needs. The most reliable way to find your zone is by using the official county-by-county lookup tools.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Official Government Resources</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc pl-5 mt-2 space-y-3">
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
                            <CardTitle className="flex items-center gap-2"><Sprout className="h-6 w-6" /> USDA Plant Hardiness Zones (For Gardening)</CardTitle>
                             <CardDescription>
                                For gardening and choosing plants that will survive the winter, use the USDA Plant Hardiness Zone Map. It is based on the average annual minimum winter temperature.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Official Government Resource</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc pl-5 mt-2 space-y-3">
                                        <li>
                                            <a href="https://planthardiness.ars.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">
                                                USDA Plant Hardiness Zone Map
                                            </a>
                                            <p className="text-xs text-muted-foreground">The official interactive map. Enter your ZIP code to find your exact hardiness zone.</p>
                                        </li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>DOE Climate Zone General Breakdown</CardTitle>
                            <CardDescription>To determine your building zone with certainty, use the county-by-county lookup tools on the official U.S. Department of Energy website. The table below provides a general overview.</CardDescription>
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
