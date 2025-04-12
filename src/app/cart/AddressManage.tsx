import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, Check, X, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import ButtonMain from "@/components/ButtonMain";

import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications
import { getUserDetails } from "@/lib/features/auth";
import {
  AddNewAddress,
  deleteAddress,
  makeDefaultAddress,
  updateAddress,
} from "@/lib/features/address";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiMapPin } from "react-icons/fi";

const AddressManagement = () => {
  const dispatch = useDispatch<any>();

  const initialAddressState = {
    address: "",
    mobile: "",
    country: "India",
    state: "",
    name: "",
    addressType: "Home",
    zipCode: "",
  };

  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState(initialAddressState);
  const [error, setError] = useState("");
  const [personalInfo, setPersonalInfo] = useState({});
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    callGetAllAddress();
  }, []);

  const callGetAllAddress = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());

      if (payload.success) {
        setAddresses(payload?.user?.address);
        setPersonalInfo({
          name: payload?.user?.name,
          email: payload.user.email,
          phone: payload.user.phone,
          _id: payload.user._id,
        });
        if (payload?.user?.defaultAddress) {
          setDefaultAddress(payload?.user?.defaultAddress?._id);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch addresses");
    }
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    if (Object.values(newAddress).some((value) => !value)) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const { payload } = await dispatch(AddNewAddress(newAddress));
      if (payload.success) {
        toast.success(payload.msg);
        setNewAddress(initialAddressState);
        setShowAddressForm(false);
        setError("");
        callGetAllAddress();
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add address");
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress(address);
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const handleUpdateAddress = async () => {
    try {
      const { payload } = await dispatch(
        updateAddress({
          id: editingAddressId,
          address: newAddress,
        })
      );
      if (payload.success) {
        toast.success(payload.msg);
        setNewAddress(initialAddressState);
        setEditingAddressId(null);
        setShowAddressForm(false);
        callGetAllAddress();
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const { payload } = await dispatch(deleteAddress(id));
      if (payload.success) {
        toast.success(payload.msg);
        callGetAllAddress();
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const { payload } = await dispatch(
        makeDefaultAddress({
          addressId: id,
        })
      );
      if (payload.success) {
        toast.success(payload.msg);
        callGetAllAddress();
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to set default address");
    }
  };

  const displayedAddresses = showAllAddresses
    ? addresses
    : addresses.slice(0, 3);

  return (
    <Card className="w-full max-w-3xl mx-auto sticky top-[100px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Manage Delivery Addresses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {displayedAddresses?.map((address) => (
          <div
            key={address._id}
            className={`mb-4 p-4 border rounded-lg ${
              address._id === defaultAddress ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{address.name}</h3>
                {address._id === defaultAddress && (
                  <span className="text-sm text-blue-600 font-medium">
                    Default Address
                  </span>
                )}
              </div>
              <div className="space-x-2 sm:block sm:w-auto flex justify-end flex-wrap w-5/12 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAddress(address)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {address._id !== defaultAddress && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefaultAddress(address._id)}
                  >
                    Set as Default
                  </Button>
                )}
              </div>
            </div>
            <p>{address.name}</p>
            <p>{address.address}</p>
            <p>
              {address.state}, {address.country} {address.zipCode}
            </p>
            <p>{address.mobile}</p>
          </div>
        ))}

        {addresses.length > 3 && !showAllAddresses && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowAllAddresses(true)}
          >
            <ChevronDown className="w-4 h-4 mr-2" /> Show More
          </Button>
        )}

        {showAddressForm ? (
          <div className="space-y-4 mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1  gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    value={newAddress.name}
                    onChange={handleNewAddressChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={newAddress.address}
                  onChange={handleNewAddressChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="country" className="text-left">
                    Country
                  </Label>
                  <Select
                    name="country"
                    value={newAddress.country}
                    onValueChange={(value) =>
                      handleNewAddressChange({
                        target: { name: "country", value },
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">Pin Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={newAddress.zipCode}
                    onChange={handleNewAddressChange}
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Phone</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    placeholder="Phone Number"
                    value={newAddress.mobile}
                    onChange={handleNewAddressChange}
                  />
                </div>
              </div>
              <div className="flex flex-col  gap-4">
                <Label htmlFor="addressType" className="text-left">
                  Type
                </Label>
                <Select
                  name="addressType"
                  value={newAddress.addressType}
                  onValueChange={(value) =>
                    handleNewAddressChange({
                      target: { name: "addressType", value },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Address Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                  setError("");
                }}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button
                onClick={
                  editingAddressId ? handleUpdateAddress : handleAddAddress
                }
              >
                <Check className="w-4 h-4 mr-2" />{" "}
                {editingAddressId ? "Update" : "Save"} Address
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {addresses.length === 0 && (
              <div>
                <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No addresses
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new address.
                </p>
              </div>
            )}
            <ButtonMain
              icon={Plus}
              onClick={() => setShowAddressForm(true)}
              className="w-full mt-4"
            >
              Add New Address
            </ButtonMain>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressManagement;
