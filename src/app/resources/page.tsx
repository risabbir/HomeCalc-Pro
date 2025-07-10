
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ListChecks, Map, Ruler, Paintbrush, ClipboardCheck, Layers3, LayoutGrid } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | HomeCalc Pro',
  description: 'Helpful guides, checklists, and resources to help you plan and execute your home projects with confidence.',
};

const resources = [
    {
        title: "U.S. Climate & Hardiness Zone Guide",
        description: "Find your official DOE climate zone for building and your USDA hardiness zone for gardening.",
        href: "/resources/climate-zone-map",
        Icon: Map,
    },
    {
        title: "How to Measure a Room",
        description: "Learn the proper way to measure a room's dimensions for paint, flooring, or wallpaper.",
        href: "/resources/how-to-measure",
        Icon: Ruler,
    },
    {
        title: "Deck Building Checklist",
        description: "A step-by-step checklist to ensure your deck building project goes smoothly from start to finish.",
        href: "/resources/deck-checklist",
        Icon: ListChecks,
    },
    {
        title: "Paint Finish Guide",
        description: "Choose the right paint sheen for any room, from durable semi-gloss for trim to flat for ceilings.",
        href: "/resources/paint-finish-guide",
        Icon: Paintbrush,
    },
    {
        title: "Seasonal HVAC Maintenance Checklist",
        description: "Keep your system running efficiently and prevent costly repairs with our seasonal HVAC maintenance guide.",
        href: "/resources/hvac-maintenance-checklist",
        Icon: ClipboardCheck,
    },
    {
        title: "Homeowner's Guide to Insulation",
        description: "Learn about fiberglass, spray foam, and more to choose the best insulation for your home.",
        href: "/resources/insulation-guide",
        Icon: Layers3,
    },
    {
        title: "Kitchen Layout Planning Guide",
        description: "Plan a functional and beautiful space by understanding the core principles of kitchen design.",
        href: "/resources/kitchen-layout-guide",
        Icon: LayoutGrid,
    },
]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Helpful Resources</h1>
        <p className="text-muted-foreground text-lg">
          Planning is the key to a successful project. Use these guides, checklists, and expert tips to help you get started right.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
              <Link href={resource.href} key={resource.title} className="group flex">
                  <Card className="h-full w-full bg-card transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/50 flex flex-col justify-between">
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
    </div>
  );
}
