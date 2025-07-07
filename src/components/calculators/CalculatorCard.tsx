import Link from 'next/link';
import type { Calculator } from '@/lib/calculators';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CalculatorCardProps {
  calculator: Calculator;
}

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const { slug, name, description, Icon, category } = calculator;
  return (
    <Link href={`/calculators/${slug}`} className="flex">
      <Card className="h-full w-full transition-shadow duration-300 ease-in-out hover:shadow-lg flex flex-col bg-card">
        <CardHeader className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <Icon className="h-10 w-10 text-primary" />
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="font-headline text-xl">{name}</CardTitle>
          <CardDescription className="flex-grow pt-2">{description}</CardDescription>
        </CardHeader>
        <div className="p-6 pt-0 mt-auto">
          <Badge variant="secondary">{category}</Badge>
        </div>
      </Card>
    </Link>
  );
}
