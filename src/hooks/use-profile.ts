import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/lib/routes";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  verified: boolean;
  location: string;
  companyName?: string;
  licenseNumber?: string;
  membershipNumber?: string;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
}

const useUserProfile = (authToken: string | null): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (): Promise<void> => {
    if (!authToken) {
      setError("Authentication required");
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();

      if (data.success && data.user) {
        setProfile(data.user);

        localStorage.setItem("userProfile", JSON.stringify(data.user));
      } else {
        throw new Error(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch profile");

      const cachedProfile = localStorage.getItem("userProfile");
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      }
    } finally {
      setLoading(false);
    }
  }, [authToken, toast]);

  const updateProfile = async (
    updatedData: Partial<UserProfile>
  ): Promise<boolean> => {
    if (!authToken) {
      setError("Authentication required");
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      if (data.success && data.user) {
        const updatedProfile = { ...profile, ...data.user };
        setProfile(updatedProfile);

        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        return true;
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");

      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedProfile = localStorage.getItem("userProfile");
    if (cachedProfile) {
      setProfile(JSON.parse(cachedProfile));
    }

    if (authToken) {
      fetchProfile();
    }
  }, [authToken, fetchProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
  };
};

export default useUserProfile;
