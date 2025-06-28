import * as React from "react";

export const Switch = React.forwardRef(({ id, checked, onChange, label, ...props }, ref) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      ref={ref}
      className="form-checkbox h-5 w-5 text-sky-600"
      {...props}
    />
    {label && <span className="ml-2">{label}</span>}
  </label>
));