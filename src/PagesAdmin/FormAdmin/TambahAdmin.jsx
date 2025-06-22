import {useState} from "react";
import {supabase} from "@/SupabaseClient";
import Swal from "sweetalert2";

import {Button} from "@/Components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

const TambahAdmin = ({onAdminAdded, isOpen, onClose}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin",
  });

  const createAdmin = async (e) => {
    e.preventDefault();

    // Validasi email hanya boleh dengan domain @admin.com
    const domain = "@admin.com";
    if (!formData.email.endsWith(domain)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: `Only emails with the domain ${domain} are allowed for admin registration.`,
        showConfirmButton: false,
        timer: 2500,
      });
      return; // Hentikan proses jika email tidak valid
    }

    try {
      const {error} = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (error) throw error;

      onAdminAdded(); // Panggil fungsi setelah admin berhasil ditambahkan
      onClose();

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Admin has been created successfully.",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Tambah Admin Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={createAdmin}>
          <div className="py-4 ">
            <div className="mt-2 space-y-2">
              <Label htmlFor="fullName" className="text-right">
                Nama Lengkap
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                className="col-span-3"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="mt-2 space-y-2">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                className="col-span-3"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="mt-2 space-y-2">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                className="col-span-3"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="submit">Tambah Admin</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahAdmin;
