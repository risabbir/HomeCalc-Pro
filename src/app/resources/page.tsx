
'use client'

import Link from "next/link";
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, ListChecks, Map, Ruler, Paintbrush, ClipboardCheck, Layers3, LayoutGrid, Wind, Droplets, Triangle, Grid3x3, RectangleHorizontal, Fence, Bath, Sun, CarIcon, Search } from "lucide-react";

const allResources = [
    {
        title: "U.S. Climate & Hardiness Zone Guide",
        description: "Find your official DOE climate zone for building and your USDA hardiness zone for gardening.",
        href: "/resources/climate-zone-map",
        Icon: Map,
        keywords: "climate zone hardiness usda doe map"
    },
    {
        title: "How to Measure a Room Accurately",
        description: "Learn the proper way to measure a room's dimensions for paint, flooring, or wallpaper.",
        href: "/resources/how-to-measure",
        Icon: Ruler,
        keywords: "measure room area square footage"
    },
    {
        title: "The Ultimate Deck Building Checklist",
        description: "A step-by-step checklist to ensure your deck building project goes smoothly from start to finish.",
        href: "/resources/deck-checklist",
        Icon: ListChecks,
        keywords: "deck build checklist plan"
    },
    {
        title: "A Homeowner's Guide to Paint Finishes",
        description: "Choose the right paint sheen for any room, from durable semi-gloss for trim to flat for ceilings.",
        href: "/resources/paint-finish-guide",
        Icon: Paintbrush,
        keywords: "paint finish sheen gloss matte"
    },
    {
        title: "Seasonal HVAC Maintenance Checklist",
        description: "Keep your system running efficiently and prevent costly repairs with our seasonal HVAC maintenance guide.",
        href: "/resources/hvac-maintenance-checklist",
        Icon: ClipboardCheck,
        keywords: "hvac maintenance checklist ac furnace"
    },
    {
        title: "A Homeowner's Guide to Insulation",
        description: "Learn about fiberglass, spray foam, and more to choose the best insulation for your home.",
        href: "/resources/insulation-guide",
        Icon: Layers3,
        keywords: "insulation r-value types fiberglass"
    },
    {
        title: "Kitchen Layout Planning Guide",
        description: "Plan a functional and beautiful space by understanding the core principles of kitchen design.",
        href: "/resources/kitchen-layout-guide",
        Icon: LayoutGrid,
        keywords: "kitchen layout design remodel triangle"
    },
    {
        title: "Understanding Home Ventilation",
        description: "Learn why proper home ventilation is crucial and how to choose the right exhaust fan.",
        href: "/resources/understanding-home-ventilation",
        Icon: Wind,
        keywords: "ventilation cfm fan bathroom kitchen"
    },
    {
        title: "Choosing the Right Dehumidifier",
        description: "A guide to selecting the correct dehumidifier size based on pint capacity and room conditions.",
        href: "/resources/choosing-a-dehumidifier",
        Icon: Droplets,
        keywords: "dehumidifier size pint capacity basement"
    },
    {
        title: "Roofing Materials and Installation",
        description: "Learn about materials like asphalt shingles and metal, and understand roof pitch.",
        href: "/resources/roofing-guide",
        Icon: Triangle,
        keywords: "roofing shingles pitch material square"
    },
    {
        title: "Tile Selection and Installation Tips",
        description: "Tips for selecting the right tile and ensuring a professional-looking installation.",
        href: "/resources/tile-installation-guide",
        Icon: Grid3x3,
        keywords: "tile flooring ceramic porcelain installation"
    },
    {
        title: "Drywall Installation Guide",
        description: "A step-by-step guide to hanging, taping, and finishing drywall panels.",
        href: "/resources/drywall-guide",
        Icon: RectangleHorizontal,
        keywords: "drywall sheetrock installation taping mud"
    },
    {
        title: "Fence Installation Guide",
        description: "Learn how to plan, set posts, and install different types of fencing.",
        href: "/resources/fence-guide",
        Icon: Fence,
        keywords: "fence installation posts pickets"
    },
    {
        title: "Water Heater Types and Efficiency",
        description: "Compare tank, tankless, and heat pump water heaters to find the right one for you.",
        href: "/resources/water-heater-guide",
        Icon: Bath,
        keywords: "water heater tank tankless efficiency"
    },
    {
        title: "Driveway Materials Guide",
        description: "Explore the pros and cons of asphalt, concrete, and pavers for your driveway.",
        href: "/resources/driveway-guide",
        Icon: CarIcon,
        keywords: "driveway concrete asphalt pavers"
    },
    {
        title: "Solar Panel Installation Guide",
        description: "Understand the basics of solar energy, system sizing, and the installation process.",
        href: "/resources/solar-panel-guide",
        Icon: Sun,
        keywords: "solar panel savings roi installation"
    },
]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = useMemo(() => {
    if (!searchTerm) return allResources;
    return allResources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.keywords.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Helpful DIY Resources</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Planning is the key to a successful project. Use these guides, checklists, and expert tips to help you get started right.
        </p>
         <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search guides (e.g., 'deck' or 'hvac')..."
              className="w-full pl-12 pr-4 h-12 text-base rounded-full border shadow-sm focus-visible:ring-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for a resource guide"
            />
          </div>
      </div>
      
      {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
                <Link href={resource.href} key={resource.title} className="group flex">
                    <Card className="h-full w-full bg-card transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border hover:border-primary/50 flex flex-col justify-between">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-secondary p-3 rounded-lg">
                                    <resource.Icon className="h-8 w-8 text-primary" />
                                </div>
                                <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            </div>
                            <CardTitle className="font-headline text-xl">{resource.title}</CardTitle>
                            <CardDescription className="pt-2">{resource.description}</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold font-headline">No guides found</h3>
          <p className="text-muted-foreground">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
}
