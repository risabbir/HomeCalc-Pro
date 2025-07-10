
import { calculators } from "@/lib/calculators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckSquare, FileWarning } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { ReportAnIssue } from "@/components/layout/ReportAnIssue";

export const metadata: Metadata = {
    title: 'The Ultimate Deck Building Checklist | HomeCalc Pro',
    description: 'A comprehensive, step-by-step checklist for planning and building your new deck, covering design, permits, materials, construction, and safety.',
};

const relevantCalculators = [
    'decking-calculator',
    'concrete-slab-calculator',
];

const checklistItems = [
    { 
        category: "Phase 1: Planning & Design", 
        items: [
            { text: "Define Deck Purpose & Size:", details: "Determine the deck's primary functions (dining, lounging, hot tub support) to establish the necessary size, shape, and features." },
            { text: "Establish a Comprehensive Budget:", details: "Account for all materials (decking, framing, hardware, concrete), permits, tool rentals, and a 15-20% contingency fund for unforeseen costs." },
            { text: "Thoroughly Research Local Building Codes:", details: "Contact your local building department for the definitive rules on permits, setbacks, frost line depth, footing sizes, ledger board attachment, and railing/stair specifications. This is non-negotiable." },
            { text: "Create a Detailed Deck Plan:", details: "Draft a to-scale plan showing all dimensions, footing locations, beam and joist layout (including sizes and spacing), and features like stairs and landings. This is often required for a permit." },
            { text: "Select Materials:", details: "Choose decking (wood, composite, PVC) and railing materials. Crucially, ensure all structural lumber (posts, beams, joists) is rated for ground contact." },
        ]
    },
    { 
        category: "Phase 2: Site Preparation & Foundation", 
        items: [
            { text: "Call 811 Before You Dig:", details: "At least 3-4 days before digging, contact your local utility locating service. Having underground gas, water, and electric lines marked is a critical, mandatory safety step." },
            { text: "Clear and Grade the Area:", details: "Remove all sod, vegetation, and rocks. Grade the soil to create a positive slope away from your house's foundation to ensure proper water drainage." },
            { text: "Lay Out Footing Locations:", details: "Using your plan, batter boards, and string lines, precisely mark the center of each footing hole. Measure corner-to-corner diagonally to ensure the layout is perfectly square." },
            { text: "Dig Footing Holes:", details: "Excavate holes to the diameter and depth required by your local code. The bottom of the footing must be below the frost line to prevent seasonal heaving." },
            { text: "Pour Concrete Footings:", details: "Mix and pour concrete, then set galvanized post anchors into the wet concrete, ensuring they are perfectly plumb and aligned with your string lines before the concrete sets." },
        ]
    },
    { 
        category: "Phase 3: Framing & Construction", 
        items: [
            { text: "Install Ledger Board & Flashing:", details: "Securely attach the ledger board to the house's rim joist using code-compliant structural screws or bolts. Install proper vinyl or metal flashing to prevent water from getting behind the ledger, which causes rot." },
            { text: "Install Posts and Beams:", details: "Cut support posts to the correct height and attach them to the post anchors. Securely fasten beams to the posts, typically by notching the posts and through-bolting." },
            { text: "Install Joists:", details: "Install the outer rim joists first, then fill in the field joists at the spacing specified in your plan (typically 12\" or 16\" on-center). Use joist hangers at all connections." },
            { text: "Install Blocking and Bracing:", details: "Add blocking between joists to prevent them from twisting and add lateral bracing as required by code for stability, especially on taller decks." },
        ]
    },
    { 
        category: "Phase 4: Decking & Finishing Touches", 
        items: [
            { text: "Install Deck Boards:", details: "Begin laying deck boards perpendicular to the joists, starting at the house. Maintain a consistent gap (e.g., 1/8 to 1/4 inch) for drainage and expansion, using hidden fasteners or screws." },
            { text: "Build and Install Stairs:", details: "Construct stair stringers ensuring they meet code for riser height and tread depth for safety. Attach them securely to the deck frame and a concrete pad at the base." },
            { text: "Install Railing System:", details: "Securely bolt railing posts to the deck frame (never just to the deck boards). Install rails and balusters according to code for height and spacing (typically a 4-inch sphere cannot pass through)." },
            { text: "Add Fascia and Skirting:", details: "Install fascia boards to cover the rim joists for a clean, finished appearance. Consider adding lattice or skirting to enclose the under-deck area." },
            { text: "Apply Protective Finish:", details: "If using wood decking, wait for the wood to dry out according to manufacturer's recommendations before cleaning and applying a quality stain or sealer to protect it from the elements." },
        ]
    },
    { 
        category: "Phase 5: Final Inspection", 
        items: [
            { text: "Schedule All Required Inspections:", details: "Coordinate with your building department to schedule inspections at each required stage (e.g., footing, framing, final). Do not proceed to the next stage until the previous one has passed." },
            { text: "Address Inspector Feedback:", details: "If the inspector requires any corrections, complete them promptly and schedule a re-inspection. Do not consider the project complete until you have received final approval." },
        ]
    }
];


export default function DeckChecklistPage() {
    const relatedCalculators = calculators.filter(c => relevantCalculators.includes(c.slug));

    return (
        <div className="container mx-auto px-4 py-16">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">The Ultimate Deck Building Checklist</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Building a deck is a major structural project. This detailed checklist provides a general framework, but is not a substitute for official plans or local building codes.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                <main className="lg:col-span-2 space-y-8">
                    <Alert className="mb-12 border-l-4 border-primary bg-primary/5">
                         <FileWarning className="h-4 w-4 text-primary" />
                         <AlertTitle className="text-primary">Always Start with Your Local Building Department</AlertTitle>
                         <AlertDescription>
                             This checklist is for informational purposes only. Before purchasing materials or starting any work, you must consult your local building authority to understand the specific permit and code requirements in your area.
                         </AlertDescription>
                    </Alert>
                    
                    {checklistItems.map((section) => (
                        <Card key={section.category}>
                            <CardHeader>
                                <CardTitle>{section.category}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                    <React.Fragment key={item.text}>
                                        {itemIndex > 0 && <Separator className="my-4" />}
                                        <div className="flex items-start space-x-4 p-2">
                                            <CheckSquare className="h-5 w-5 text-primary mt-1 shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-medium text-base">{item.text}</p>
                                                <p className="text-sm text-muted-foreground">{item.details}</p>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    <Alert variant="destructive" className="mt-16">
                         <AlertTriangle className="h-4 w-4" />
                         <AlertTitle>Critical Safety & Durability Pitfalls to Avoid</AlertTitle>
                         <AlertDescription>
                             <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Improper Ledger Board Attachment & Flashing:</strong> This is the #1 cause of catastrophic deck collapse and severe water damage to your home. It must be bolted and flashed perfectly to code.</li>
                                <li><strong>Inadequate Footings:</strong> Footings that are too shallow (above the frost line) or too small will cause your deck to heave, sink, and become dangerously unstable. Do not cut corners here.</li>
                                <li><strong>Incorrect Joist Spacing or Spans:</strong> Using undersized lumber or spacing joists too far apart will result in a bouncy, unsafe deck surface that can sag or fail under load. Follow span tables.</li>
                                <li><strong>Ignoring the Permit Process:</strong> Building without a permit is illegal and unsafe. It can lead to fines, tear-down orders, denial of insurance claims, and major liability issues.</li>
                             </ul>
                         </AlertDescription>
                    </Alert>
                </main>

                <aside className="lg:col-span-1">
                    <div className="sticky top-28 space-y-8">
                        <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle>Calculate Your Deck Materials</CardTitle>
                                <CardDescription>Get a head start on your shopping list with these essential calculators for your deck project.</CardDescription>
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
