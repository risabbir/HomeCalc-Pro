
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Driveway Materials and Installation Guide | HomeCalc Pro',
    description: 'Explore the pros and cons of concrete, asphalt, and paver driveways. Learn about the importance of a proper base and the installation process for each.',
};

const relevantCalculators = ['driveway-materials', 'concrete-slab-calculator'];

export default function DrivewayGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">A Guide to Driveway Materials</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Your driveway is a major feature of your home's exterior. Choosing the right material involves balancing cost, durability, climate, and aesthetics.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">The Crucial Foundation: The Gravel Base</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">No matter which surface material you choose, the success and longevity of your driveway depend entirely on its base. A properly prepared and compacted gravel sub-base is non-negotiable. It serves several critical functions:</p>
                             <ul className="list-disc pl-5 text-muted-foreground space-y-2 mt-4">
                                <li><strong>Stability:</strong> It creates a solid, stable layer that distributes the weight of vehicles evenly, preventing the top surface from sinking or developing ruts.</li>
                                <li><strong>Drainage:</strong> It allows water to drain away from the driveway surface, which is crucial for preventing damage from frost heave in cold climates.</li>
                                <li><strong>Frost Protection:</strong> A deep enough base places the foundation below the frost line, stopping the ground from freezing and expanding upwards, which would crack the driveway.</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">A typical gravel base is 4 to 8 inches deep, consisting of crushed aggregate stone that is graded and tightly compacted with a mechanical tamper or roller. Do not skip or skimp on this step.</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Common Driveway Materials Compared</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div>
                                <h3 className="font-semibold">Concrete (Poured Cement)</h3>
                                <p className="text-muted-foreground">A durable and long-lasting option with a clean, modern look. It's strong and requires little maintenance, but repairs can be difficult to blend and costly. Concrete is prone to cracking in climates with extreme freeze-thaw cycles if not installed with proper control joints and a solid base.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Asphalt (Blacktop)</h3>
                                <p className="text-muted-foreground">More flexible than concrete, making it a better choice for very cold climates as it resists cracking from frost heave. It's generally less expensive to install but requires periodic sealing (every 3-5 years) to maintain its rich black color and prevent oxidation and deterioration.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Pavers (Concrete or Brick)</h3>
                                <p className="text-muted-foreground">Offers the most design flexibility and high-end aesthetic appeal. Pavers are incredibly strong, and individual units can be lifted and replaced if they become stained or damaged. This is typically the most expensive option due to the intensive labor required for proper installation over a sand setting bed.</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Alert variant="destructive">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle as="h3">Installation is Key</AlertTitle>
                         <AlertDescription>
                            The performance of any driveway material is heavily dependent on the quality of the installation. A poorly prepared base will cause even the most expensive material to fail prematurely. For projects of this scale, hiring experienced, reputable contractors is highly recommended.
                         </AlertDescription>
                    </Alert>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Estimate Your Materials</CardTitle>
                                <CardDescription>Calculate the base and top-layer materials for your project.</CardDescription>
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
