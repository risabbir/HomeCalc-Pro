
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, X, MessagesSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChatbotResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Message {
  role: 'user' | 'model';
  content: string;
  link?: string | null;
}

const presetQuestions = [
    "How much paint do I need for a room?",
    "Give me a cost estimate for a kitchen remodel",
    "What's the best type of insulation for an attic?",
];


export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! How can I help you plan your next home project?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
  }, [messages, isOpen]);

  const handleSendMessage = async (queryOverride?: string) => {
    const query = queryOverride || inputValue.trim();
    if (!query || isLoading) return;

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
    setShowPresets(false);
    setIsOpen(true);
    // Wait a moment for the chatbox to open before sending the message
    setTimeout(() => {
        handleSendMessage(question);
    }, 100);
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3",
        "transition-all duration-300 ease-in-out",
        isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      )}>
        {showPresets && (
           <Card className="w-72 animate-in fade-in-50 slide-in-from-bottom-10">
            <CardHeader className="p-4 flex-row items-center justify-between">
                <CardTitle className="text-base">Quick Questions</CardTitle>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowPresets(false)} 
                    className="h-6 w-6"
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
             <CardContent className="p-4 pt-0">
               <div className="space-y-2">
                 {presetQuestions.map((q, i) => (
                   <button
                     key={i}
                     onClick={() => handlePresetClick(q)}
                     className="w-full text-left p-2 rounded-md bg-muted/50 hover:bg-muted text-sm text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-between"
                   >
                     <span>{q}</span>
                     <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                   </button>
                 ))}
               </div>
             </CardContent>
           </Card>
        )}
        
        <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90 flex items-center justify-center p-0 shrink-0"
            aria-label="Open chatbot"
        >
            <MessagesSquare className="h-8 w-8 text-primary-foreground" />
        </Button>
      </div>

      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none')}>
        <Card className="w-[380px] h-[600px] flex flex-col shadow-2xl border">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <CardDescription className="text-xs">Powered by HomeCalc Pro</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full text-muted-foreground">
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
                    {message.role === 'model' && <Bot className="h-6 w-6 shrink-0 text-primary" />}
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
                {isLoading && (
                  <div className="flex justify-start gap-3 text-sm">
                      <Bot className="h-6 w-6 shrink-0 text-primary" />
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
                placeholder="Ask about a project..."
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
