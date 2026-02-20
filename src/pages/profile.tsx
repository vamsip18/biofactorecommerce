import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    street: "",
    house_number: "",
    postal_code: "",
    city: "",
    country: "India",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  // ---------------- LOAD USER + PROFILE ----------------
  const loadUserData = async () => {
    try {
      setLoading(true);

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/login");
        return;
      }

      setUser(user);

      // SAFE UPSERT (No more duplicate key error)
      const { data: profileData, error: upsertError } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (upsertError) throw upsertError;

      setProfile(profileData);

      setFormData({
        first_name: profileData.first_name ?? "",
        last_name: profileData.last_name ?? "",
        phone: profileData.phone ?? "",
        street: profileData.street ?? "",
        house_number: profileData.house_number ?? "",
        postal_code: profileData.postal_code ?? "",
        city: profileData.city ?? "",
        country: profileData.country ?? "India",
      });

    } catch (err) {
      console.error(err);
      toast.error(t.messages.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(t.messages.profileUpdated);
      setEditing(false);
      loadUserData();

    } catch (err) {
      console.error(err);
      toast.error(t.messages.errorOccurred);
    } finally {
      setSaving(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          {t.common.loading}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {profile?.first_name || user.email.split("@")[0]}
        </h1>

        {/* Email */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Info</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4">
            {["first_name", "last_name", "phone", "city", "country"].map((key) => (
              <Input
                key={key}
                name={key}
                value={(formData as any)[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                disabled={!editing}
                placeholder={key.replace("_", " ")}
              />
            ))}
          </CardContent>
        </Card>

        {editing && (
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        )}

        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit Profile"}
          </Button>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
