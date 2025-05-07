import {useState} from "react";
import {supabase} from "../../SupabaseClient";
import Swal from "sweetalert2";

// ShadCn Components
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

function TambahProduct({onProductAdded, isOpen, onClose}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stockProduct, setStockProduct] = useState("");
  const [harga, setHarga] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Combined function to handle both upload and product creation
  const createProduct = async () => {
    if (!name || !description || !file || !stockProduct || !harga) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Mohon lengkapi semua data sebelum menambahkan produk.",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload image first
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const {data: uploadData, error: uploadError} = await supabase.storage.from("images").upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {data: publicURLData} = await supabase.storage.from("images").getPublicUrl(filePath);

      // Create product with image URL
      const {data, error} = await supabase
        .from("products")
        .insert({
          name,
          description,
          image_url: publicURLData.publicUrl,
          stockProduct,
          harga,
        })
        .single();

      if (error) throw error;

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 2000,
      });

      // Clear form
      setName("");
      setDescription("");
      setStockProduct("");
      setHarga("");
      setFile(null);

      onProductAdded();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menambahkan produk.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Tambah Alat Baru</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mt-2">
            <Label htmlFor="name" className="text-right">
              Nama Product
            </Label>
            <Input id="name" value={name} className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mt-2">
            <Label htmlFor="description" className="text-right">
              Deskripsi Produk
            </Label>
            <Input
              id="description"
              value={description}
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="stockProduct" className="text-right">
              Stock Product
            </Label>
            <Input
              id="stockProduct"
              value={stockProduct}
              className="col-span-3"
              onChange={(e) => setStockProduct(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="harga" className="text-right">
              Harga
            </Label>
            <Input id="harga" value={harga} className="col-span-3" onChange={(e) => setHarga(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="file" className="text-left mt-2">
              Image
            </Label>
            <input type="file" id="file" className="mt-2" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button onClick={createProduct} disabled={uploading}>
            {uploading ? "Menambahkan..." : "Tambah Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TambahProduct;
