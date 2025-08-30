
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, X, MessagesSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChatbotResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { chatbotQuestions } from '@/lib/chatbot-questions';


interface Message {
    role: 'user' | 'model';
    content: { text: string;[key: string]: any }[];
    link?: string | null;
}

// Function to shuffle an array and get the first N items
const getShuffledItems = (arr: string[], num: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpBubble, setShowHelpBubble] = useState(true);
  const [showPresets, setShowPresets] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: [{ text: "Hi! How can I help you plan your next home project?" }] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [presetQuestions, setPresetQuestions] = useState<string[]>([]);
  const { toast } = useToast();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Randomize questions only on the client-side to prevent hydration mismatch
    setPresetQuestions(getShuffledItems(chatbotQuestions, 3));
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
    const userMessage: Message = { role: 'user', content: [{ text: query }] };
    setMessages(prev => [...prev, userMessage]);
    
    if (!queryOverride) {
        setInputValue('');
    }
    setIsLoading(true);

    try {
      // Map only the necessary parts of the history
      const historyForApi = messages.map(({ role, content }) => ({
        role,
        content: content.map(c => ({ text: c.text })),
      }));
      
      const res = await getChatbotResponse({ query: query, history: historyForApi });
      
      const modelMessage: Message = { role: 'model', content: [{ text: res.answer }], link: res.link };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
      toast({
        title: 'Chatbot Error',
        description: errorMessage,
        variant: 'destructive',
      });
      const errorResponseMessage: Message = { role: 'model', content: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later."}] };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (question: string) => {
    handleSendMessage(question);
  };
  
  const renderLinkButton = (link: string) => {
    const isExternal = link.startsWith('http');
    const buttonText = isExternal ? "View Resource" : "Go to Calculator";

    if (isExternal) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "link", size: "sm" }), "mt-2 gap-1.5 h-auto p-0 text-amber-600 dark:text-amber-400")}>
                {buttonText} <ExternalLink className="h-3.5 w-3.5" />
            </a>
        );
    }
    return (
        <Button asChild size="sm" className="mt-2">
            <Link href={link}>{buttonText}</Link>
        </Button>
    );
  }

  return (
    <>
      { !isOpen && showHelpBubble && (
        <div className="fixed bottom-20 right-4 z-40 animate-in fade-in-50 slide-in-from-bottom-4 md:bottom-20 md:right-6">
            <Card className="p-2 sm:p-3 shadow-none border">
                 <CardContent className="p-0 flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-medium">How can I help with your project?</p>
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
          variant="default"
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full flex items-center justify-center p-0 shrink-0 md:h-14 md:w-14",
            "[&_svg]:h-6 [&_svg]:w-6 md:[&_svg]:h-7 md:[&_svg]:w-7",
            "transition-all duration-300 ease-in-out hover:scale-110",
            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
          aria-label="Open chatbot"
      >
          <MessagesSquare />
      </Button>

      <div className={cn("fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none')}>
        <Card className="w-[calc(100vw-2rem)] max-w-[400px] h-[calc(100vh-5rem)] max-h-[640px] flex flex-col shadow-2xl border">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessagesSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">HomeCalc Helper</CardTitle>
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
                      <p className="whitespace-pre-wrap">{message.content[0].text}</p>
                      {message.link && typeof message.link === 'string' && renderLinkButton(message.link)}
                    </div>
                     {message.role === 'user' && <User className="h-6 w-6 shrink-0 rounded-full bg-secondary text-secondary-foreground p-0.5" />}
                  </div>
                ))}
                
                {showPresets && presetQuestions.length > 0 && (
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
          <CardFooter className="p-2 border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
              className="flex w-full items-end gap-2"
            >
              <Textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-grow overflow-y-auto resize-none py-2.5 px-3 no-scrollbar bg-secondary/50 border-input rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
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
