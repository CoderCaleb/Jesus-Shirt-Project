interface Address {
    [key: string]: string | null; // Address can have any key with string values or null
  }
  
  interface DisplayShippingAddressProps {
    address: Address; // Address is an object with keys as strings and values as strings or null
    textStyle: string; // textStyle is a string that is applied to the CSS class
  }
  
  const DisplayShippingAddress: React.FC<DisplayShippingAddressProps> = ({ address, textStyle }) => {
    const renderField = (label: string, value: string | null) => {
      if (value === null || value === "") {
        return null;
      }
      return (
        <p key={label} className={`text-sm ${textStyle}`}>
          {value}
        </p>
      );
    };
  
    return (
      <div>
        {Object.entries(address).map(([key, value]) => {
          return renderField(key, value);
        })}
      </div>
    );
  };
  export default DisplayShippingAddress