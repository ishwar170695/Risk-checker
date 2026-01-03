export type ProjectType = 'static' | 'backend' | 'fullstack' | 'bot' | 'sms';
export type Uptime = 'tolerates_downtime' | 'always_on';
export type Hosting = 'free_backend' | 'static_host' | 'vps' | 'managed_cloud' | 'builder';
export type Duration = 'days' | 'weeks' | 'months';

export type Inputs = {
  projectType: ProjectType;
  uptime: Uptime;
  hosting: Hosting;
  duration: Duration;
  india: boolean;
  usesSMS: boolean;
};

export type Severity = 'safe' | 'warning' | 'risk';

export type Rule = {
  id: string;
  severity: Severity;
  condition: (inputs: Inputs) => boolean;
  title: string;
  message: string;
  why: string[];
};

export type Verdict = '🟢 Safe' | '🟡 Usable with warnings' | '🔴 Risky';
