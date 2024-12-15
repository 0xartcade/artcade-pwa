import { isTestnet } from "./config";
import { ApiResponse, Game, KYMQuestion, KYMRevealedQuestion, LoginData, User } from "./types";

const baseUrl = isTestnet ? 'https://api-dev.0xartcade.xyz' : 'https://api.0xartcade.xyz';
const authStorageKey = isTestnet ? "artcade-pwa-auth-dev" : "artcade-pwa-auth";

function getAuthToken() {
  return localStorage.getItem(authStorageKey);
}

async function apiFetch(endpoint: string, request?: RequestInit): Promise<Response> {
  const url = new URL(`${baseUrl}${endpoint}`);

  const response = await fetch(url, {
    ...request,
    // credentials: 'include',
    headers: {
      // Set default headers
      'Content-Type': 'application/json',
      'Authorization': `Token ${getAuthToken()}`,
      ...request?.headers,
    },
  });

  return response;
}


async function getUserInfo(): Promise<ApiResponse<User>> {
  const r = await apiFetch("/auth/user-info", { method: 'GET' });

  if (!r.ok) {
    return {
      success: false,
      data: null,
      error: r.status == 401 ? "Unauthorized" : "Something went wrong",
    };
  } else {
    return {
      success: true,
      data: await r.json(),
      error: "",
    }
  }
}

async function loginOTP(code: string): Promise<ApiResponse<LoginData>> {
  const r = await apiFetch("/auth/login/otp", {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

  if (!r.ok) {
    return {
      success: false,
      data: null,
      error: "Something went wrong when trying to link your account. Please try again.",
    };
  } else {
    const data = await r.json();
    localStorage.setItem(authStorageKey, data.token);

    return {
      success: true,
      data,
      error: "",
    }
  }
}

async function startKYMGameplay(): Promise<ApiResponse<number>> {
  const r = await apiFetch("/kym/gameplay", {
    method: "POST"
  });

  if (!r.ok) {
    return {
      success: false,
      data: null,
      error: "Something went wrong when trying to start the game. Please try again.",
    };
  } else {
    return {
      success: true,
      data: (await r.json()).id,
      error: "",
    }
  }
}

async function createKYMQuestion(gameplayId: number): Promise<ApiResponse<KYMQuestion>> {
  const r = await apiFetch(`/kym/gameplay/${gameplayId}/question`, {
    method: "POST"
  });

  if (!r.ok) {
    return {
      success: false,
      data: null,
      error: "Something went wrong when trying to get a question. Please try again.",
    };
  } else {
    return {
      success: true,
      data: await r.json(),
      error: "",
    }
  }
}

async function submitKYMQuestion(questionId: number, title: string, artist: string, supply: number, season: number): Promise<ApiResponse<KYMRevealedQuestion>> {
  const r = await apiFetch(`/kym/question/${questionId}/submit`, {
    method: "POST",
    body: JSON.stringify({ title, artist, supply, season })
  });

  if (!r.ok) {
    return {
      success: false,
      data: null,
      error: "Something went wrong when trying to submit your answer. Please try again.",
    };
  } else {
    return {
      success: true,
      data: await r.json(),
      error: "",
    }
  }
}

async function submitKYMGameplay(gameplayId: number): Promise<ApiResponse<KYMRevealedQuestion>> {
  const r = await apiFetch(`/kym/gameplay/${gameplayId}/submit`, {
    method: "POST"
  });

  if (!r.ok) {
    return {
      success: false,
      data: null,
      error: "Something went wrong when trying to submit your answer. Please try again.",
    };
  } else {
    return {
      success: true,
      data: await r.json(),
      error: "",
    }
  }
}

export const api = {
  getUserInfo,
  loginOTP,
  startKYMGameplay,
  createKYMQuestion,
  submitKYMQuestion,
  submitKYMGameplay
}