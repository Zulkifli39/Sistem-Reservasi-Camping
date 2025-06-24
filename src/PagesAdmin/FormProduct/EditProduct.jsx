import {useState, useEffect} from "react";
import {supabase} from "../../SupabaseClient";
import Swal from "sweetalert2";

// ShadCn Components
import {Button} from "@/components/ui/Button.jsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/Dialog.jsx";
import {Input} from "@/components/ui/Input.jsx";
import {Label} from "@/components/ui/Label.jsx";

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
      <DialogContent className="w-[95%] max-w-[480px] h-[90vh] overflow-y-auto rounded-lg p-4 md:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl md:text-2xl font-bold">Edit Alat</DialogTitle>
        </DialogHeader>

        <div className=" space-y-2">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nama Alat
            </Label>
            <Input
              id="name"
              value={name}
              className="w-full px-3 py-2 text-sm"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Deskripsi Alat
            </Label>
            <Input
              id="description"
              value={description}
              className="w-full px-3 py-2 text-sm"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </div>

          {/* Stock Input */}
          <div className="space-y-2">
            <Label htmlFor="stockProduct" className="text-sm font-medium">
              Stock Alat
            </Label>
            <Input
              id="stockProduct"
              value={stockProduct}
              type="number"
              className="w-full px-3 py-2 text-sm"
              onChange={(e) => setStockProduct(e.target.value)}
              placeholder="Enter stock amount"
            />
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="harga" className="text-sm font-medium">
              Harga
            </Label>
            <Input
              id="harga"
              value={harga}
              type="number"
              className="w-full px-3 py-2 text-sm"
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              Image
            </Label>
            <div className="mt-1">
              <input
                type="file"
                id="file"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Image Preview */}
          {imageURL && (
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">Current Image</Label>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <img src={imageURL} alt="Preview" className="h-full w-full object-cover" />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-end sm:space-x-2 mt-6">
          <Button onClick={updateProduct} disabled={uploading} className="w-full sm:w-auto">
            {uploading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditProduct;
