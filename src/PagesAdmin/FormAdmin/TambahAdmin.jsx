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
          <div className="py-4">
            <div className="mt-2">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                className="col-span-3"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="mt-2">
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
            <div className="mt-2">
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
