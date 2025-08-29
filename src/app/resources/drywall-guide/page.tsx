
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Drywall Installation Guide for DIYers | HomeCalc Pro',
    description: 'A step-by-step guide to hanging, taping, and finishing drywall. Learn the basic techniques for achieving smooth, professional-looking walls.',
};

const relevantCalculators = ['drywall-calculator'];

export default function DrywallGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">The Beginner's Guide to Drywall Installation</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Finishing drywall is an art, but with patience and the right technique, you can achieve professional results. This guide covers the fundamental steps.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Phase 1: Hanging the Drywall</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                                <li><strong>Ceiling First:</strong> Always hang the ceiling panels before the walls. It's the hardest part, so get it done first. Use a drywall lift if possible.</li>
                                <li><strong>Start in a Corner:</strong> For walls, start in a corner and work your way across. Stagger the joints between the top and bottom rows so they don't line up.</li>
                                <li><strong>Press Firmly:</strong> Press the sheet firmly against the studs or joists. There should be no gaps.</li>
                                <li><strong>Screw Pattern:</strong> Place screws about every 12 inches in the field of the panel and every 8 inches along the edges. Drive them just enough to dimple the paper without breaking it.</li>
                            </ol>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Phase 2: Taping and Mudding</CardTitle>
                            <CardDescription>
                                This is the most critical phase for a smooth finish. It's typically a three-coat process.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                                <li><strong>First Coat (Taping):</strong> Apply a thin layer of joint compound (mud) over a seam and press paper tape into it with a 4" or 6" putty knife. Squeeze out the excess mud from under the tape. Fill all screw dimples. Let it dry completely (24 hours).</li>
                                <li><strong>Second Coat (Fill Coat):</strong> Gently sand any ridges from the first coat. Apply a second, wider coat of mud over the taped seams using a 10" knife, feathering the edges. Let it dry.</li>
                                <li><strong>Third Coat (Finish Coat):</strong> Sand again lightly. Apply a final, very thin top coat with a 12" knife, extending even further to blend it seamlessly with the drywall. This coat should require minimal sanding.</li>
                            </ol>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle as="h2">Phase 3: Sanding and Priming</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                                <li><strong>Final Sanding:</strong> Using a fine-grit sanding sponge or pole sander, lightly sand the entire surface until smooth. Your goal is to knock down any bumps or ridges, not to remove all the compound. Wear a dust mask and eye protection!</li>
                                <li><strong>Wipe Down:</strong> Wipe all surfaces with a damp cloth to remove sanding dust. This is crucial for paint adhesion.</li>
                                <li><strong>Prime:</strong> Apply a quality PVA (polyvinyl acetate) drywall primer. Primer seals the porous surfaces of the drywall and compound, ensuring your final paint coat has a uniform sheen and color.</li>
                            </ol>
                        </CardContent>
                    </Card>

                     <Alert variant="destructive">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle as="h3">Safety Note</AlertTitle>
                         <AlertDescription>
                            Drywall is heavy and awkward. Always lift with your legs, not your back, and get help when lifting panels, especially onto the ceiling. Wear appropriate safety gear, including a dust mask and safety glasses, especially during the sanding phase.
                         </AlertDescription>
                    </Alert>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Estimate Your Materials</CardTitle>
                                <CardDescription>Calculate your drywall needs before you go to the store.</CardDescription>
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
