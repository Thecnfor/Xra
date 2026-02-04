const BASE_URL = "/api";

export interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, init);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `API 请求失败，状态码：${response.status}`);
    }

    return response.json() as Promise<T>;
}

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data instanceof FormData ? data : JSON.stringify(data),
            headers: data instanceof FormData ? options?.headers : {
                "Content-Type": "application/json",
                ...options?.headers
            }
        }),

    put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
        request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json", ...options?.headers }
        }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: "DELETE" }),

    getBaseUrl: () => BASE_URL,
};

export * from "./files";
