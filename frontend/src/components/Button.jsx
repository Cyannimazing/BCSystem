const Button = ({ type = "submit", className = "", ...props }) => {
  // Base required styles that are always applied
  const baseStyles = "inline-flex items-center px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  
  // Default button styles (applied when no custom className is provided)
  const defaultStyles = "bg-gray-800 border border-transparent text-white hover:bg-gray-700 focus:ring-gray-500";
  
  // If custom className is provided, use it with base styles, otherwise use base + default
  const finalClassName = className.trim() 
    ? `${baseStyles} ${className}`
    : `${baseStyles} ${defaultStyles}`;
  
  return (
    <button
      type={type}
      className={finalClassName}
      {...props}
    />
  );
};

export default Button;
