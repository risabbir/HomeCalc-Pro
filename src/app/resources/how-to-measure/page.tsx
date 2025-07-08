import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from 'next/image';
import { Ruler, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
    title: 'How to Measure a Room for Any Project | HomeCalc Pro',
    description: 'Learn how to accurately measure any room, including irregular shapes, for your next home improvement project.',
};

const relevantCalculators = [
    'paint-coverage',
    'flooring-area',
    'wallpaper',
];

export default function HowToMeasurePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Ruler className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">How to Accurately Measure a Room</h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Accurate measurements are the foundation of any successful home improvement project. This guide will help you measure like a pro, saving you time, money, and headaches.
                    </p>
                </div>

                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Step 1: Gather Your Tools</CardTitle>
                        <CardDescription>Having the right tools is half the battle. Here’s what you’ll need:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                            <li><strong>25-foot Locking Tape Measure:</strong> The essential tool for this job.</li>
                            <li><strong>Notepad & Pen / Notes App:</strong> It's helpful to sketch a rough diagram of the room to write measurements on.</li>
                            <li><strong>Calculator:</strong> Keep a tab open for HomeCalc Pro!</li>
                            <li><strong>(Optional) Laser Measure:</strong> For large rooms or long distances, this can be a huge time-saver.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Step 2: Measuring for Flooring (Square Footage)</CardTitle>
                        <CardDescription>This is the most common measurement needed for flooring materials.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal pl-5 text-muted-foreground space-y-4">
                            <li>
                                <strong>Measure Length & Width:</strong> Run your tape measure along the longest walls. It's a good practice to measure at two different points to check for variations; use the larger measurement. Do the same for the shorter walls.
                            </li>
                            <li>
                                <strong>Calculate Area:</strong> Multiply the length by the width. A room that is 12 feet long and 10 feet wide has an area of 120 square feet (12 ft x 10 ft = 120 sq ft).
                            </li>
                            <li>
                                <strong>Handle Irregular Shapes:</strong> For L-shaped rooms, break the room into smaller rectangles. Calculate the area of each rectangle and add them together for the total square footage. For alcoves or closets, measure them separately and add to your total.
                            </li>
                        </ol>
                        <Image 
                            src="https://placehold.co/800x400.png"
                            alt="Diagram showing how to break down an L-shaped room into two rectangles for measurement"
                            width={800}
                            height={400}
                            className="rounded-lg my-8 mx-auto object-contain bg-secondary/50 p-4"
                            data-ai-hint="L-shaped diagram"
                        />
                    </CardContent>
                </Card>

                 <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Step 3: Measuring for Walls (Paint & Wallpaper)</CardTitle>
                        <CardDescription>For wall coverings, you'll need the total surface area of your walls.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal pl-5 text-muted-foreground space-y-4">
                            <li>
                                <strong>Measure Wall Height:</strong> Measure from floor to ceiling in a few different places and use the tallest measurement. A standard height is 8 feet.
                            </li>
                            <li>
                                <strong>Calculate Perimeter:</strong> Add the lengths of all walls together. For a 12x10 ft room, the perimeter is (12 + 10 + 12 + 10) = 44 feet.
                            </li>
                            <li>
                                <strong>Calculate Total Wall Area:</strong> Multiply the perimeter by the wall height. For our example, this is 44 ft x 8 ft = 352 square feet of wall space.
                            </li>
                            <li>
                                <strong>Subtract Openings:</strong> Don't pay for materials you won't use. Our calculators can automatically subtract standard sizes for doors and windows, but for maximum precision, measure each one (width x height) and subtract its area from your total.
                            </li>
                        </ol>
                    </CardContent>
                </Card>
                
                <Alert className="mb-12">
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Pro Tips for Precision</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Measure Twice, Cut Once:</strong> It's an old saying for a reason. Double-check your measurements before buying materials.</li>
                            <li><strong>Don't Bend the Tape:</strong> For inside corners, bend the tape measure at the corner mark and read it there, or measure from both sides to the middle and add.</li>
                            <li><strong>Account for Waste:</strong> Always add a "waste factor" (usually 10-15%) to your total material order to account for cuts, mistakes, or complex patterns.</li>
                        </ul>
                    </AlertDescription>
                </Alert>

                 <Card className="mt-16 bg-secondary">
                    <CardHeader>
                        <CardTitle>Ready to Calculate?</CardTitle>
                        <CardDescription>Now that you have your measurements, let's put them to use.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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