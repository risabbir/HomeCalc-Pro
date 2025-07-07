import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Resources | HomeCalc Pro",
  description: "Helpful resources and guides for home projects.",
};

const resources = [
  {
    title: "Understanding Building Codes",
    description: "A brief guide on why local building codes are important and where to find them. Remember, our calculators are for estimates only!",
    link: "#",
  },
  {
    title: "How to Measure a Room for Flooring",
    description: "Learn the proper technique for measuring your room to ensure you buy the right amount of flooring material.",
    link: "#",
  },
  {
    title: "Choosing the Right Paint Sheen",
    description: "From matte to high-gloss, the sheen you choose can have a big impact. Learn the pros and cons of each.",
    link: "#",
  },
  {
    title: "What is HVAC 'Load'?",
    description: "A simple explanation of what heating and cooling 'load' means and why it's the most important factor in choosing a new system.",
    link: "#",
  },
]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Resources</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          Guides and articles to help you with your next home project.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {resources.map((resource, index) => (
           <Card key={index} className="flex flex-col">
            <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
                <Button asChild variant="outline">
                    <Link href={resource.link}>Read More <ArrowRight /></Link>
                </Button>
            </CardFooter>
           </Card>
        ))}
      </div>
    </div>
  );
}
