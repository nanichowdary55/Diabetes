import { patients as dummyPatients } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_BB_BASE_URL || 'https://sandbox.bluebutton.cms.gov';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const TOKEN_STORAGE_KEY = 'bb_api_token';
const TOKEN_BUFFER_MS = 60_000;
const SCOPES = [
  'openid',
  'profile',
  'patient/Patient.read',
  'patient/Coverage.read',
  'patient/ExplanationOfBenefit.read',
].join(' ');

function parsePatientResource(resource) {
  const nameParts = resource.name?.[0] || {};
  const name = [nameParts.given?.join(' '), nameParts.family].filter(Boolean).join(' ') || resource.id;

  const birthDate = resource.birthDate || null;
  const age = birthDate ? Math.max(0, Math.floor((Date.now() - new Date(birthDate).getTime()) / 3.154e10)) : undefined;
  const identifier = resource.identifier?.[0]?.value || resource.id;
  const gender = resource.gender || 'unknown';
  const status = age >= 65 ? 'Critical' : age >= 50 ? 'Warning' : 'Normal';
  const lastReading = Math.min(320, Math.max(70, (identifier.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 220) + 80));
  const device = resource.managingOrganization?.display || 'FHIR Patient';
  const target = '70-180';

  return {
    id: resource.id,
    name,
    gender,
    age,
    birthDate,
    identifier,
    status,
    lastReading,
    device,
    target,
    resource,
  };
}

const FALLBACK_PATIENTS = dummyPatients.map(patient => ({
  id: patient.id,
  name: patient.name,
  gender: patient.gender || 'unknown',
  age: patient.age,
  birthDate: null,
  identifier: patient.id,
  status: patient.status || 'Normal',
  lastReading: patient.lastReading ?? 100,
  device: patient.device || 'FHIR Patient',
  target: patient.target || '70-180',
  type: patient.type,
  resource: null,
}));

function getFallbackPatientById(id) {
  return FALLBACK_PATIENTS.find(patient => patient.id === id) || FALLBACK_PATIENTS[0] || null;
}

function parseBundle(bundle) {
  if (!bundle || bundle.resourceType !== 'Bundle') return [];
  return (bundle.entry || [])
    .map(entry => entry.resource)
    .filter(Boolean)
    .map(parsePatientResource);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

function loadSavedToken() {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) return null;
  try {
    const token = JSON.parse(stored);
    if (!token.access_token || !token.expires_at) return null;
    if (Date.now() + TOKEN_BUFFER_MS >= token.expires_at) return null;
    return token.access_token;
  } catch {
    return null;
  }
}

function saveToken(data) {
  const expiresIn = Number(data.expires_in || 3600);
  const token = {
    access_token: data.access_token,
    expires_at: Date.now() + expiresIn * 1000,
    token_type: data.token_type,
    scope: data.scope,
  };
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
  return token.access_token;
}

async function requestNewToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing VITE_CLIENT_ID or VITE_CLIENT_SECRET in environment variables.');
  }

  const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: SCOPES,
  });

  const response = await fetch(`${BASE_URL}/v3/o/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token request failed ${response.status} ${response.statusText}: ${text}`);
  }

  const payload = await response.json();
  return saveToken(payload);
}

export async function getAccessToken() {
  const stored = loadSavedToken();
  if (stored) return stored;
  return requestNewToken();
}

export async function apiFetch(path, options = {}) {
  const token = await getAccessToken();
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = {
    Accept: 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed ${response.status} ${response.statusText}: ${text}`);
  }
  return response.json();
}

export async function fetchOpenIdConfig(version = 'v3') {
  try {
    return await fetchJson(`${BASE_URL}/${version}/connect/.well-known/openid-configuration`, { headers: { Accept: 'application/json' } });
  } catch (error) {
    console.warn('fetchOpenIdConfig failed, returning dummy configuration.', error);
    return {
      issuer: BASE_URL,
      authorization_endpoint: `${BASE_URL}/${version}/connect/authorize`,
      token_endpoint: `${BASE_URL}/${version}/o/token/`,
      userinfo_endpoint: `${BASE_URL}/${version}/connect/userinfo`,
      jwks_uri: `${BASE_URL}/${version}/o/jwks/`,
    };
  }
}

export async function fetchFHIRMetadata(version = 'v3') {
  try {
    return await apiFetch(`/${version}/fhir/metadata`, { headers: { Accept: 'application/fhir+json' } });
  } catch (error) {
    console.warn('fetchFHIRMetadata failed, returning dummy metadata.', error);
    return {
      resourceType: 'CapabilityStatement',
      status: 'active',
      date: new Date().toISOString(),
      kind: 'instance',
      software: { name: 'Mock FHIR Server', version: '1.0.0' },
      fhirVersion: '4.0.1',
    };
  }
}

export async function fetchPatients({ version = 'v3', count = 20 } = {}) {
  try {
    const bundle = await apiFetch(`/${version}/fhir/Patient?_count=${count}`, { headers: { Accept: 'application/fhir+json' } });
    const parsed = parseBundle(bundle);
    return Array.isArray(parsed) && parsed.length ? parsed : FALLBACK_PATIENTS.slice(0, count);
  } catch (error) {
    console.warn('fetchPatients failed, returning dummy patient list.', error);
    return FALLBACK_PATIENTS.slice(0, count);
  }
}

export async function fetchPatientById(id, { version = 'v3' } = {}) {
  try {
    const resource = await apiFetch(`/${version}/fhir/Patient/${encodeURIComponent(id)}`, { headers: { Accept: 'application/fhir+json' } });
    return parsePatientResource(resource);
  } catch (error) {
    console.warn(`fetchPatientById failed for ${id}, returning dummy patient.`, error);
    return getFallbackPatientById(id);
  }
}

export async function fetchUserInfo(version = 'v3') {
  try {
    return await apiFetch(`/${version}/connect/userinfo`, { headers: { Accept: 'application/json' } });
  } catch (error) {
    console.warn('fetchUserInfo failed, returning dummy user info.', error);
    return {
      sub: 'demo-user',
      name: 'Demo User',
      email: 'demo@diabatic.app',
    };
  }
}

export async function fetchCoveragesForPatient(patientId, { version = 'v3' } = {}) {
  try {
    return await apiFetch(`/${version}/fhir/Coverage?beneficiary=Patient/${encodeURIComponent(patientId)}`, { headers: { Accept: 'application/fhir+json' } });
  } catch (error) {
    console.warn(`fetchCoveragesForPatient failed for ${patientId}, returning dummy coverage bundle.`, error);
    return { resourceType: 'Bundle', entry: [] };
  }
}

export async function fetchEOBForPatient(patientId, { version = 'v3' } = {}) {
  try {
    return await apiFetch(`/${version}/fhir/ExplanationOfBenefit?patient=Patient/${encodeURIComponent(patientId)}`, { headers: { Accept: 'application/fhir+json' } });
  } catch (error) {
    console.warn(`fetchEOBForPatient failed for ${patientId}, returning dummy EOB bundle.`, error);
    return { resourceType: 'Bundle', entry: [] };
  }
}
