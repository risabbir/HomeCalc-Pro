
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAiRecommendations } from '@/lib/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { calculators } from '@/lib/calculators';

export function AiRecommendations() {
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity) {
        toast({
            title: 'Input needed',
            description: 'Please describe your project or activity.',
            variant: 'destructive',
        });
        return;
    }
    setLoading(true);
    setRecommendations([]);
    try {
      const result = await getAiRecommendations(activity);
      if (result && result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      } else {
        toast({
            title: 'No recommendations found',
            description: 'We couldn\'t find any recommendations for your activity. Please try a different description.',
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Failed to get AI recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSlugForRecommendation = (name: string) => {
    const found = calculators.find(calc => calc.name.toLowerCase() === name.toLowerCase());
    return found?.slug;
  }

  return (
    <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-2 font-headline">Need a suggestion?</h2>
        <p className="text-muted-foreground text-center mb-8">
            Describe your project, and our AI will recommend the perfect calculator.
        </p>
        <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wand2 className="text-primary" />
                        AI Calculator Recommendations
                    </CardTitle>
                    <CardDescription>
                        Tell us what you're working on. For example, "I'm planning to build a new deck" or "my energy bills are too high".
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Describe your activity..."
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        disabled={loading}
                    />
                     {recommendations.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Here are our suggestions:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {recommendations.map(rec => {
                                    const slug = getSlugForRecommendation(rec);
                                    if(slug) {
                                       return (
                                        <li key={rec}>
                                            <Link href={`/calculators/${slug}`} className="text-primary hover:underline">
                                                {rec}
                                            </Link>
                                        </li>
                                       )
                                    }
                                    return null;
                                })}
                            </ul>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Recommendations
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
