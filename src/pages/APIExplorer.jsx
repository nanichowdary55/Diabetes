import { useState } from 'react';
import Header from '../components/Header';
import { Play, Lock, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

const methodBadge = { GET: 'badge-get', POST: 'badge-post', PUT: 'badge-put', DELETE: 'badge-delete' };
const methodColors = {
  GET: 'border-emerald-500/20 bg-emerald-500/5',
  POST: 'border-blue-500/20 bg-blue-500/5',
  PUT: 'border-amber-500/20 bg-amber-500/5',
  DELETE: 'border-red-500/20 bg-red-500/5',
};

const fhirEndpoints = [
  {
    method: 'GET',
    path: '/v3/fhir/Patient',
    description: 'Retrieve patient demographic information',
    auth: true,
    body: null,
  },
  {
    method: 'GET',
    path: '/v3/fhir/Patient/{id}',
    description: 'Get specific patient details by ID',
    auth: true,
    body: null,
  },
  {
    method: 'GET',
    path: '/v3/fhir/Coverage',
    description: 'Access patient insurance coverage information',
    auth: true,
    body: null,
  },
  {
    method: 'GET',
    path: '/v3/fhir/ExplanationOfBenefit',
    description: 'Retrieve claims and payment information',
    auth: true,
    body: null,
  },
  {
    method: 'GET',
    path: '/v3/connect/userinfo',
    description: 'Get authenticated user profile information',
    auth: true,
    body: null,
  },
  {
    method: 'GET',
    path: '/v3/fhir/metadata',
    description: 'Retrieve FHIR server capability statement',
    auth: true,
    body: null,
  },
  {
    method: 'POST',
    path: '/v3/o/token/',
    description: 'Request OAuth2 access token',
    auth: false,
    body: `grant_type=client_credentials&scope=openid profile patient/Patient.read patient/Coverage.read patient/ExplanationOfBenefit.read`,
  },
];

const sampleResponses = {
  'GET /v3/fhir/Patient': `{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "12345",
        "name": [
          {
            "given": ["John"],
            "family": "Doe"
          }
        ],
        "birthDate": "1980-01-01",
        "gender": "male"
      }
    }
  ]
}`,
  'GET /v3/fhir/Patient/{id}': `{
  "resourceType": "Patient",
  "id": "12345",
  "name": [
    {
      "given": ["John"],
      "family": "Doe"
    }
  ],
  "birthDate": "1980-01-01",
  "gender": "male",
  "address": [
    {
      "line": ["123 Main St"],
      "city": "Anytown",
      "state": "CA",
      "postalCode": "12345"
    }
  ]
}`,
  'GET /v3/fhir/Coverage': `{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "Coverage",
        "id": "cov123",
        "status": "active",
        "type": {
          "coding": [
            {
              "system": "http://hl7.org/fhir/coverage-type",
              "code": "medical"
            }
          ]
        },
        "beneficiary": {
          "reference": "Patient/12345"
        }
      }
    }
  ]
}`,
  'GET /v3/fhir/ExplanationOfBenefit': `{
  "resourceType": "Bundle",
  "type": "searchset",
  "entry": [
    {
      "resource": {
        "resourceType": "ExplanationOfBenefit",
        "id": "eob123",
        "status": "active",
        "type": {
          "coding": [
            {
              "system": "http://hl7.org/fhir/claim-type",
              "code": "institutional"
            }
          ]
        },
        "patient": {
          "reference": "Patient/12345"
        }
      }
    }
  ]
}`,
  'GET /v3/connect/userinfo': `{
  "sub": "user123",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "email": "john.doe@example.com",
  "profile": "https://example.com/profile"
}`,
  'GET /v3/fhir/metadata': `{
  "resourceType": "CapabilityStatement",
  "status": "active",
  "date": "2024-01-01",
  "publisher": "BlueButton API",
  "kind": "instance",
  "fhirVersion": "4.0.1",
  "format": ["json"],
  "rest": [
    {
      "mode": "server",
      "resource": [
        {
          "type": "Patient",
          "interaction": [
            {
              "code": "read"
            },
            {
              "code": "search-type"
            }
          ]
        }
      ]
    }
  ]
}`,
  'POST /v3/o/token/': `{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "openid profile patient/Patient.read patient/Coverage.read patient/ExplanationOfBenefit.read"
}`,
};

export default function APIExplorer() {
  const [open, setOpen] = useState(null);
  const [ran, setRan] = useState({});
  const [copied, setCopied] = useState(null);

  const toggleOpen = (key) => setOpen(prev => (prev === key ? null : key));

  const runEndpoint = (key) => {
    setRan(prev => ({ ...prev, [key]: 'loading' }));
    setTimeout(() => setRan(prev => ({ ...prev, [key]: 'done' })), 1000);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="animate-fade-in">
      <Header title="BlueButton FHIR API Explorer" subtitle="CMS BlueButton 2.0 API — FHIR R4 Endpoints" />
      <div className="p-6 space-y-5">

        {/* Intro */}
        <div className="px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
          <p className="text-white font-bold mb-1">🔌 BlueButton FHIR API — Base URL</p>
          <code className="text-cyan-300 font-mono text-sm">https://sandbox.bluebutton.cms.gov</code>
          <p className="text-slate-400 text-xs mt-2">All endpoints require <span className="text-amber-300 font-mono">Authorization: Bearer &lt;JWT&gt;</span> header. All responses are FHIR JSON.</p>
        </div>

        {/* HTTP Methods legend */}
        <div className="flex flex-wrap gap-3">
          {[['GET','Read data'],['POST','Create/Send'],['PUT','Update'],['DELETE','Remove']].map(([m,d])=>(
            <div key={m} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className={methodBadge[m]}>{m}</span>
              <span className="text-slate-400 text-xs">{d}</span>
            </div>
          ))}
        </div>

        {/* Endpoints */}
        <div className="space-y-3">
          {fhirEndpoints.map((ep, i) => {
            const key = `${ep.method} ${ep.path}`;
            const isOpen = open === key;
            const status = ran[key];
            const responseText = sampleResponses[key] || '{ "success": true }';

            return (
              <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${methodColors[ep.method]}`}>
                <button
                  onClick={() => toggleOpen(key)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`${methodBadge[ep.method]} w-16 text-center`}>{ep.method}</span>
                    <code className="text-white font-mono text-sm">{ep.path}</code>
                    <span className="text-slate-400 text-xs hidden md:block">{ep.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ep.auth && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/8 px-5 py-4 space-y-4 animate-fade-in">
                    <p className="text-slate-300 text-sm">{ep.description}</p>

                    {ep.body && (
                      <div>
                        <p className="text-slate-500 text-xs mb-1 font-semibold uppercase tracking-wide">Request Body</p>
                        <div className="code-block text-xs relative">
                          <button
                            onClick={() => copyText(ep.body, key + 'req')}
                            className="absolute top-2 right-2 text-slate-500 hover:text-white transition-all"
                          >
                            {copied === key + 'req' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {ep.body}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Sample Response</p>
                        <button
                          onClick={() => copyText(responseText, key + 'res')}
                          className="text-slate-500 hover:text-white transition-all"
                        >
                          {copied === key + 'res' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {status === 'done' ? (
                        <div className="code-block text-xs text-emerald-300 whitespace-pre-wrap">{responseText}</div>
                      ) : (
                        <div className="code-block text-xs text-slate-500">Click "Try it" to see response</div>
                      )}
                    </div>

                    <button
                      onClick={() => runEndpoint(key)}
                      disabled={status === 'loading'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        status === 'loading'
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : status === 'done'
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                          : 'bg-primary-500 hover:bg-primary-400 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      {status === 'loading' ? 'Sending...' : status === 'done' ? '✓ 200 OK' : 'Try it'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security note */}
        <div className="px-5 py-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <p className="text-amber-300 font-semibold text-sm">OAuth2 Security</p>
          </div>
          <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
            <li>All FHIR endpoints protected by OAuth2 Bearer Token</li>
            <li>Client credentials flow with CMS BlueButton sandbox</li>
            <li>All communication uses HTTPS / TLS 1.3</li>
            <li>Rate limiting applies to sandbox environment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
