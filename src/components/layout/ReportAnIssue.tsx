import { Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function ReportAnIssue() {
    return (
        <Card className="mt-16 bg-gradient-to-br from-secondary/30 to-secondary/80 border-primary/20 border">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1 bg-background p-2 rounded-full border">
                        <Github className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg text-foreground">Suggestions & Support</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                           Have an idea for a new calculator or found a bug? We value your feedback! Consider giving our project a star or submitting your thoughts on our{' '}
                            <Link
                                href="https://github.com/your-username/your-repo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                GitHub repository
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
