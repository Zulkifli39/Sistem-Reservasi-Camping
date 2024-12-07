import {useState} from "react";
import {supabase} from "../../SupabaseClient";
import Swal from "sweetalert2";

// ShadCn Components
import {Button} from "@/components/ui/button";
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

function TambahProduct({onProductAdded, isOpen, onClose}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stockProduct, setStockProduct] = useState("");
  const [harga, setHarga] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Untuk Upload Gambar Di Supabase
  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "File belum dipilih",
        text: "Silakan pilih file untuk diunggah.",
      });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Melakukan Upload ke images supabase
    try {
      const {data, error} = await supabase.storage.from("images").upload(filePath, file);

      if (error) {
        throw error;
      }

      const {data: publicURLData} = await supabase.storage.from("images").getPublicUrl(filePath);
      setFileURL(publicURLData.publicUrl);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: `Gagal mengunggah file: ${error.message}`,
      });
    } finally {
      setUploading(false);
    }
  };

  // Untuk Melakukan Add Product Ketika Sudah Diisi Semua
  const createProduct = async () => {
    if (!name || !description || !fileURL || !stockProduct || !harga) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Mohon lengkapi semua data sebelum menambahkan produk.",
      });
      return;
    }

    try {
      const {data, error} = await supabase
        .from("products")
        .insert({
          name,
          description,
          image_url: fileURL, // Tambahkan URL file
          stockProduct,
        })
        .single();

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Produk berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 2000,
      });

      onProductAdded();
    } catch (error) {
      console.error("Error adding product: ", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menambahkan produk.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Tambah Product Baru</DialogTitle>
          <DialogDescription>Make changes to your product here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className=" py-4">
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
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              uploading ? "bg-gray-400" : "bg-indigo-500 hover:bg-indigo-600"
            }`}>
            {uploading ? "Mengunggah..." : "Unggah Gambar"}
          </button>

          {fileURL && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">File berhasil diunggah:</p>
              <img src={fileURL} alt="Uploaded File" className="w-full max-h-40 object-cover mt-2 rounded-md" />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button onClick={createProduct}>Tambah Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TambahProduct;
