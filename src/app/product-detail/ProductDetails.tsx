import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  CreditCard,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import {
  FaCheckCircle,
  FaGem,
  FaTruck,
  FaTshirt,
  FaWhatsapp,
} from "react-icons/fa";

const ProductDetails = ({
  product,
  isInCart,
  isWishlist,
  handleAddToCart,
  toggleWishlist,
  setSelectedSize,
  selectedSize,
}) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (product) {
      setSelectedColor(
        product.colors && product.colors.length > 0 ? product.colors[0] : null
      );
      setSelectedSize(
        product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
      );
    }
  }, [product]);

  // Reset quantity when size changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  const getStockInfo = (size) => {
    if (!size)
      return { text: "Loading...", class: "text-gray-500", icon: AlertCircle };
    if (size.stock > 10) {
      return {
        text: "In Stock",
        class: "text-green-600",
        bg: "bg-green-100",
        icon: Check,
      };
    }
    if (size.stock > 0) {
      return {
        text: "Low Stock",
        class: "text-orange-500",
        bg: "bg-orange-100",
        icon: AlertCircle,
      };
    }
    return {
      text: "Out of Stock",
      class: "text-red-600",
      bg: "bg-red-100",
      icon: AlertCircle,
    };
  };

  const hasAdditionalDetails =
    product?.features && Object.keys(product.features).length > 0;

  const incrementQuantity = () => {
    if (selectedSize && quantity < selectedSize.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-2xl mx-auto md:px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="">
          {/* Right column: Product details */}
          <div className="mt-10 px-1 md:px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="md:text-2xl text-xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-semibold text-gray-900">
                ₹{selectedSize ? selectedSize.price : product.price}
              </p>
            </div>

            {/* Rating */}
            <div className="mt-3">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`${
                        product.rating > rating
                          ? "text-yellow-400 "
                          : "text-gray-300"
                      } h-5 w-5 flex-shrink-0`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <span className="ml-3 text-sm font-medium text-primary-800 hover:text-primary-900">
                  {product.reviewCount} reviews
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4 color-select">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-2 flex space-x-2">
                  <button
                    className="relative w-12 h-12 rounded-full flex items-center justify-center border-2 border-primary-800 focus:outline-none"
                    title={product.color}
                  >
                    <img
                      src={product?.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="sr-only">{product.color}</span>
                  </button>
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      className="relative w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-800"
                      onClick={() =>
                        router.push(
                          `/product-detail/${color.variantId.id}/${params.name}`
                        )
                      }
                      title={color.variantId.color}
                    >
                      <img
                        src={color.variantId.image[0]}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="sr-only">{color.variantId.color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size.id}
                      variant={
                        selectedSize && selectedSize.id === size.id
                          ? "default"
                          : "outline"
                      }
                      className={`px-3 py-1 ${
                        size.stock === 0 ? "opacity-50" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                      disabled={size.stock === 0}
                    >
                      {size.type}
                    </Button>
                  ))}
                </div>
                {selectedSize && (
                  <div
                    className={`mt-4 flex items-center ${
                      getStockInfo(selectedSize).bg
                    } p-2 rounded-md`}
                  >
                    {React.createElement(getStockInfo(selectedSize).icon, {
                      className: `w-5 h-5 mr-2 ${
                        getStockInfo(selectedSize).class
                      }`,
                    })}
                    <span
                      className={`text-sm font-medium ${
                        getStockInfo(selectedSize).class
                      }`}
                    >
                      {getStockInfo(selectedSize).text}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity selector */}
            {selectedSize && selectedSize.stock > 0 && !isInCart && (
              <div className="mt-8">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= selectedSize.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add to cart and wishlist buttons */}
            <div className="mt-8 flex sm:space-x-3 sm:flex-row flex-col gap-2 sm:gap-0">
              <Button
                onClick={() => handleAddToCart(selectedSize, quantity)}
                className="flex-1 bg-primary-900 hover:bg-primary-950 text-white"
                disabled={!selectedSize || selectedSize.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isInCart ? "Remove from Cart" : "Add to Cart"}
              </Button>
              <Button
                onClick={toggleWishlist}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-secondary-100 hover:text-secondary-950"
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${
                    isWishlist ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
            <div className="mt-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-primary-900" />
                  Fast Delivery
                </li>
                <li className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary-900" />
                  Quality Products
                </li>
                <li className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary-900" />
                  Secure payments
                </li>
              </ul>
            </div>

            {/* Product information accordion */}
            <div className="mt-8">
              <Accordion type="single" defaultValue="description" collapsible>
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700">
                      {product.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      Materials: {product.material?.join(", ")}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="details">
                  <AccordionTrigger>Details</AccordionTrigger>
                  <AccordionContent>
                    {hasAdditionalDetails ? (
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {Object.entries(product.features).map(
                          ([key, value], index) => (
                            <li key={index}>
                              <strong>{key}:</strong> {String(value)}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-700">
                        No additional details available.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="additional-info">
                  <AccordionTrigger>Additional Information</AccordionTrigger>
                  <AccordionContent>
                    <dl className="divide-y divide-gray-200">
                      <div className="py-3 flex justify-between text-sm">
                        <dt className="font-medium text-gray-500">SKU</dt>
                        <dd className="text-gray-900">{product.sku}</dd>
                      </div>
                      {product.washCare && (
                        <div className="py-3 flex justify-between text-sm gap-6">
                          <dt className="font-medium text-gray-500 text-nowrap">
                            Wash Care:
                          </dt>
                          <dd className="text-gray-900">{product.washCare}</dd>
                        </div>
                      )}
                      {product.note && (
                        <div className="py-3 flex justify-between text-sm gap-6">
                          <dt className="font-medium text-gray-500 text-nowrap">
                            Note:
                          </dt>
                          <dd className="text-gray-900">{product.note}</dd>
                        </div>
                      )}
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
