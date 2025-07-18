
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";

export const metadata: Metadata = {
    title: 'How to Measure a Room Accurately For Any Project | HomeCalc Pro',
    description: 'Learn the professional way to measure any room, including how to handle irregular shapes and account for waste, ensuring you buy the right amount of material.',
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
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">How to Measure a Room Like a Pro</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Accurate measurements are the foundation of any successful home improvement project. This guide will help you measure correctly, saving you time, money, and headaches.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Step 1: Gather Your Tools</CardTitle>
                            <CardDescription>Having the right tools makes the job easy and accurate. Here’s what you’ll need:</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                <li><strong>25-foot Locking Tape Measure:</strong> The single most essential tool for this job.</li>
                                <li><strong>Notepad & Pen or a Notes App:</strong> It's helpful to sketch a rough "bird's-eye view" of the room to write measurements on directly.</li>
                                <li><strong>Calculator:</strong> Keep a tab open for HomeCalc Pro to do the math for you!</li>
                                <li><strong>A Helper (Optional but Recommended):</strong> For long walls, having a second person hold the tape measure prevents sagging and ensures accuracy.</li>
                                <li><strong>Laser Measure (Optional):</strong> For large, complex rooms or long distances, this can be a huge time-saver and accuracy booster.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle as="h2">Step 2: Measuring for Flooring (Square Footage)</CardTitle>
                            <CardDescription>This is the most common measurement needed for flooring materials like tile, vinyl, or laminate.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal pl-5 text-muted-foreground space-y-4">
                                <li>
                                    <strong>Measure Length & Width:</strong> Run your tape measure along the longest walls of the room. Since walls are rarely perfectly straight, measure at two different points and use the larger of the two numbers. Do the same for the room's width.
                                </li>
                                <li>
                                    <strong>Calculate the Area:</strong> Multiply the final length by the final width to get the square footage. For example, a room that is 12.5 feet long and 10 feet wide has an area of 125 square feet (12.5 ft x 10 ft = 125 sq ft).
                                </li>
                                <li>
                                    <strong>Handling Irregular Shapes:</strong> For L-shaped rooms or rooms with alcoves, break the space down into smaller, separate rectangles. Calculate the area of each individual rectangle, then add all the areas together to get your total square footage.
                                </li>
                            </ol>
                             <div className="my-8 p-8 bg-secondary/30 border rounded-lg">
                                <p className="text-center text-muted-foreground mb-4">For irregular shapes, divide the room into separate rectangles:</p>
                                <div className="flex justify-center items-center gap-4">
                                    <div className="w-32 h-20 bg-background border-2 border-dashed rounded flex items-center justify-center">
                                        <span className="font-semibold">Area A</span>
                                    </div>
                                    <span className="text-2xl font-bold text-muted-foreground">+</span>
                                    <div className="w-24 h-32 bg-background border-2 border-dashed rounded flex items-center justify-center">
                                        <span className="font-semibold">Area B</span>
                                    </div>
                                </div>
                                <p className="text-center font-semibold mt-4">Total Area = Area A + Area B</p>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle as="h2">Step 3: Measuring for Walls (Paint & Wallpaper)</CardTitle>
                            <CardDescription>For wall coverings, you need the total paintable surface area of your walls.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal pl-5 text-muted-foreground space-y-4">
                                <li>
                                    <strong>Measure the Room's Perimeter:</strong> Measure the length of each wall in the room and add them all together. For a rectangular 12 ft x 10 ft room, the perimeter is 12 + 10 + 12 + 10 = 44 feet.
                                </li>
                                <li>
                                    <strong>Measure Wall Height:</strong> Measure from the top of your baseboards to the ceiling. Again, measure in a few different spots and use the tallest measurement. A standard height is 8 feet.
                                </li>
                                <li>
                                    <strong>Calculate Total Wall Area:</strong> Multiply the room's perimeter by the wall height. For our example, this is 44 ft x 8 ft = 352 square feet of total wall space.
                                </li>
                                <li>
                                    <strong>Subtract Doors and Windows:</strong> You don't need to paint windows and doors. Our calculators can automatically subtract standard sizes, but for maximum precision, measure the area of each one (width x height) and subtract the total from your wall area. A standard door is ~21 sq ft and a window is ~15 sq ft.
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                    
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle as="h3">Pro Tips for Flawless Measurements</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Measure Twice, Buy Once:</strong> It's an old saying for a reason. Always double-check your measurements before purchasing materials.</li>
                                <li><strong>Keep the Tape Straight:</strong> For long measurements, a sagging tape measure can add inches to the real dimension. Keep it taut and level. Ask for help if needed.</li>
                                <li><strong>Note Measurements Consistently:</strong> Decide whether you'll use inches (e.g., 147") or feet and inches (e.g., 12' 3"). Sticking to one format prevents conversion errors.</li>
                                <li><strong>Always Add a Waste Factor:</strong> For flooring, tile, and wallpaper, always buy extra material. A 10% waste factor is standard for simple layouts. For complex rooms or diagonal installations (like herringbone flooring), increase this to 15-20%.</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </main>
                 <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                         <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Put Your Measurements to Use</CardTitle>
                                <CardDescription>Now that you have accurate dimensions, let our calculators do the hard work.</CardDescription>
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
