import PropTypes from "prop-types";
import React from "react";

InputArea.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

InputArea.defaultProps = {
  type: "text",
  label: "",
  placeholder: "",
  disabled: false,
};

function InputArea(props) {
  const {
    field,
    form,
    type,
    label,
    placeholder,
    disabled,
    rows,
    cols,
    className,
    maxLength,
  } = props;
  const { name } = field;
  const { errors, touched } = form;
  const showError = (errors[name] && touched[name]) ?? false;

  return (
    <div className="form-group fv-plugins-icon-container">
      {label && (
        <label
          className="font-size-h6 font-weight-bolder text-dark"
          htmlFor={name}
        >
          {label}
        </label>
      )}

      <textarea
        className={`form-control h-auto py-6 rounded-lg ${
          showError ? "is-invalid" : touched[name] ? "is-valid" : ""
        } ${className}`}
        id={name}
        {...field}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
      />

      <div className="fv-plugins-message-container">
        <div className="fv-help-block">{errors[name]}</div>
      </div>
    </div>
  );
}

export default InputArea;
