export const DisplayShippingAddress = ({ address, textStyle }) => {
    const renderField = (label, value) => {
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