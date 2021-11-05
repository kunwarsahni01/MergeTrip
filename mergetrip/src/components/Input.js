import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import './Inputs.css';

const Input = (props) => (
  <div className={'px-3 ' + props.className}>
    {props.label
      ? (
        <label
          className='form-label block text-gray-800 text-sm font-medium mb-1'
          htmlFor={props.name}
        >
          {props.label}
          {props.required ? <span className='text-red-600'>*</span> : null}
        </label>
      )
      : null}

    <input
      className='Account-input'
      {...props.register(props.name)}
      name={props.name}
      type={props.type ? props.type : 'text'}
      placeholder={props.placeholder}
      maxLength={props.maxLength}
      onChange={(event) =>
        props.onChangeText ? props.onChangeText(event.target.value) : ''}
    />
    {props.errors
      ? (
        <p>
          <ErrorMessage errors={props.errors} name={props.name} />
        </p>
      )
      : null}
  </div>
);

export default Input;
