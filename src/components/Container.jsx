import React from 'react';

/**
 * Container component that provides consistent max width and centering
 * for all components across the site.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - HTML element to render as
 * @param {boolean} props.fluid - Whether to use full width on all screens
 * @returns {JSX.Element} Container component
 */
export default function Container({ 
  children, 
  className = '', 
  as: Component = 'div',
  fluid = false
}) {
  return (
    <Component 
      className={`w-full px-4 sm:px-6 lg:px-8 mx-auto ${fluid ? '' : 'max-w-7xl'} ${className}`}
    >
      {children}
    </Component>
  );
}