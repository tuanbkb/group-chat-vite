import { get, post, put } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";

async function getAuthHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet(apiName: string, path: string, options: any = {}) {
  const headers = {
    ...(options.headers || {}),
    ...(await getAuthHeader()),
  };

  const res = await get({
    apiName,
    path,
    options: { ...options, headers },
  }).response;

  return res.body.json();
}

export async function apiPost(
  apiName: string,
  path: string,
  body: any,
  options: any = {}
) {
  const headers = {
    ...(options.headers || {}),
    ...(await getAuthHeader()),
    'Content-Type': 'application/json',
  };

  const res = await post({
    apiName,
    path,
    options: { ...options, body, headers },
  }).response;

  return res.body.json();
}

export async function apiPut(
  apiName: string,
  path: string,
  body: any,
  options: any = {}
) {
  const headers = {
    ...(options.headers || {}),
    ...(await getAuthHeader()),
    'Content-Type': 'application/json',
  };

  const res = await put({
    apiName,
    path,
    options: { ...options, body, headers },
  }).response;

  return res.body.json();
}