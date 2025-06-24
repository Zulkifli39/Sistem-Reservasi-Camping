import {supabase} from "@/SupabaseClient";
import {useState} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import {Input} from "@/components/ui/Input";
import {Label} from "@/components/ui/Label";
import {Button} from "@/components/ui/Button";

export function ProfileSetting({userName, onLogout}) {
  // State untuk membuka/menutup dialog
  const [isOpen, setIsOpen] = useState(true);

  // State form untuk nama dan password baru
  const [formData, setFormData] = useState({
    newName: userName || "", // default dari prop userName
    newPassword: "",
  });

  // State untuk loading saat menyimpan perubahan
  const [loading, setLoading] = useState(false);

  // Mengatur input saat pengguna mengetik
  const handleInputChange = (e) => {
    const {id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Fungsi untuk menyimpan perubahan nama atau password
  const handleSaveChanges = async () => {
    setLoading(true); // mulai loading

    const updates = {};

    // Cek jika nama berubah, tambahkan ke objek update
    if (formData.newName && formData.newName !== userName) {
      updates.data = {full_name: formData.newName};
    }

    // Jika ada input password baru, tambahkan juga
    if (formData.newPassword) {
      updates.password = formData.newPassword;
    }

    // Jika tidak ada yang diubah, beri peringatan
    if (Object.keys(updates).length === 0) {
      alert("Tidak ada perubahan yang dilakukan.");
      setLoading(false);
      return;
    }

    // Kirim update ke Supabase
    const {data, error} = await supabase.auth.updateUser(updates);

    if (error) {
      // Jika gagal update
      console.error("Update error:", error.message);
      alert("Gagal memperbarui profil: " + error.message);
    } else {
      // Jika berhasil update
      console.log("Berhasil update user:", data);
      alert("Berhasil memperbarui profil.");
      setIsOpen(false); // tutup dialog
    }

    setLoading(false); // selesai loading
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your username and password below.</DialogDescription>
        </DialogHeader>

        {/* Form input nama dan password */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newName" className="text-right">
              New Name
            </Label>
            <Input id="newName" value={formData.newName} className="col-span-3" onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              className="col-span-3"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Tombol simpan */}
        <DialogFooter>
          <Button onClick={handleSaveChanges} disabled={loading}>
            {loading ? "Simpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
