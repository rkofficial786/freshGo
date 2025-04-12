"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiUpload } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { categories } from "@/constants/contsants";

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  stockQuantity: number;
  unit: string;
  sku: string;
  category: string;
  isFeatured: boolean;
  hide: boolean;
  img: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  mrp?: string;
  stockQuantity?: string;
  unit?: string;
  category?: string;
  sku?: string;
}

const unitOptions = [
  "item",
  "kg",
  "g",
  "lb",
  "oz",
  "l",
  "ml",
  "dozen",
  "piece",
  "pack",
  "box",
  "bottle",
  "can",
];

const EditProduct = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    stockQuantity: "",
    unit: "",
    sku: "",
    category: "",
    isFeatured: false,
    hide: false,
    image: null as File | null,
    imagePreview: null as string | null,
    keepExistingImage: true,
  });
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          const productData = data.product;
          setProduct({
            name: productData.name || "",
            description: productData.description || "",
            price: productData.price?.toString() || "",
            mrp: productData.mrp?.toString() || "",
            stockQuantity: productData.stockQuantity?.toString() || "",
            unit: productData.unit || "",
            sku: productData.sku || "",
            category: productData.category || "",
            isFeatured: productData.isFeatured || false,
            hide: productData.hide || false,
            image: null,
            imagePreview: productData.img || null,
            keepExistingImage: true,
          });
        } else {
          toast.error("Failed to load product");
        //   router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error loading product");
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = (name: "hide" | "isFeatured") => {
    setProduct({ ...product, [name]: !product[name] });
  };

  const handleCategoryChange = (value: string) => {
    setProduct({ ...product, category: value });
  };

  const handleUnitChange = (value: string) => {
    setProduct({ ...product, unit: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProduct({
        ...product,
        image: file,
        imagePreview: URL.createObjectURL(file),
        keepExistingImage: false,
      });
    }
  };

  const removeImage = () => {
    if (product.imagePreview && !product.keepExistingImage) {
      URL.revokeObjectURL(product.imagePreview);
    }
    setProduct({
      ...product,
      image: null,
      imagePreview: null,
      keepExistingImage: false,
    });
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!product.name) errors.name = "Product name is required";
    if (!product.price) errors.price = "Price is required";
    if (!product.mrp) errors.mrp = "MRP is required";
    if (parseFloat(product.price) > parseFloat(product.mrp)) 
      errors.price = "Price cannot be higher than MRP";
    if (!product.unit) errors.unit = "Unit is required";
    if (!product.category) errors.category = "Category is required";
    if (!product.stockQuantity) errors.stockQuantity = "Stock quantity is required";
    if (!product.sku) errors.sku = "SKU is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description || "");
    formData.append("price", product.price);
    formData.append("mrp", product.mrp);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("unit", product.unit);
    formData.append("sku", product.sku);
    formData.append("category", product.category);
    formData.append("isFeatured", String(product.isFeatured));
    formData.append("hide", String(product.hide));
    formData.append("keepExistingImage", String(product.keepExistingImage));

    if (product.image) {
      formData.append("file", product.image);
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Product updated successfully");
        router.push("/admin/products");
      } else {
        toast.error(data.msg || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          Back to Products
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById("image")?.click()}
              >
                <FiUpload className="mr-2" /> Upload New Image
              </Button>
              <span>
                {product.image ? "1 file selected" : product.imagePreview ? "Using existing image" : "No image"}
              </span>
            </div>
            {product.imagePreview && (
              <div className="mt-4 relative inline-block">
                <img
                  src={product.imagePreview}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="name">Product Name*</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sku">SKU (Stock Keeping Unit)*</Label>
            <Input
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleInputChange}
              className={formErrors.sku ? "border-red-500" : ""}
            />
            {formErrors.sku && (
              <p className="text-red-500 text-sm mt-1">{formErrors.sku}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Selling Price (₹)*</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              onChange={handleInputChange}
              className={formErrors.price ? "border-red-500" : ""}
            />
            {formErrors.price && (
              <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mrp">MRP (₹)*</Label>
            <Input
              id="mrp"
              name="mrp"
              type="number"
              step="0.01"
              min="0"
              value={product.mrp}
              onChange={handleInputChange}
              className={formErrors.mrp ? "border-red-500" : ""}
            />
            {formErrors.mrp && (
              <p className="text-red-500 text-sm mt-1">{formErrors.mrp}</p>
            )}
          </div>

          <div>
            <Label htmlFor="stockQuantity">Stock Quantity*</Label>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              value={product.stockQuantity}
              onChange={handleInputChange}
              className={formErrors.stockQuantity ? "border-red-500" : ""}
            />
            {formErrors.stockQuantity && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.stockQuantity}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="unit">Unit*</Label>
            <Select
              value={product.unit}
              onValueChange={handleUnitChange}
            >
              <SelectTrigger
                className={formErrors.unit ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.unit && (
              <p className="text-red-500 text-sm mt-1">{formErrors.unit}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category*</Label>
            <Select
              value={product.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                className={formErrors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
            )}
          </div>

          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={product.isFeatured}
              onCheckedChange={() => handleCheckboxChange("isFeatured")}
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              Feature this product (display on homepage)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hide"
              checked={product.hide}
              onCheckedChange={() => handleCheckboxChange("hide")}
            />
            <label htmlFor="hide" className="text-sm font-medium">
              Hide product from store
            </label>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating Product..." : "Update Product"}
          </Button>
          
          <Button 
            type="button" 
            variant="destructive"
            onClick={() => router.push("/admin/products")}
            className="w-32"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;