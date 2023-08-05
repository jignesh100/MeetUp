import { EuiComboBox, EuiFormRow } from "@elastic/eui";
import React from "react";

function MeetingUserField({
  label,
  options,
  onChange,
  selectedOptions,
  isClearable,
  placeholder,
  singleSelection = false,
  error,
  isInvalid
}: {
  label: string;

  options: any;
  onChange: any;
  selectedOptions: any;
  isClearable: boolean;
  placeholder: string;
  singleSelection: any;
  error:Array<String>;
  isInvalid:boolean;
}) {
  return (
    <EuiFormRow label={label} isInvalid={isInvalid} error={error}>
      <EuiComboBox
        options={options}
        onChange={onChange}
        selectedOptions={selectedOptions}
        singleSelection={singleSelection}
        isClearable={isClearable}
        placeholder={placeholder}
        isInvalid={isInvalid}
      />
    </EuiFormRow>
  );
}

export default MeetingUserField;