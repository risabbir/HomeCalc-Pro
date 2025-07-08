import Image from "next/image";
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: 'How to Measure a Room | HomeCalc Pro',
    description: 'Learn how to accurately measure any room for your next home improvement project.',
};

const relevantCalculators = [
    'paint-coverage',
    'flooring-area',
    'wallpaper',
]

export default function HowToMeasurePage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <article className="prose dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold font-headline mb-4">How to Accurately Measure a Room</h1>
                    <p className="text-lg text-muted-foreground">
                        Getting accurate measurements is the first and most important step for many home improvement projects. Whether you're painting, installing new flooring, or putting up wallpaper, precise numbers will save you time, money, and headaches.
                    </p>
                    
                    <div className="my-12">
                        <Image 
                            src="https://placehold.co/1200x600.png"
                            alt="Diagram of a room with length and width measurements"
                            width={1200}
                            height={600}
                            className="rounded-lg shadow-lg border w-full"
                            data-ai-hint="room measurement"
                        />
                    </div>

                    <h2>Step 1: Gather Your Tools</h2>
                    <p>You don't need much, but having the right tools helps. You'll want:</p>
                    <ul>
                        <li>A 25-foot tape measure</li>
                        <li>A notepad and pen, or a notes app on your phone</li>
                        <li>A calculator (or just use our website!)</li>
                    </ul>

                    <h2>Step 2: Measuring a Standard Rectangular Room</h2>
                    <p>This is the most straightforward scenario.</p>
                    <ol>
                        <li><strong>Measure the Length:</strong> Run your tape measure along the longest wall from one corner to the other. Record this number. For best results, measure a second time to ensure accuracy.</li>
                        <li><strong>Measure the Width:</strong> Do the same for the shorter wall. This is your width.</li>
                        <li><strong>Calculate the Area:</strong> Multiply the length by the width. For example, a room that is 12 feet long and 10 feet wide has an area of 120 square feet (12 x 10 = 120).</li>
                    </ol>

                    <h2>Step 3: Measuring for Walls (Paint/Wallpaper)</h2>
                    <p>If you need the area of the walls, you'll need one more measurement.</p>
                    <ol>
                        <li><strong>Measure the Wall Height:</strong> Measure from the floor to the ceiling. A standard height is 8 feet.</li>
                        <li><strong>Calculate the Perimeter:</strong> Add the lengths of all walls together. For a rectangular room, this is (Length x 2) + (Width x 2). For our 12x10 ft room, the perimeter is (12x2) + (10x2) = 44 feet.</li>
                        <li><strong>Calculate Total Wall Area:</strong> Multiply the perimeter by the wall height. For our example, this is 44 ft x 8 ft = 352 square feet of wall space. Our calculators will automatically subtract for standard doors and windows.</li>
                    </ol>

                    <h2>Handling Irregular Shapes</h2>
                    <p>What if your room isn't a perfect rectangle? The trick is to break it down into smaller, regular shapes (rectangles or squares). Measure each section individually and then add their areas together to get the total square footage.</p>
                </article>

                 <Card className="mt-16 bg-accent/50">
                    <CardHeader>
                        <CardTitle>Related Calculators</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedCalculators.map(calc => (
                            <Button asChild variant="outline" className="justify-start gap-4" key={calc.slug}>
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
