import { useState, useRef } from "react";

import { Save, Camera } from "lucide-react";

import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import PatientAvatar from "../../components/doctor/PatientAvatar";

import { useAuth } from "../../context/AuthContext";
import { doctorNav } from "./doctorNav";

export default function Profile() {
  const { currentUser, updateCurrentUser } = useAuth();

  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);

  const [form, setForm] = useState({
    fullName: currentUser?.fullName || "Ahmed Hassan",
    specialty: currentUser?.specialty || "Cardiologist",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "+20 100 555 0199",
    clinic: currentUser?.clinic || "MedTrack Medical Center",
    bio:
      currentUser?.bio ||
      "Board-certified cardiologist with over 12 years of clinical experience in preventive cardiology and hypertension management.",
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Validation
  const validate = () => {
    const e = {};

    if (!form.fullName.trim()) {
      e.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email";
    }

    if (!form.specialty.trim()) {
      e.specialty = "Specialty is required";
    }

    return e;
  };

  // Change profile image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  // Save profile
  const handleSave = (e) => {
    e.preventDefault();

    const errs = validate();

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    // Update the logged-in user's data in AuthContext
    updateCurrentUser({
      fullName: form.fullName,
      specialty: form.specialty,
      email: form.email,
      phone: form.phone,
      clinic: form.clinic,
      bio: form.bio,
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <DashboardShell navItems={doctorNav}>
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Profile
        </h1>

        <p className="text-mist-400 mt-1">
          Manage your professional information.
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <Alert
          type="success"
          title="Profile updated"
          className="mb-5"
        >
          Your changes have been saved.
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Profile Preview */}
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="relative">

            {/* Profile Image */}
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-[88px] h-[88px] rounded-full object-cover border border-ink-border"
              />
            ) : (
              <PatientAvatar
                name={form.fullName}
                color="#17b9c4"
                size={88}
              />
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-teal-500 text-ink-950 flex items-center justify-center hover:bg-teal-400 transition-colors"
              aria-label="Change photo"
              title="Change photo"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* Preview Name */}
          <h2 className="text-lg font-semibold mt-4">
            {form.fullName}
          </h2>

          <p className="text-mist-400 text-sm">
            {form.specialty}
          </p>

          <p className="text-mist-500 text-xs mt-1">
            {form.clinic}
          </p>
        </Card>

        {/* Profile Form */}
        <Card className="p-6 lg:col-span-2">
          <form
            onSubmit={handleSave}
            className="flex flex-col gap-4"
          >

            {/* Name + Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName: e.target.value,
                  })
                }
                error={errors.fullName}
              />

              <Input
                label="Specialty"
                value={form.specialty}
                onChange={(e) =>
                  setForm({
                    ...form,
                    specialty: e.target.value,
                  })
                }
                error={errors.specialty}
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                error={errors.email}
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            {/* Clinic */}
            <Input
              label="Clinic / Hospital"
              value={form.clinic}
              onChange={(e) =>
                setForm({
                  ...form,
                  clinic: e.target.value,
                })
              }
            />

            {/* Bio */}
            <div className="w-full">
              <label className="block text-sm font-medium text-mist-300 mb-1.5">
                Bio
              </label>

              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bio: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-ink-850 border border-ink-border text-mist-100 placeholder:text-mist-500 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="self-start mt-2"
            >
              <Save size={15} />
              Save Changes
            </Button>

          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}