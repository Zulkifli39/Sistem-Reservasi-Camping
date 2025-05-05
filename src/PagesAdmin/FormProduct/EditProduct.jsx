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

  const updateProduct = async () => {
    try {
      setUploading(true);

      // Handle image upload if a new file is selected
      let finalImageURL = imageURL;
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = fileName;

        // Upload to Supabase Storage
        const {data: uploadData, error: uploadError} = await supabase.storage.from("images").upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {data: publicURLData} = await supabase.storage.from("images").getPublicUrl(filePath);

        finalImageURL = publicURLData.publicUrl;
      }

      // Update product with new data
      const {error} = await supabase
        .from("products")
        .update({
          name,
          description,
          image_url: finalImageURL,
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
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengedit product.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to your product here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
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
        <DialogFooter>
          <Button onClick={updateProduct} disabled={uploading}>
            {uploading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditProduct;
