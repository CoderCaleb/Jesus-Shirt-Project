export const appearance = {
    theme: "flat", 
    variables: {
      fontFamily: "sans-serif",
      fontLineHeight: "1.5",
      borderRadius: "10px",
      colorBackground: "#FFFFFF",
      accessibleColorOnColorPrimary: "#FFFFFF",
    },
    rules: {
      ".Block": {
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input": {
        padding: "12px",
        fontWeight: "550",
        fontSize: "15px",
        border: "2px solid #cbd5e1",
      },
      ".Input::placeholder": {
        color: "#64748b",
      },
      ".Input:disabled, .Input--invalid:disabled": {
        color: "lightgray",
      },
      ".Tab": {
        padding: "10px 12px 8px 12px",
        border: "none",
      },
      ".Tab:hover": {
        border: "none",
        boxShadow:
          "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
      },
      ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
        border: "none",
        backgroundColor: "#fff",
        boxShadow:
          "0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
      },
      ".Label": {
        fontWeight: "500",
        fontSize: "14px",
        paddingBottom: "6px",
      },
    },
  };

  export const addressElementOptions = {
    mode: "shipping",
  };