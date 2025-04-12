import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FiMapPin, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getAllAddress,
  makeDefaultAddress,
  updateAddress,
  deleteAddress,
  AddNewAddress,
} from "@/lib/features/address";
import { getUserDetails } from "@/lib/features/auth";
import ButtonMain from "@/components/ButtonMain";

const ShippingAddresses = () => {
  const dispatch = useDispatch<any>();
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState("");

  const initialAddressState = {
    address: "",
    mobile: "",
    country: "India",
    state: "",
    name: "",
    city:"",
    addressType: "Home",
    zipCode: "",
  };

  const [newAddress, setNewAddress] = useState(initialAddressState);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const callGetAllAddress = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());

      if (payload.success) {
        setAddresses(payload?.user?.address);

        if (payload?.user?.defaultAddress) {
          setDefaultAddress(payload?.user?.defaultAddress?._id);
        }
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callGetAllAddress();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { payload } = await dispatch(getAllAddress());
      if (payload.success) {
        setAddresses(payload.addresses);
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch addresses");
    }
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async () => {
    try {
      let payload;
      if (editingAddress) {
        payload = await dispatch(
          updateAddress({
            id: editingAddress._id,
            address: newAddress,
          })
        );
      } else {
        payload = await dispatch(AddNewAddress(newAddress));
      }

      if (payload.payload.success) {
        toast.success(payload.payload.msg);
        setNewAddress(initialAddressState);
        setIsAddressModalOpen(false);
        fetchAddresses();
      } else {
        toast.error(payload.payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add/update address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const { payload } = await dispatch(deleteAddress(id));
      if (payload.success) {
        toast.success(payload.msg);
        fetchAddresses();
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

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setIsAddressModalOpen(true);
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-primary-800">
          Shipping Addresses
        </CardTitle>
        <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen} >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setEditingAddress(null);
                setNewAddress(initialAddressState);
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white hover:opacity-90"
            >
              <FiPlus className="mr-2" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-primary-50 z-50">
            <DialogHeader>
              <DialogTitle className="text-primary-800">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription className="text-primary-600">
                {editingAddress
                  ? "Edit your shipping address details below."
                  : "Enter your new shipping address details."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-primary-700">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newAddress.name}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-primary-300 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right text-primary-700">
                  Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={newAddress.address}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-primary-300 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mobile" className="text-right text-primary-700">
                  Mobile
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={newAddress.mobile}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-primary-300 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right text-primary-700">
                 City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={newAddress.city}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-primary-300 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right text-primary-700">
                 State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-primary-300 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right text-primary-700">
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
                  <SelectTrigger className="col-span-3 border-primary-300 focus:border-primary-500">
                    <SelectValue  placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipCode" className="text-right text-primary-700">
                  Pin Code
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-primary-300 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="addressType"
                  className="text-right text-primary-700"
                >
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
                  <SelectTrigger className="col-span-3 border-primary-300 focus:border-primary-500">
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
            <DialogFooter>
              <Button
                onClick={handleAddressSubmit}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8 flex flex-col justify-center items-center">
            <FiMapPin className="mx-auto h-12 w-12 text-primary-400" />
            <h3 className="mt-2 text-sm font-semibold text-primary-800">
              No addresses
            </h3>
            <p className="mt-1 text-sm text-primary-600">
              Get started by adding a new address.
            </p>
            <ButtonMain
              showArrow={false}
              onClick={() => setIsAddressModalOpen(true)}
              className="mt-6 text-white bg-primary-600 hover:bg-primary-700"
            >
              <FiPlus className="mr-2" /> Add New Address
            </ButtonMain>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <Card
                key={addr?._id}
                className="p-6 space-y-4 hover:shadow-lg transition-shadow bg-primary-100"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg text-primary-800">
                        {addr.name}
                      </h3>
                      {addr.isDefault && (
                        <span className="bg-primary-200 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-primary-700">{addr.address}</p>
                    <p className="text-primary-700">
                     {addr.city} {addr.state}, {addr.country} - {addr.zipCode}
                    </p>
                    <p className="text-primary-700">Phone: {addr.mobile}</p>
                    <p className="text-sm text-primary-600">
                      {addr.addressType}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-primary-200">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={addr?._id === defaultAddress}
                      onCheckedChange={() => handleSetDefaultAddress(addr?._id)}
                      className="data-[state=checked]:bg-primary-600"
                    />
                    <Label className="text-sm text-primary-700">
                      Set as default
                    </Label>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(addr)}
                      className="text-primary-600 hover:text-primary-700 hover:bg-primary-200 border-primary-300"
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(addr?._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingAddresses;