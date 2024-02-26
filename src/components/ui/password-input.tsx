import { InputHTMLAttributes, forwardRef } from "react";
import { Input } from "./input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  showing: boolean;
  onToggleShow: () => void;
}

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, showing, onToggleShow, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          type={showing ? "text" : "password"}
          className={className}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
          <button type="button" onClick={onToggleShow}>
            {showing ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
