
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, AlertTriangle, Sprout } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import Image from "next/image";

export const metadata: Metadata = {
    title: 'Guide to U.S. Climate & USDA Plant Hardiness Zones',
    description: 'Find your correct climate zone. Use the official DOE map for building/HVAC projects and the USDA Plant Hardiness map for gardening. Link to official lookup tools.',
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
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Guide to U.S. Climate & Hardiness Zones</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    It's a common point of confusion: "Climate Zones" for building are different from "Plant Hardiness Zones" for gardening. This guide clarifies the two and directs you to the right official resource.
                </p>
            </div>

            <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden mb-12 border shadow-lg">
                <Image 
                    // To add your own image:
                    // 1. Add your image (e.g., "climate-zone-map.png") to the `public` folder.
                    // 2. Replace the `src` below with `src="/climate-zone-map.png"`.
                    src="https://placehold.co/1200x675.png"
                    alt="Map of US Climate Zones for building and construction, showing different colored regions."
                    fill
                    className="object-cover"
                    data-ai-hint="climate map"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                     <Card className="border-primary/20 border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Building className="h-7 w-7 text-primary" /> DOE Building Climate Zones</CardTitle>
                            <CardDescription>
                                For projects like insulation, new windows, or HVAC sizing, you MUST use the Department of Energy (DOE) climate zones. These are based on heating and cooling needs and are essential for building code compliance and energy efficiency.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Alert>
                                <Building className="h-4 w-4" />
                                <AlertTitle>Official Government Lookup Tools</AlertTitle>
                                <AlertDescription>
                                    <p className="mb-3">The most reliable way to find your building zone is by using an official county-by-county or zip code lookup tool. The general map can be misleading.</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-3">
                                        <li>
                                            <a href="https://basc.pnnl.gov/building-assemblies/climate-zone-lookup" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">
                                                PNNL Climate Zone Lookup (Recommended)
                                            </a>
                                            <p className="text-xs text-muted-foreground">The Pacific Northwest National Laboratory (PNNL) offers a fast, easy-to-use lookup tool by county for finding your specific building climate zone.</p>
                                        </li>
                                         <li>
                                            <a href="https://www.energy.gov/eere/buildings/building-energy-codes-program" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">
                                                U.S. Department of Energy (DOE)
                                            </a>
                                            <p className="text-xs text-muted-foreground">The official source for state-by-state building energy code information, including detailed maps and requirements.</p>
                                        </li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><Sprout className="h-7 w-7 text-primary" /> USDA Plant Hardiness Zones</CardTitle>
                             <CardDescription>
                                For gardening and choosing plants that will survive the winter, use the USDA Plant Hardiness Zone Map. It is based on the average annual minimum winter temperature and is not suitable for building purposes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Alert>
                                <Sprout className="h-4 w-4" />
                                <AlertTitle>Official Government Resource</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc pl-5 mt-2 space-y-3">
                                        <li>
                                            <a href="https://planthardiness.ars.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">
                                                USDA Plant Hardiness Zone Map
                                            </a>
                                            <p className="text-xs text-muted-foreground">The official interactive map. Enter your ZIP code to find your exact hardiness zone for planting.</p>
                                        </li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>DOE Climate Zone General Breakdown</CardTitle>
                            <CardDescription>To determine your building zone with certainty, use the official lookup tools listed above. The table below provides a general, non-authoritative overview.</CardDescription>
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
                    <div className="sticky top-28 space-y-8">
                        <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Related Calculators</CardTitle>
                                <CardDescription>Apply your zone knowledge with these tools.</CardDescription>
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
