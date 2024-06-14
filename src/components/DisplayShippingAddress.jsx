export const DisplayShippingAddress = ({ address }) => {
    const renderField = (label, value) => {
      if (value === null || value === "") {
        return null;
      }
      return (
        <p key={label} className="text-sm text-slate-600">
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