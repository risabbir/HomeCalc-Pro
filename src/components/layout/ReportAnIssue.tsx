import { Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function ReportAnIssue() {
    return (
        <Card className="mt-16 bg-secondary/50">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                        <Github className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg text-foreground">Community & Support</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                           For technical issues or new calculator ideas, please head over to our{' '}
                            <Link
                                href="https://github.com/your-username/your-repo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                GitHub repository
                            </Link>
                            . If you enjoy using HomeCalc Pro, consider giving it a star—it helps a lot! ⭐
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
