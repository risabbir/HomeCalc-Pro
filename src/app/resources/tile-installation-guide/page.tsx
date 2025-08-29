
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Tile Selection and Installation Tips | HomeCalc Pro',
    description: 'A guide to choosing the right tile (ceramic, porcelain, stone) and tips for a successful DIY tile installation, from surface prep to grouting.',
};

const relevantCalculators = ['tile-calculator', 'flooring-area'];

export default function TileGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Tile Selection & Installation Guide</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Tiling can transform a space, but success lies in the details. From choosing the right material to proper installation, this guide covers the essentials.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Choosing the Right Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Porcelain Tile</h3>
                                <p className="text-muted-foreground">Made from denser clay and fired at higher temperatures, porcelain is extremely durable, stain-resistant, and water-resistant. Ideal for high-traffic areas like floors, kitchens, and bathrooms. It can be more difficult to cut than ceramic.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Ceramic Tile</h3>
                                <p className="text-muted-foreground">Softer and less dense than porcelain, ceramic tile is easier to cut and more budget-friendly. It's a great choice for walls, backsplashes, and low-traffic residential floors.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">Natural Stone (Marble, Travertine, Slate)</h3>
                                <p className="text-muted-foreground">Offers unique, natural beauty but requires more maintenance. Stone tiles are porous and must be sealed regularly to prevent staining and water damage. Best suited for accent walls or low-traffic areas.</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Key Installation Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">1. Surface Preparation is Everything</h3>
                                <p className="text-muted-foreground">The surface must be perfectly clean, level, and stable. Any bumps, dips, or movement in the subfloor will lead to cracked tiles and grout. Use a leveling compound for uneven concrete and ensure plywood subfloors are rigid.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">2. Plan Your Layout</h3>
                                <p className="text-muted-foreground">Do a "dry run" by laying out your tiles without mortar. This helps you visualize the pattern, plan your cuts, and avoid ending up with tiny, awkward slivers of tile at the edges of the room.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">3. Use the Right Trowel and Mortar</h3>
                                <p className="text-muted-foreground">Use the mortar (thin-set) recommended for your tile type. The size of the notches on your trowel depends on the size of your tile—larger tiles need a trowel with larger notches to ensure proper coverage.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">4. Grout and Seal</h3>
                                <p className="text-muted-foreground">After the mortar has fully cured (usually 24-48 hours), you can grout the joints. Once the grout has cured, applying a quality grout sealer is crucial to prevent stains and moisture penetration.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle as="h3">Don't Forget the Waste Factor!</AlertTitle>
                        <AlertDescription>
                           Always purchase more tile than your room's square footage. You will need extra for cuts, mistakes, and potential future repairs. A 10% waste factor is a safe minimum for standard layouts. For complex patterns like herringbone or diagonal layouts, increase this to 15-20%.
                        </AlertDescription>
                    </Alert>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Plan Your Tiling Project</CardTitle>
                                <CardDescription>Calculate how much tile you'll need.</CardDescription>
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
