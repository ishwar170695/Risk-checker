'use client';

import { useState } from 'react';
import { Inputs, ProjectType, Uptime, Hosting, Duration, Severity } from '../lib/types';
import { evaluateRules } from '../lib/rules';
import { track } from '@vercel/analytics';

function FeedbackHook() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="feedback-hook">
        <p className="feedback-thanks">Thanks for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="feedback-hook">
      <p className="feedback-question">Did this help you avoid a bad decision?</p>
      <div className="feedback-buttons">
        <button
          className="feedback-btn"
          onClick={() => {
            setSubmitted(true);
            track('Feedback', { value: 'Yes' });
          }}
        >
          Yes
        </button>
        <button
          className="feedback-btn"
          onClick={() => {
            setSubmitted(true);
            track('Feedback', { value: 'Not sure' });
          }}
        >
          Not sure
        </button>
        <button
          className="feedback-btn"
          onClick={() => {
            setSubmitted(true);
            track('Feedback', { value: 'No' });
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<'inputs' | 'results'>('inputs');
  const [inputs, setInputs] = useState<Inputs>({
    projectType: 'static',
    uptime: 'tolerates_downtime',
    hosting: 'static_host',
    duration: 'weeks',
    india: false,
    usesSMS: false,
  });

  const [evaluation, setEvaluation] = useState<{
    verdict: string;
    rules: any[];
  } | null>(null);

  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const handleCheck = () => {
    const res = evaluateRules(inputs);
    setEvaluation(res);
    setStep('results');
  };

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'safe': return '🟢';
      case 'warning': return '🟡';
      case 'risk': return '🔴';
    }
  };

  if (step === 'results' && evaluation) {
    return (
      <main className="container">
        <div className="card">
          <div className="verdict-header">
            <h1 className="verdict-title">{evaluation.verdict}</h1>
            <p className="verdict-subtitle">Based on your inputs, here’s what’s likely to break.</p>
          </div>

          <div className="rules-list">
            {evaluation.rules.map((rule) => (
              <div key={rule.id} className="rule-card">
                <div className="rule-header">
                  <span className="rule-icon">{getSeverityIcon(rule.severity)}</span>
                  <div>
                    <div className="rule-title">{rule.title}</div>
                    <div className="rule-message">{rule.message}</div>
                  </div>
                </div>

                <button
                  className="why-toggle"
                  onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                >
                  {expandedRule === rule.id ? 'Hide details' : 'Why this happens?'}
                </button>

                {expandedRule === rule.id && (
                  <div className="why-content">
                    <ul className="why-list">
                      {rule.why.map((item: string, i: number) => (
                        <li key={i} className="why-item">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="back-button" onClick={() => setStep('inputs')}>
            ← Change inputs
          </button>
        </div>


        <footer className="footer">
          <p>“Free demo version. Depth and future checks may be added.”</p>
          <p style={{ marginTop: '0.5rem' }}>This tool does not deploy apps, estimate exact costs, or replace DevOps.</p>
          <p style={{ marginTop: '0.5rem' }}>Pre-decision guidance only. No guarantees.</p>
        </footer>

        <FeedbackHook />
      </main>
    );
  }

  return (
    <main className="container">
      <div className="header">
        <h1 className="logo">Risk Checker</h1>
        <p className="subtitle">Infrastructure safety check for your next project</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label className="label">Project Type</label>
          <select
            className="select"
            value={inputs.projectType}
            onChange={(e) => setInputs({ ...inputs, projectType: e.target.value as ProjectType })}
          >
            <option value="static">Static website</option>
            <option value="backend">Backend API</option>
            <option value="fullstack">Full-stack app</option>
            <option value="bot">Bot / scheduler</option>
            <option value="sms">SMS / notification system</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Uptime Expectation</label>
          <select
            className="select"
            value={inputs.uptime}
            onChange={(e) => setInputs({ ...inputs, uptime: e.target.value as Uptime })}
          >
            <option value="tolerates_downtime">Can tolerate downtime</option>
            <option value="always_on">Must be always-on</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Hosting Choice</label>
          <select
            className="select"
            value={inputs.hosting}
            onChange={(e) => setInputs({ ...inputs, hosting: e.target.value as Hosting })}
          >
            <option value="free_backend">Free backend service</option>
            <option value="static_host">Static hosting</option>
            <option value="vps">Cheap VPS</option>
            <option value="managed_cloud">Managed cloud (AWS / GCP / Azure)</option>
            <option value="builder">Website builder (Wix-like)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Project Duration</label>
          <select
            className="select"
            value={inputs.duration}
            onChange={(e) => setInputs({ ...inputs, duration: e.target.value as Duration })}
          >
            <option value="days">Hackathon / demo (days)</option>
            <option value="weeks">Short project (weeks)</option>
            <option value="months">Long project (months+)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Regional Context</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox"
                checked={inputs.india}
                onChange={(e) => setInputs({ ...inputs, india: e.target.checked })}
              />
              India-based users
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox"
                checked={inputs.usesSMS}
                onChange={(e) => setInputs({ ...inputs, usesSMS: e.target.checked })}
              />
              Using SMS / OTP
            </label>
          </div>
        </div>

        <button className="button" onClick={handleCheck}>
          Check my setup
        </button>
      </div>


      <footer className="footer">
        <p>“Free demo version. Depth and future checks may be added.”</p>
        <p style={{ marginTop: '0.5rem' }}>This tool does not deploy apps, estimate exact costs, or replace DevOps.</p>
      </footer>

      <FeedbackHook />
    </main>
  );
}
