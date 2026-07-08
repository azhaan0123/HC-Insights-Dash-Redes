import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { CheckCircle2, BookOpen, ExternalLink, Sparkles } from "lucide-react";

export default function SupportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-200">
        <Card className="w-full max-w-md text-center border-border bg-card shadow-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
              <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Request Submitted</CardTitle>
            <CardDescription className="text-base mt-2 text-muted-foreground">
              We've received your support request successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our support team will review your details and reach out to the email provided shortly. You can safely close this window.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full py-6 text-base font-semibold transition-transform duration-150 active:scale-[0.97]" 
              onClick={() => window.close()}
              aria-label="Close support window"
            >
              Close Window
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12 animate-in fade-in zoom-in-95 duration-500 transition-colors">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-center mb-2">
          Health<span className="text-primary">Compiler</span> Support
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Submit a ticket or reach out to our clinical engineering support team.
        </p>

        <Card className="shadow-xl border-border bg-card">
          <CardHeader className="border-b border-border pb-6 mb-6">
            <CardTitle className="text-xl font-bold text-foreground">New Support Request</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please provide as much detail as possible to help us resolve your issue quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="support-form" onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="Support request form">
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="issue-type" className="font-semibold text-foreground">
                  Type of Issue <span className="text-primary" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </Label>
                <Select required>
                  <SelectTrigger id="issue-type" aria-label="Type of Issue" className="h-11 bg-muted border-border text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <SelectValue placeholder="Select the type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missing-network">My network is not on the list</SelectItem>
                    <SelectItem value="login-issue">Login or Authentication Issue</SelectItem>
                    <SelectItem value="bug">Report a Bug</SelectItem>
                    <SelectItem value="other">Other Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="person-name" className="font-semibold text-foreground">
                    Your Name <span className="text-primary" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </Label>
                  <Input 
                    id="person-name" 
                    required 
                    placeholder="John Doe" 
                    aria-required="true"
                    className="h-11 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="font-semibold text-foreground">
                    Email Address <span className="text-primary" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="john@example.com" 
                    aria-required="true"
                    className="h-11 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="network-name" className="font-semibold text-foreground">
                    Name of Network <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                  </Label>
                  <Input 
                    id="network-name" 
                    placeholder="Enter network name" 
                    className="h-11 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="practice-name" className="font-semibold text-foreground">
                    Name of Practice <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                  </Label>
                  <Input 
                    id="practice-name" 
                    placeholder="Enter practice name" 
                    className="h-11 bg-muted border-border placeholder:text-muted-foreground text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="details" className="font-semibold text-foreground">Additional Details</Label>
                <textarea 
                  id="details" 
                  rows={4} 
                  aria-label="Additional Details"
                  className="flex w-full rounded-md border border-border bg-muted px-3 py-2 text-sm shadow-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Please describe your issue in detail..." 
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border bg-muted/30 pt-6 mt-2 rounded-b-xl">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => window.close()} 
              aria-label="Cancel support request and close window"
              className="h-12 px-6 font-semibold border-border bg-card text-foreground hover:bg-muted transition-transform duration-150 active:scale-[0.97]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="support-form" 
              aria-label="Submit support request"
              className="h-12 px-8 font-semibold transition-transform duration-150 active:scale-[0.97]"
            >
              Submit Request
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
