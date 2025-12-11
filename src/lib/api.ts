import { env } from './env';

// 백엔드 API URL 설정
const API_BASE_URL = env.API_BASE_URL;

export type Gender = 'MALE' | 'FEMALE';

export interface AuthStatus {
  logged_in: boolean;
  user_id?: string;
  email?: string;
  name?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  mbti: string | null;
  gender: Gender | null;
}

/**
 * 백엔드 API 호출 (쿠키 자동 포함)
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // 쿠키 포함
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  const hasBody =
    contentType && !contentType.startsWith('text/plain') && contentType.includes('application/json');

  // 204나 빈 응답일 때는 undefined 반환
  if (response.status === 204 || !hasBody) {
    return undefined as T;
  }

  return response.json();
}

/**
 * 로그인 상태 확인
 */
export async function checkAuthStatus(): Promise<AuthStatus> {
  return apiFetch<AuthStatus>('/auth/status');
}

/**
 * 로그아웃
 */
export async function logout(sessionId?: string): Promise<void> {
  const headers = sessionId ? { Authorization: `Bearer ${sessionId}` } : undefined;

  // 우선 /auth/logout 시도, 404면 /logout로 한 번 더 시도
  try {
    await apiFetch<void>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers,
    });
    return;
  } catch (error: any) {
    const message = error?.message || '';
    if (!message.includes('404')) {
      throw error;
    }
  }

  // fallback: prefix 없는 경로
  await apiFetch<void>('/logout', {
    method: 'POST',
    credentials: 'include',
    headers,
  });
}

/**
 * 프로필 조회
 */
export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/user/profile', {
    method: 'GET',
  });
}

/**
 * 회원가입 (추가 정보 입력)
 */
export interface SignupData {
  email: string;
  password: string;
  nickname: string;
  gender: Gender;
  mbti7Letter: string; // 예: "INTJ-ATO"
}

export async function signup(data: SignupData): Promise<void> {
  return apiFetch<void>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 프로필 업데이트 (MBTI 4글자, 성별)
 */
export interface UpdateProfileData {
  mbti: string; // 예: "INTJ"
  gender: Gender; // MALE / FEMALE
}

export async function updateProfile(
  data: UpdateProfileData,
  sessionId?: string
): Promise<void> {
  return apiFetch<void>('/user/profile', {
    method: 'PUT',
    headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : undefined,
    body: JSON.stringify(data),
  });
}

