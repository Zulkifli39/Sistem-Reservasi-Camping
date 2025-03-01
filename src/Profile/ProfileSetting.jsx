import {supabase} from "@/SupabaseClient";
import {useState} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

export function ProfileSetting({userName, onLogout}) {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    newName: "",
    newPassword: "",
  });

  // Fungsi Untuk Menangani Perubahan Input
  const handleInputChange = (e) => {
    const {id, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Fungsi Untuk Menyimpan Perubahan
  const handleSaveChanges = async () => {
    await handelSubmitEdit();
  };

  // Fungsi Untuk Melakukan Update Profile User
  const handelSubmitEdit = async (e) => {
    if (e) e.preventDefault();
    const {data, error} = await supabase.auth.updateUser({
      data: {full_name: formData.newName},
      password: formData.newPassword,
    });
    if (error) {
      console.error(error);
    } else {
      console.log("User updated:", data);
      setIsOpen(false); // Tutup dialog setelah berhasil memperbarui
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your username and password below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newName" className="text-right">
              New Name
            </Label>
            <Input id="newName" defaultValue={userName} className="col-span-3" onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              New Password
            </Label>
            <Input id="newPassword" type="password" className="col-span-3" onChange={handleInputChange} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChanges} type="button">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
