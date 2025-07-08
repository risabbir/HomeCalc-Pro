import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'How to Measure a Room for Any Project | HomeCalc Pro',
    description: 'Learn how to accurately measure any room, including irregular shapes, for your next home improvement project.',
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
                     <Image 
                        src="https://placehold.co/1200x400.png"
                        alt="A person measuring a wall with a tape measure"
                        width={1200}
                        height={400}
                        className="rounded-lg mb-8 object-cover"
                        data-ai-hint="measuring wall"
                    />
                    <h1 className="text-4xl font-bold font-headline mb-4">How to Accurately Measure a Room</h1>
                    <p className="text-lg text-muted-foreground mb-12">
                        Getting accurate measurements is the first and most important step for many home improvement projects. Whether you're painting, installing new flooring, or putting up wallpaper, precise numbers will save you time, money, and headaches. Follow these steps to measure like a pro.
                    </p>

                    <h2>Step 1: Gather Your Tools</h2>
                    <p>Having the right tools makes the job easier and more accurate. You'll want:</p>
                    <ul>
                        <li><strong>Tape Measure:</strong> A 25-foot locking tape measure is standard.</li>
                        <li><strong>Notepad & Pen:</strong> Or a notes app on your phone. It's helpful to sketch a rough diagram of the room to write measurements on.</li>
                        <li><strong>Calculator:</strong> Or just keep a tab open for HomeCalc Pro!</li>
                        <li><strong>(Optional) Laser Measure:</strong> For large rooms or long distances, a laser measure can be faster and more accurate.</li>
                    </ul>

                    <h2>Step 2: Measuring for Flooring (Square Footage)</h2>
                    <p>This is the most common measurement needed.</p>
                    <ol>
                        <li><strong>Measure the Length:</strong> Run your tape measure along the longest wall from one corner to the other. It's a good practice to measure at two different points along the wall to check for variations. Record the longer measurement.</li>
                        <li><strong>Measure the Width:</strong> Do the same for the shorter wall.</li>
                        <li><strong>Calculate the Area:</strong> Multiply the length by the width. For example, a room that is 12 feet long and 10 feet wide has an area of 120 square feet (12 ft x 10 ft = 120 sq ft). This is your base square footage.</li>
                    </ol>

                     <Image 
                        src="https://placehold.co/800x400.png"
                        alt="Diagram showing how to break down an L-shaped room into two rectangles for measurement"
                        width={800}
                        height={400}
                        className="rounded-lg my-8 mx-auto object-contain"
                        data-ai-hint="L-shaped diagram"
                    />
                    
                    <h3>Handling Irregular Shapes</h3>
                    <p>What if your room isn't a perfect rectangle? The trick is to break it down into smaller, regular shapes (rectangles or squares). For an L-shaped room, for example, you would treat it as two separate rectangles.</p>
                     <ol>
                        <li>Measure the length and width of the first rectangular section and calculate its area.</li>
                        <li>Measure the length and width of the second rectangular section and calculate its area.</li>
                        <li>Add the areas of all sections together to get the total square footage.</li>
                        <li>For alcoves, closets, or other areas you also want to floor, measure them separately and add them to your total.</li>
                    </ol>

                    <h2>Step 3: Measuring for Walls (Paint/Wallpaper)</h2>
                    <p>If you need the area of the walls, you'll need a couple more measurements.</p>
                    <ol>
                        <li><strong>Measure the Wall Height:</strong> Measure from the floor to the ceiling in a few different places to check for consistency. Use the tallest measurement. A standard height is 8 feet.</li>
                        <li><strong>Calculate the Perimeter:</strong> Add the lengths of all walls together. For our rectangular 12x10 ft room, the perimeter is (12 ft + 10 ft + 12 ft + 10 ft) = 44 feet.</li>
                        <li><strong>Calculate Total Wall Area:</strong> Multiply the perimeter by the wall height. For our example, this is 44 ft x 8 ft = 352 square feet of wall space.</li>
                        <li><strong>Subtract for Openings:</strong> Don't measure doors and windows. Our calculators can automatically subtract standard sizes, but for precision, you can measure each one and subtract its area from your total wall area.</li>
                    </ol>

                </article>

                 <Card className="mt-16 bg-accent/50">
                    <CardHeader>
                        <CardTitle>Ready to Calculate?</CardTitle>
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
