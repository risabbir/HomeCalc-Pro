
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Github, Share2, Lightbulb, Handshake, Server, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReportAnIssue } from '@/components/layout/ReportAnIssue';
import { AnimatedSection } from '@/components/about/AnimatedSection';

export const metadata: Metadata = {
    title: 'About HomeCalc Pro',
    description: 'Learn about our mission to provide the best home project calculators and how you can support our work.',
};

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden">
            <div className="container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto">
                    <AnimatedSection>
                        <section className="text-center mb-24">
                            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">Our Mission</h1>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                To empower homeowners, DIY enthusiasts, and professionals with free, accurate, and easy-to-use calculators for any home project, big or small. We believe that with the right tools, anyone can plan with confidence and build with precision.
                            </p>
                        </section>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className='relative aspect-video rounded-xl'>
                                 <Image 
                                    src="https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&w=1471&auto=format&fit=crop"
                                    alt="A person using a laptop to plan a project" 
                                    fill
                                    className="rounded-xl object-cover"
                                    data-ai-hint="planning project"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold font-headline mb-4">What We Do</h2>
                                <p className="text-muted-foreground">
                                    HomeCalc Pro is a comprehensive suite of online calculators designed to take the guesswork out of home improvement, gardening, HVAC planning, and more. We provide the mathematical foundation for your projects, from estimating the amount of paint for a bedroom to calculating the load for a new HVAC system. Our goal is to save you time, reduce material waste, and help you stay on budget.
                                </p>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                         <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className="md:order-2 relative aspect-video rounded-xl">
                                <Image 
                                    src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1470&auto=format&fit=crop"
                                    alt="A well-organized workshop" 
                                    fill
                                    className="rounded-xl object-cover"
                                    data-ai-hint="tools workshop"
                                />
                            </div>
                            <div className="md:order-1">
                                <h2 className="text-3xl font-bold font-headline mb-4">How This Tool Helps You</h2>
                                <p className="text-muted-foreground mb-4">
                                    Planning is the most critical phase of any project. Our calculators help you:
                                </p>
                                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                    <li><strong>Budget Accurately:</strong> Know exactly how much material you need before you buy.</li>
                                    <li><strong>Save Time:</strong> Get instant calculations without complex formulas.</li>
                                    <li><strong>Reduce Waste:</strong> Buy the right amount, saving money and the environment.</li>
                                    <li><strong>Learn & Discover:</strong> Explore our resources to learn best practices for your projects.</li>
                                </ul>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <Card className="mb-24 bg-primary/5 border-primary/20 text-center">
                            <CardHeader>
                                <CardTitle>Explore Our Guides & Resources</CardTitle>
                                <CardDescription className="max-w-xl mx-auto">
                                    Go beyond the numbers. Our comprehensive resource section is filled with step-by-step checklists, planning guides, and expert tips to help you execute your projects successfully.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href="/resources">
                                        Browse Resources <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className="relative aspect-video rounded-xl">
                                <Image 
                                    src="https://images.unsplash.com/photo-1706466614967-f4f14a3d9d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8YWl8ZW58MHx8fHwxNzUyMjE2Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="A person developing software on a laptop" 
                                    fill
                                    className="rounded-xl object-cover"
                                    data-ai-hint="technology code"
                                />
                            </div>
                             <div>
                                <h2 className="text-3xl font-bold font-headline mb-4">The Power Behind Our Tools</h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Many of our features, like the AI Recommendations and the Chatbot, are powered by advanced AI models from Google. This allows us to provide smart suggestions and helpful answers to your project questions, going beyond simple calculations.
                                </p>
                                <Button asChild variant="outline">
                                    <Link href="/faq">Learn More About our AI Features</Link>
                                </Button>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <section className="text-center mb-24">
                            <h2 className="text-3xl font-bold font-headline mb-4">How Your Support Helps</h2>
                            <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
                                HomeCalc Pro is a passion project, and we're committed to keeping it free and accessible. Your support helps us cover the costs of keeping the lights on and building new features.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="items-center">
                                        <Server className="h-8 w-8 text-primary mb-2"/>
                                        <CardTitle className="text-xl">Server & API Costs</CardTitle>
                                        <CardDescription>Keeping the site online and paying for AI services.</CardDescription>
                                    </CardHeader>
                                </Card>
                                 <Card>
                                    <CardHeader className="items-center">
                                        <Lightbulb className="h-8 w-8 text-primary mb-2"/>
                                        <CardTitle className="text-xl">Continued Development</CardTitle>
                                        <CardDescription>Building new calculators and improving existing ones.</CardDescription>
                                    </CardHeader>
                                </Card>
                                 <Card>
                                    <CardHeader className="items-center">
                                        <Handshake className="h-8 w-8 text-primary mb-2"/>
                                        <CardTitle className="text-xl">Creating Resources</CardTitle>
                                        <CardDescription>Writing helpful guides and checklists for our users.</CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                            <div className="mt-8 flex justify-center items-center gap-4">
                                <Button asChild size="lg">
                                    <Link href="https://buymeacoffee.com/your_username" target="_blank" rel="noopener noreferrer">
                                        <Heart className="mr-2 h-5 w-5" /> Buy Me a Coffee
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <Link href="https://patreon.com/your_username" target="_blank" rel="noopener noreferrer">
                                        Become a Patron
                                    </Link>
                                </Button>
                            </div>
                        </section>
                    </AnimatedSection>
                    
                    <AnimatedSection>
                        <Card>
                            <CardHeader>
                                <CardTitle>Other Ways to Contribute</CardTitle>
                                <CardDescription>Donations aren't the only way to help! Here are other ways you can support the HomeCalc Pro community.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <Github className="h-8 w-8 text-primary mb-2"/>
                                    <h4 className="font-semibold">Provide Feedback</h4>
                                    <p className="text-sm text-muted-foreground">Suggest a new calculator or report an issue on our GitHub.</p>
                                </div>
                                 <div className="flex flex-col items-center text-center">
                                    <Share2 className="h-8 w-8 text-primary mb-2"/>
                                    <h4 className="font-semibold">Share the Site</h4>
                                    <p className="text-sm text-muted-foreground">Tell your friends, family, or colleagues about HomeCalc Pro.</p>
                                </div>
                                 <div className="flex flex-col items-center text-center">
                                    <Handshake className="h-8 w-8 text-primary mb-2"/>
                                    <h4 className="font-semibold">Give Suggestions</h4>
                                    <p className="text-sm text-muted-foreground">If you're a developer or have ideas, we'd love to hear your suggestions!</p>
                                </div>
                            </CardContent>
                        </Card>
                    </AnimatedSection>

                    <AnimatedSection>
                        <ReportAnIssue />
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
}
