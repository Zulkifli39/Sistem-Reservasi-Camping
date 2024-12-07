import {useState, useEffect} from "react";
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

function EditProduct({product, onProductUpdated, isOpen, onClose}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [stockProduct, setStockProduct] = useState(product.stockProduct);
  const [harga, setHarga] = useState(product.harga);
  const [imageURL, setImageURL] = useState(product.image_url);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(product.name || "");
    setDescription(product.description || "");
    setImageURL(product.image_url || "");
    setStockProduct(product.stockProduct || "");
    setHarga(product.harga || "");
  }, [product]);

  const handleFileChange = (event) => setFile(event.target.files[0]);

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

    try {
      const {error} = await supabase.storage.from("images").upload(filePath, file);
      if (error) throw error;

      const {data: publicURLData} = await supabase.storage.from("images").getPublicUrl(filePath);

      setImageURL(publicURLData.publicUrl);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: `Gagal mengunggah gambar: ${error.message}`,
      });
    } finally {
      setUploading(false);
    }
  };

  const updateProduct = async () => {
    try {
      const {error} = await supabase
        .from("products")
        .update({
          name,
          description,
          image_url: imageURL,
          stockProduct,
          harga,
        })
        .eq("id", product.id);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Product berhasil diedit!",
        showConfirmButton: false,
        timer: 1500,
      });

      onProductUpdated();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengedit product.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to your product here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className=" py-4">
          <div className="mt-2">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mt-2">
            <Label htmlFor="description" className="text-right">
              Description
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
          {imageURL && (
            <div className="mt-2">
              <img src={imageURL} alt="Preview" className="w-full h-48 object-cover rounded-md border" />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <Button onClick={updateProduct}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditProduct;
