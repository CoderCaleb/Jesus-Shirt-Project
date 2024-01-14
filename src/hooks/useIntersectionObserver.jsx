import React, { useEffect, useState } from "react";

export default function useIntersectionObserver(element,options) {
  const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting){
            setIsIntersecting(true)
          }
          else{
            setIsIntersecting(false)
          }
        });
      }, options);
  
      if (element) {
        observer.observe(element);
      }
  
      // Cleanup when the component unmounts or when the element changes
      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    }, [element, options]);
  return isIntersecting;
}
