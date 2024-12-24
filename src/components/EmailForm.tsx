import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { APPS_SCRIPT_URL } from "@/config/constants";
import { EmailResponse } from "@/types/form";

export function EmailForm() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    let script: HTMLScriptElement | null = null;

    try {
      const callbackName = `email_callback_${Date.now()}`;
      
      const responsePromise = new Promise<EmailResponse>((resolve, reject) => {
        (window as any)[callbackName] = (response: EmailResponse) => {
          resolve(response);
          delete (window as any)[callbackName];
        };

        script = document.createElement('script');
        const encodedData = encodeURIComponent(JSON.stringify({
          email,
          action: 'email'
        }));
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=email&data=${encodedData}`;
        
        script.onerror = () => {
          reject(new Error('Failed to send email'));
          delete (window as any)[callbackName];
        };

        document.body.appendChild(script);
      });

      const response = await responsePromise;

      if (response.status === 'success') {
        toast({
          title: "Success!",
          description: "Email sent successfully.",
        });
        setEmail("");
      } else {
        throw new Error(response.message || 'Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send Data"}
        </Button>
      </div>
    </form>
  );
}