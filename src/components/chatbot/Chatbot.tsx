
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, X, MessagesSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChatbotResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Message {
  role: 'user' | 'model';
  content: string;
  link?: string | null;
}

const defaultPresetQuestions = [
    "What's the best type of paint for a bathroom?",
    "How do I estimate the cost of a kitchen remodel?",
    "Find a reliable plumber near me.",
];

const northAmericaPresetQuestions = [
    "What size central AC unit do I need for a 2000 sq ft house?",
    "How much does a new gas furnace installation cost?",
    "Calculate materials for a wood deck.",
];

const europePresetQuestions = [
    "How much does it cost to run an electric radiator?",
    "What are the benefits of a heat pump in a temperate climate?",
    "Calculate insulation needed for solid brick walls.",
];

const southAsiaPresetQuestions = [
    "What size mini-split AC is best for a humid room?",
    "How to calculate materials for a concrete roof slab?",
    "Estimate the cost of running an AC unit all day.",
];

const regionMap: Record<string, string[]> = {
    // North America
    'US': northAmericaPresetQuestions,
    'CA': northAmericaPresetQuestions,
    'MX': northAmericaPresetQuestions,
    // Europe
    'GB': europePresetQuestions, 'DE': europePresetQuestions, 'FR': europePresetQuestions, 'IT': europePresetQuestions, 'ES': europePresetQuestions, 'PL': europePresetQuestions, 'NL': europePresetQuestions, 'BE': europePresetQuestions, 'SE': europePresetQuestions, 'CH': europePresetQuestions, 'AT': europePresetQuestions, 'NO': europePresetQuestions, 'DK': europePresetQuestions, 'FI': europePresetQuestions, 'IE': europePresetQuestions,
    // South Asia
    'BD': southAsiaPresetQuestions, 'IN': southAsiaPresetQuestions, 'PK': southAsiaPresetQuestions, 'LK': southAsiaPresetQuestions,
};

const PRESET_QUESTIONS_SESSION_KEY = 'homecalc_preset_questions';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpBubble, setShowHelpBubble] = useState(true);
  const [showPresets, setShowPresets] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! How can I help you plan your next home project?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [presetQuestions, setPresetQuestions] = useState<string[]>(defaultPresetQuestions);
  const { toast } = useToast();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocationAndSetPresets = async () => {
        try {
            const storedPresets = sessionStorage.getItem(PRESET_QUESTIONS_SESSION_KEY);
            if (storedPresets) {
                setPresetQuestions(JSON.parse(storedPresets));
                return;
            }

            const response = await fetch('https://ip-api.com/json/?fields=status,countryCode');
            let finalPresets = defaultPresetQuestions;
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success' && data.countryCode) {
                    const specificPresets = regionMap[data.countryCode];
                    if (specificPresets) {
                        finalPresets = specificPresets;
                    }
                }
            }
            setPresetQuestions(finalPresets);
            sessionStorage.setItem(PRESET_QUESTIONS_SESSION_KEY, JSON.stringify(finalPresets));
        } catch (error) {
            console.warn('Could not fetch location-based presets:', error);
            // On error, use defaults and store them so we don't try again this session
            sessionStorage.setItem(PRESET_QUESTIONS_SESSION_KEY, JSON.stringify(defaultPresetQuestions));
            // No need to call setPresetQuestions, it already defaults to this
        }
    };
    fetchLocationAndSetPresets();
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 128)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isOpen, showPresets]);

  const handleSendMessage = async (queryOverride?: string) => {
    const query = queryOverride || inputValue.trim();
    if (!query || isLoading) return;

    setShowPresets(false);
    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    
    if (!queryOverride) {
        setInputValue('');
    }
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content: content.toString() }));
      const res = await getChatbotResponse({ query: query, history });
      
      const modelMessage: Message = { role: 'model', content: res.answer, link: res.link };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
      toast({
        title: 'Chatbot Error',
        description: errorMessage,
        variant: 'destructive',
      });
      const errorResponseMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      { !isOpen && showHelpBubble && (
        <div className="fixed bottom-24 right-6 z-40 animate-in fade-in-50 slide-in-from-bottom-4">
            <Card className="p-3 shadow-none">
                 <CardContent className="p-0 flex items-center gap-2">
                    <p className="text-sm font-medium">How can I help with your project?</p>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 shrink-0 rounded-full"
                        onClick={() => setShowHelpBubble(false)}
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                 </CardContent>
            </Card>
        </div>
      )}

      <Button
          variant="solid"
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full flex items-center justify-center p-0 shrink-0 [&_svg]:size-8",
            "transition-all duration-300 ease-in-out hover:scale-110",
            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
          aria-label="Open chatbot"
      >
          <MessagesSquare />
      </Button>

      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none')}>
        <Card className="w-[380px] h-[600px] flex flex-col shadow-2xl border">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessagesSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">HomeCalc Helper</CardTitle>
                <CardDescription className="text-xs">Your friendly home project guide</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-9 w-9 rounded-full text-muted-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">Close chat</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col overflow-hidden p-0">
            <ScrollArea className="flex-grow" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-3 text-sm',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && <MessagesSquare className="h-6 w-6 shrink-0 text-primary" />}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2.5 max-w-[85%] break-words',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.link && (
                        <Button asChild size="sm" className="mt-2">
                           <Link href={`/calculators/${message.link}`}>Go to calculator</Link>
                        </Button>
                      )}
                    </div>
                     {message.role === 'user' && <User className="h-6 w-6 shrink-0 rounded-full bg-secondary text-secondary-foreground p-0.5" />}
                  </div>
                ))}
                
                {showPresets && (
                  <div className="pt-2 animate-in fade-in-50">
                    <p className="text-xs text-muted-foreground mb-2 px-1">Or, ask one of these questions:</p>
                    <div className="space-y-2">
                      {presetQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handlePresetClick(q)}
                          className="w-full text-left p-2.5 rounded-lg border bg-background hover:bg-accent hover:border-primary/30 text-sm font-medium text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-between"
                        >
                          <span>{q}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start gap-3 text-sm">
                      <MessagesSquare className="h-6 w-6 shrink-0 text-primary" />
                      <div className="rounded-lg px-4 py-3 bg-muted flex items-center space-x-1.5">
                        <span className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce"></span>
                      </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t bg-background">
             <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full items-end gap-2">
              <Textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about project costs or materials..."
                className="flex-grow overflow-y-auto resize-none py-2.5 no-scrollbar bg-muted border-muted-foreground/20 focus-visible:ring-primary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
