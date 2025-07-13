import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ formData, handleChange, formErrors, additionalStyles }) => {
  return (
    <div className={`w-full ${additionalStyles}`}>
      <p className="text-sm mb-2">Birthday</p>
      <DatePicker
        selected={formData.birthday}
        onChange={(date) => handleChange("birthday", date?date.toISOString():"")}
        className="w-full"
        customInput={
          <input
            placeholder={"Birthday"}
            className="w-full h-11 bg-transparent border-2 outline-none border-slate-300 pl-3 rounded-[10px] text-sm placeholder-slate-500 font-semibold"
            type="text"
          />
        }
        dateFormat="dd/MM/yyyy"
        wrapperClassName="w-full"
        locale={"en-GB"}
      />
      <p
        className={`text-sm text-red-600 ${formErrors.birthday === "" ? "hidden" : "block"}`}
      >
        {formErrors.birthday}
      </p>
    </div>
  );
};

export default DateInput;
