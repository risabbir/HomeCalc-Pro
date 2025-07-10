import { Mail, MessageSquareHeart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

export function ReportAnIssue() {
    return (
        <Card className="mt-16 bg-secondary/50 border-dashed">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="flex-shrink-0">
                        <MessageSquareHeart className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg mb-1 text-foreground">Your Feedback Matters</h4>
                        <p className="text-sm text-muted-foreground">
                            We're always working to make HomeCalc Pro the best tool for your home projects. If you've found a bug, have an idea for a new calculator, or a suggestion for improving a feature, we would love to hear from you.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Button asChild>
                            <Link href="mailto:webcodar37@gmail.com">
                                <Mail className="mr-2 h-4 w-4" /> Send Feedback
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
