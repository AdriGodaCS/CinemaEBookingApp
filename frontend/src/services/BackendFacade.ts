import type { Movie } from "../types/movie";
import type { Show } from "../types/show";

const API_URL = "http://localhost:8080";

type JsonValue = Record<string, unknown> | string | number | boolean | null;

export class BackendError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

export class BackendFacade {
  private getHeaders(body?: unknown, requiresAuth = false): HeadersInit {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (requiresAuth && token) {
      headers.Authorization = "Bearer " + token;
    }

    return headers;
  }

  private request(
    path: string,
    options: Omit<RequestInit, "body" | "headers"> & {
      body?: JsonValue | BodyInit | null;
      headers?: HeadersInit;
      requiresAuth?: boolean;
    } = {},
  ): Promise<unknown> {
    const { body, headers, requiresAuth, ...requestOptions } = options;
    const url =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${API_URL}${path}`;

    return fetch(url, {
      ...requestOptions,
      headers: {
        ...this.getHeaders(body, requiresAuth),
        ...headers,
      },
      ...(body === undefined || body === null
        ? {}
        : { body: typeof body === "string" ? body : JSON.stringify(body) }),
    }).then(async (response) => {
      const text = await response.text();
      let data: unknown = undefined;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof data.message === "string"
            ? data.message
            : `Backend request failed with status ${response.status}`;
        throw new BackendError(message, response.status, data);
      }

      return data;
    });
  }

  getAllMovies() {
    return this.request("/movies");
  }

  getMovieById(id: number) {
    return this.request(`/movies/${id}`);
  }

  searchMovies(title: string) {
    return this.request(`/movies/search?title=${encodeURIComponent(title)}`);
  }

  getMovieByTitle(title: string) {
    return this.request(`/movies/title/${encodeURIComponent(title)}`);
  }

  getMoviesByGenre(genre: string) {
    return this.request(`/movies/genre/${encodeURIComponent(genre)}`);
  }

  getMoviesByStatus(status: string) {
    return this.request(`/movies/status/${encodeURIComponent(status)}`);
  }

  createMovie(movie: JsonValue) {
    return this.request("/movies", {
      method: "POST",
      body: movie,
      requiresAuth: true,
    });
  }

  getShowById(id: number) {
    return this.request(`/shows/${id}`);
  }

  getShowsByMovieId(movieId: number) {
    return this.request(`/shows/by-movie-id/${movieId}`);
  }

  getShowsByShowroomId(showroomId: number) {
    return this.request(`/shows/by-showroom-id/${showroomId}`);
  }

  getAvailableTimeslots(showDate: string, showroomId: number) {
    const query = new URLSearchParams({
      showDate,
      showroomId: String(showroomId),
    });
    return this.request(`/shows/available-timeslots?${query}`);
  }

  getAvailableShowrooms(showDate: string) {
    return this.request(
      `/shows/available-showrooms?${new URLSearchParams({ showDate })}`,
    );
  }

  createShow(show: JsonValue) {
    return this.request("/shows", {
      method: "POST",
      body: show,
      requiresAuth: true,
    });
  }

  getAllShowrooms() {
    return this.request("/showrooms");
  }

  getShowroomById(id: number) {
    return this.request(`/showrooms/${id}`);
  }

  getShowroomByName(name: string) {
    return this.request(`/showrooms/name/${encodeURIComponent(name)}`);
  }

  getShowroomsBySeatCount(seatCount: number) {
    return this.request(`/showrooms/seats/${seatCount}`);
  }

  getSeatLocksByShowId(showId: number) {
    return this.request(`/seatlocks/show/${showId}`, { requiresAuth: true });
  }

  createSeatLock(showId: number, seatLock: JsonValue) {
    return this.request(`/seatlocks/show/${showId}`, {
      method: "POST",
      body: seatLock,
      requiresAuth: true,
    });
  }

  deleteSeatLock(seatLockId: number, request: JsonValue) {
    return this.request(`/seatlocks/${seatLockId}`, {
      method: "DELETE",
      body: request,
      requiresAuth: true,
    });
  }

  checkResetPasswordToken(userId: number, token: string) {
    return this.request(
      `/users/${userId}/checkResetPasswordToken?${new URLSearchParams({ token })}`,
    );
  }

  getCurrentUser() {
    return this.request("/users/me", { requiresAuth: true });
  }

  getUserById(userId: number) {
    return this.request(`/users/${userId}`, { requiresAuth: true });
  }

  getFavorites(userId: number) {
    return this.request(`/users/${userId}/favorites`, { requiresAuth: true });
  }

  verifyUser(token: string) {
    return this.request(`/users/verify?${new URLSearchParams({ token })}`);
  }

  createUser(user: JsonValue) {
    return this.request("/users", { method: "POST", body: user });
  }

  forgotPassword(request: JsonValue) {
    return this.request("/users/forgot-password", {
      method: "POST",
      body: request,
    });
  }

  login(request: JsonValue) {
    return this.request("/users/login", { method: "POST", body: request });
  }

  addPaymentCard(userId: number, card: JsonValue) {
    return this.request(`/users/${userId}/cards`, {
      method: "POST",
      body: card,
      requiresAuth: true,
    });
  }

  addFavorite(userId: number, movieId: number) {
    return this.request(`/users/${userId}/favorites/${movieId}`, {
      method: "POST",
      requiresAuth: true,
    });
  }

  resetPassword(request: JsonValue) {
    return this.request("/users/reset-password", {
      method: "PUT",
      body: request,
    });
  }

  updateProfile(userId: number, profile: JsonValue) {
    return this.request(`/users/${userId}/profile`, {
      method: "PUT",
      body: profile,
      requiresAuth: true,
    });
  }

  updatePreferences(userId: number, preferences: JsonValue) {
    return this.request(`/users/${userId}/preferences`, {
      method: "PUT",
      body: preferences,
      requiresAuth: true,
    });
  }

  changePassword(userId: number, password: JsonValue) {
    return this.request(`/users/${userId}/password`, {
      method: "PUT",
      body: password,
      requiresAuth: true,
    });
  }

  deleteUser(userId: number, request: JsonValue) {
    return this.request(`/users/${userId}/delete`, {
      method: "DELETE",
      body: request,
      requiresAuth: true,
    });
  }

  removePaymentCard(userId: number, cardId: string) {
    return this.request(
      `/users/${userId}/cards/${encodeURIComponent(cardId)}`,
      {
        method: "DELETE",
        requiresAuth: true,
      },
    );
  }

  removeFavorite(userId: number, movieId: number) {
    return this.request(`/users/${userId}/favorites/${movieId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  }
}

export const backendFacade = new BackendFacade();

export type { Movie, Show };
