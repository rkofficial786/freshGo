import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

const FloatingLabelInput = ({ id, label, width, icon: Icon, className, type, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if the input has an initial value
    setHasValue(!!props.value);
  }, [props.value]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={`relative ${width}`}>
      <Input
        id={id}
        {...props}
        className={`${Icon ? 'pl-10' : ''} pt-6 py-6  bg-white border-gray-200 focus:border-black focus:ring-black transition peer ${className}`}
        placeholder=" "
        type={type === "password" && showPassword ? "text" : type}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value !== "")}
        onChange={handleInputChange}
      />
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-200 ${isFocused || hasValue
          ? "-top-[7.75px] text-xs bg-white px-2"
          : "top-4 text-base"
          } text-gray-500 peer-focus:-top-[7.75px] z-50 peer-focus:text-xs peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-base`}
      >
        {label}
      </label>
      {Icon && <Icon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />}
      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default FloatingLabelInput;
