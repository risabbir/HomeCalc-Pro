
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'Fence Installation Guide | HomeCalc Pro',
    description: 'Learn how to plan and install a fence. This guide covers setting posts, attaching rails and panels, and choosing the right materials.',
};

const relevantCalculators = ['fence-materials', 'concrete-slab-calculator'];

export default function FenceGuidePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">A DIY Guide to Fence Installation</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Building a fence can provide privacy, security, and curb appeal. Following the correct steps is key to building a fence that lasts.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Phase 1: Planning and Layout</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                                <li><strong>Check Local Regulations:</strong> Before you do anything, contact your local building department and HOA. There are often strict rules about fence height, materials, and placement (setbacks) relative to property lines.</li>
                                <li><strong>Establish Property Lines:</strong> If you're unsure of your exact property lines, it may be wise to get a professional survey. Building on your neighbor's property can lead to costly disputes.</li>
                                <li><strong>Call 811 (Before You Dig):</strong> This is a mandatory safety step. Call the utility locating service a few days before you plan to dig post holes to have underground lines marked.</li>
                                <li><strong>Lay Out the Fence Line:</strong> Use stakes and string to mark the exact line of your fence. Mark the location of each corner post and gate post.</li>
                            </ol>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Phase 2: Setting the Posts</CardTitle>
                            <CardDescription>
                                The posts are the foundation of your fence. They must be set correctly for the fence to be strong and straight.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                                <li><strong>Dig Post Holes:</strong> Use a post-hole digger to excavate holes. The general rule is that 1/3 of the post's length should be in the ground. The hole's depth must be below your local frost line to prevent heaving.</li>
                                <li><strong>Add Gravel for Drainage:</strong> Place 4-6 inches of gravel at the bottom of each hole to allow water to drain away from the bottom of the post.</li>
                                <li><strong>Set the Posts:</strong> Place the post in the hole. Use a level to ensure it is perfectly plumb (vertically straight) on two adjacent sides.</li>
                                <li><strong>Pour Concrete:</strong> Mix and pour concrete around the post, sloping the top away from the post to shed water. Brace the post with stakes until the concrete has cured (24-48 hours).</li>
                            </ol>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Phase 3: Installing Rails and Infill</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                                <li><strong>Attach Rails:</strong> Install horizontal rails between the posts. Typically, there are at least two rails (top and bottom), but taller fences may require a middle rail for extra support.</li>
                                <li><strong>Install Panels or Pickets:</strong> Attach your infill material (pre-built panels or individual pickets) to the rails. Use a level to ensure panels are straight and a spacer block for consistent gaps between pickets.</li>
                                <li><strong>Hang Gates:</strong> Install gate hardware and hang your gates, ensuring they swing freely and latch properly.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Estimate Fence Materials</CardTitle>
                                <CardDescription>Get a list of the materials you'll need for your project.</CardDescription>
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
    );
}
