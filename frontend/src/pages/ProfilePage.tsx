import { useEffect, useState, type ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import type { Movie } from '@/types/movie'
import "./ProfilePage.css";

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  recievePromotions: boolean;
  homeAddress: Address | null;
};

function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [favorites, setFavorites] =
    useState<Movie[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) return;

    loadProfile();
    loadFavorites();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:8080/users/${user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();

      if (!data.homeAddress) {
        data.homeAddress = {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        };
      }

      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:8080/users/${user.id}/favorites`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load favorites"
        );
      }

      const data = await response.json();

      setFavorites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!profile) return;

    const { name, value, type, checked } =
      event.target;

    setProfile({
      ...profile,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleAddressChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!profile) return;

    setProfile({
      ...profile,
      homeAddress: {
        ...(profile.homeAddress ?? {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        }),
        [event.target.name]:
          event.target.value,
      },
    });
  };

  const saveProfile = async () => {
    if (!profile || !user) return;

    try {
      const response = await fetch(
        `http://localhost:8080/users/${user.id}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            homeAddress:
              profile.homeAddress,
            recievePromotions:
              profile.recievePromotions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save profile"
        );
      }      
    } catch (error) {
      console.error(error);
      alert(
        "Unable to save profile."
      );
    }
  };

  const removeFavorite = async (
    movieId: number
  ) => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:8080/users/${user.id}/favorites/${movieId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to remove favorite"
        );
      }

      setFavorites((prev) =>
        prev.filter(
          (movie) =>
            movie.id !== movieId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!profile) {
    return <h2>Profile not found.</h2>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <section className="profile-section">
        <h2>Account Information</h2>

        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
        />

        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="text"
          value={profile.email}
          disabled
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="recievePromotions"
            checked={
              profile.recievePromotions
            }
            onChange={handleChange}
          />
          Receive Promotions
        </label>
      </section>

      <section className="profile-section">
        <h2>Home Address</h2>

        <label>Street</label>
        <input
          type="text"
          name="street"
          value={
            profile.homeAddress?.zipCode ?? ""
          }
          onChange={handleAddressChange}
        />

        <label>City</label>
        <input
          type="text"
          name="city"
          value={
            profile.homeAddress?.city ??
            ""
          }
          onChange={handleAddressChange}
        />

        <label>State</label>
        <input
          type="text"
          name="state"
          value={
            profile.homeAddress?.state ??
            ""
          }
          onChange={handleAddressChange}
        />

        <label>Zip Code</label>
        <input
          type="text"
          name="zipCode"
          value={
            profile.homeAddress?.zipCode ??
            ""
          }
          onChange={handleAddressChange}
        />
      </section>

      <button
        className="save-profile-btn"
        onClick={saveProfile}
      >
        Save Changes
      </button>

      <section className="favorites-section">
        <h2>Favorite Movies</h2>

        {favorites.length === 0 ? (
          <p>
            You have no favorite movies.
          </p>
        ) : (
          <div className="favorites-grid">
            {favorites.map((movie) => (
              <div
                key={movie.id}
                className="favorite-movie"
              >
                <MovieCard
                  id={movie.id}
                  poster_url={
                    movie.posterUrl
                  }
                  title={movie.title}
                  genre={movie.genre}
                  rating={movie.rating}
                  showFavoriteButton={false}
                />

                <button
                  className="remove-favorite-btn"
                  onClick={() =>
                    removeFavorite(
                      movie.id
                    )
                  }
                >
                  Remove Favorite
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;