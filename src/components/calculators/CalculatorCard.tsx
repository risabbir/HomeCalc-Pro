import Link from 'next/link';
import type { Calculator } from '@/lib/calculators';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CalculatorCardProps {
  calculator: Calculator;
}

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const { slug, name, description, Icon, category } = calculator;
  return (
    <Link href={`/calculators/${slug}`} className="group flex">
      <Card className="h-full w-full bg-card transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/50 flex flex-col">
        <CardHeader className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-secondary p-3 rounded-lg">
                <Icon className="h-8 w-8 text-primary" />
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <CardTitle className="font-headline text-xl">{name}</CardTitle>
          <CardDescription className="flex-grow pt-2">{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge variant="secondary">{category}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
