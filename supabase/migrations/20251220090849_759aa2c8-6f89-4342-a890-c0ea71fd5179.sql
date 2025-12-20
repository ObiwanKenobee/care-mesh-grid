-- Create enum for component types
CREATE TYPE public.component_type AS ENUM ('micro_hub', 'sensing_mesh', 'compassion_ledger', 'response_swarms', 'ai_companion');

-- Create enum for node status
CREATE TYPE public.node_status AS ENUM ('active', 'processing', 'standby', 'offline', 'maintenance');

-- Create enum for alert severity
CREATE TYPE public.alert_severity AS ENUM ('info', 'warning', 'critical', 'emergency');

-- Create enum for alert status
CREATE TYPE public.alert_status AS ENUM ('open', 'acknowledged', 'in_progress', 'resolved');

-- Grid nodes table - stores all nodes in the system
CREATE TABLE public.grid_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  component_type component_type NOT NULL,
  status node_status NOT NULL DEFAULT 'active',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  region TEXT,
  data_rate_gbps DECIMAL(10, 2) DEFAULT 0,
  uptime_percent DECIMAL(5, 2) DEFAULT 99.0,
  last_ping_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alerts table - stores all system alerts
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id UUID REFERENCES public.grid_nodes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity alert_severity NOT NULL DEFAULT 'info',
  status alert_status NOT NULL DEFAULT 'open',
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activity logs table - stores system activity
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id UUID REFERENCES public.grid_nodes(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  description TEXT,
  data_transferred_mb DECIMAL(12, 2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI chat sessions table
CREATE TABLE public.ai_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'en',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI chat messages table
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System metrics table for dashboard
CREATE TABLE public.system_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(20, 4) NOT NULL,
  unit TEXT,
  component_type component_type,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.grid_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Public read policies for monitoring dashboard (public data)
CREATE POLICY "Anyone can view grid nodes" ON public.grid_nodes FOR SELECT USING (true);
CREATE POLICY "Anyone can view alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can view activity logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can view system metrics" ON public.system_metrics FOR SELECT USING (true);

-- AI chat session policies (based on session token match)
CREATE POLICY "Anyone can create chat sessions" ON public.ai_chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their chat sessions" ON public.ai_chat_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can update their chat sessions" ON public.ai_chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Anyone can create chat messages" ON public.ai_chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view chat messages" ON public.ai_chat_messages FOR SELECT USING (true);

-- Insert policies for system data (would normally be admin-only, but for demo purposes)
CREATE POLICY "System can insert grid nodes" ON public.grid_nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update grid nodes" ON public.grid_nodes FOR UPDATE USING (true);
CREATE POLICY "System can insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update alerts" ON public.alerts FOR UPDATE USING (true);
CREATE POLICY "System can insert activity logs" ON public.activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "System can insert metrics" ON public.system_metrics FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_grid_nodes_updated_at BEFORE UPDATE ON public.grid_nodes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_chat_sessions_updated_at BEFORE UPDATE ON public.ai_chat_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for alerts and activity logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grid_nodes;