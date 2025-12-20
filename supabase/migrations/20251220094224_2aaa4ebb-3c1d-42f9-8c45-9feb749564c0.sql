-- Add recurring donation support to donations table
ALTER TABLE public.donations 
ADD COLUMN is_recurring boolean DEFAULT false,
ADD COLUMN recurring_interval text DEFAULT NULL,
ADD COLUMN subscription_code text DEFAULT NULL,
ADD COLUMN next_payment_date timestamp with time zone DEFAULT NULL,
ADD COLUMN cancelled_at timestamp with time zone DEFAULT NULL;

-- Create subscriptions table for managing recurring donors
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  donor_name text,
  donor_phone text,
  amount_kobo integer NOT NULL,
  currency text NOT NULL DEFAULT 'NGN',
  interval text NOT NULL DEFAULT 'monthly',
  subscription_code text,
  authorization_code text,
  status text NOT NULL DEFAULT 'active',
  next_payment_date timestamp with time zone,
  mission_type text,
  location text,
  notify_sms boolean DEFAULT false,
  notify_email boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  cancelled_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Anyone can view active subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "System can insert subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create email_logs table for tracking sent emails
CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  subject text NOT NULL,
  email_type text NOT NULL,
  related_id uuid,
  status text NOT NULL DEFAULT 'pending',
  resend_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sent_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for email_logs
CREATE POLICY "System can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update email logs" 
ON public.email_logs 
FOR UPDATE 
USING (true);

CREATE POLICY "System can view email logs" 
ON public.email_logs 
FOR SELECT 
USING (true);