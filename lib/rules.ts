import { Inputs, Rule, Severity } from './types';

export const rules: Rule[] = [
    {
        id: 'rule-1',
        severity: 'safe',
        condition: (inputs) => inputs.projectType === 'static' && inputs.hosting === 'static_host',
        title: 'Static Sites Are Low-Risk on Free Tiers',
        message: 'If you host a static site on a free static host, it usually doesn’t break because there’s no backend compute to spin down or bill unexpectedly.',
        why: [
            'Static hosting platforms (Render, Vercel, Netlify, Cloudflare Pages) serve prebuilt assets without persistent compute.',
            'No spin-down, no runtime billing, no background execution.'
        ]
    },
    {
        id: 'rule-2',
        severity: 'risk',
        condition: (inputs) => (inputs.projectType === 'backend' || inputs.projectType === 'fullstack') && inputs.hosting === 'free_backend',
        title: 'Free Backend Services Spin Down After Inactivity',
        message: 'If you host an API on a free backend service, it usually feels unreliable because the service spins down after inactivity and only restarts on the next request.',
        why: [
            'Free web services often spin down after 15 minutes without inbound traffic.',
            'Spinning up a service takes up to a minute, causing a noticeable delay.'
        ]
    },
    {
        id: 'rule-3',
        severity: 'warning',
        condition: (inputs) => inputs.hosting === 'free_backend',
        title: 'Spin-Down Manifests as Latency or Transient Failures',
        message: 'If your app randomly hangs or times out after being idle, it’s often not a code bug but a cold start caused by the backend spinning down.',
        why: [
            'Browser page load will hang temporarily during spin-up.',
            'Requests do not reach the service until it is running.'
        ]
    },
    {
        id: 'rule-4',
        severity: 'risk',
        condition: (inputs) => (inputs.projectType === 'bot' || inputs.uptime === 'always_on') && inputs.hosting === 'free_backend',
        title: 'Always-On Workloads Are Incompatible with Free Backends',
        message: 'If you run a bot or scheduler on a free backend, it will miss jobs because always-on workloads break when the service spins down.',
        why: [
            'Spin-down breaks schedulers, background workers, and webhook receivers.',
            'Free tiers explicitly allow suspension at any time.'
        ]
    },
    {
        id: 'rule-5',
        severity: 'warning',
        condition: (inputs) => inputs.duration === 'months',
        title: 'Free Tiers Have Time-Based Expiry Risk',
        message: 'If you plan a side project to run for months on a free tier, it often stops working because many free plans expire or require upgrades after a fixed time.',
        why: [
            'Many free databases or compute plans have hard 30-day expirations.',
            'Data may be deleted after a grace period if not upgraded.'
        ]
    },
    {
        id: 'rule-6',
        severity: 'risk',
        condition: (inputs) => inputs.hosting === 'managed_cloud',
        title: 'Usage-Based Cloud Pricing Can Cause Surprise Bills',
        message: 'If you deploy on a usage-based cloud without guardrails, you can get a large bill because small misconfigurations or automation errors compound costs quickly.',
        why: [
            'Usage-based platforms (AWS/GCP/Azure) can generate high bills due to misconfiguration or automation errors.',
            'Cost guardrails and alerts are often not enabled by default.'
        ]
    },
    {
        id: 'rule-7',
        severity: 'risk',
        condition: (inputs) => inputs.india && inputs.usesSMS,
        title: 'India SMS Requires DLT Registration (Hard Constraint)',
        message: 'If you send SMS in India without DLT registration, delivery or costs usually break because messages get blocked or routed through expensive international gateways.',
        why: [
            'In India, domestic SMS delivery requires mandatory DLT registration.',
            'Non-compliance causes blocking or expensive rerouting via international gateways.'
        ]
    },
    {
        id: 'rule-8',
        severity: 'warning',
        condition: (inputs) => inputs.hosting === 'free_backend' || inputs.hosting === 'static_host',
        title: '“Free Tier” Signup Often Has Hidden Friction',
        message: 'If you pick a ‘free tier’ assuming instant access, you may get blocked before deployment because many platforms require credit cards, verification, or region eligibility.',
        why: [
            'Signup often requires GitHub verification or credit card for anti-abuse.',
            'Free credits are small and non-rolling.'
        ]
    }
];

export function evaluateRules(inputs: Inputs) {
    const triggeredRules = rules.filter(rule => rule.condition(inputs));

    // Sort by severity: risk > warning > safe
    const severityOrder: Record<Severity, number> = {
        'risk': 0,
        'warning': 1,
        'safe': 2
    };

    triggeredRules.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Limit to max 4 rules
    const topRules = triggeredRules.slice(0, 4);

    let verdict: '🟢 Safe' | '🟡 Usable with warnings' | '🔴 Risky' = '🟢 Safe';
    if (triggeredRules.some(r => r.severity === 'risk')) {
        verdict = '🔴 Risky';
    } else if (triggeredRules.some(r => r.severity === 'warning')) {
        verdict = '🟡 Usable with warnings';
    }

    return { verdict, rules: topRules };
}
