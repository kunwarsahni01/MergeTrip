import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { getAuth } from '@firebase/auth';
import Input from '../components/Input';
import { editReservation } from '../api/flaskr_api';
import './Trip.css';

const FLIGHT_SCHEMA = Yup.object({
  res_org: Yup.string().required('Organization name is required'),
  res_confirmation_num: Yup.string().required('Confirmation Number is required'),
  res_date: Yup.string().required('End date is required'),
  res_from_location: Yup.string().required('Departure location is required'),
  res_to_location: Yup.string().required('Arrival location is required'),
  notes: Yup.string()
});

const NON_FLIGHT_SCHEMA = Yup.object({
  res_org: Yup.string().required('Organization name is required'),
  res_confirmation_num: Yup.string().required('Confirmation Number is required'),
  res_checkin: Yup.string().required('Check-in time is required'),
  res_checkout: Yup.string().required('Check-out is required'),
  res_address: Yup.string().required('Address is required'),
  res_notes: Yup.string()
});

const EditReservations = (props) => {
  const FLIGHT_TYPES = {
    res_org: { type: 'text', label: 'Organization Name', placeholder: 'Ex: Delta', required: true, defaultValue: props.res.res_org },
    res_confirmation_num: { type: 'text', label: 'Confirmation Number', placeholder: 'Ex: #AN1234', required: true, defaultValue: props.res.res_confirmation_num },
    res_date: { type: 'time', label: 'Date', placeholder: '', required: true, defaultValue: props.res.res_date },
    res_from_location: { type: 'text', label: 'Departure location', placeholder: 'Ex: IND', required: true, defaultValue: props.res.res_from_location },
    res_to_location: { type: 'text', label: 'Arrival location', placeholder: 'Ex: ORD', required: true, defaultValue: props.res.res_to_location },
    res_notes: { type: 'textarea', label: 'Additional Notes', placeholder: 'Notes (optional)', defaultValue: props.res.res_notes }
  };

  const NON_FLIGHT_TYPES = {
    res_org: { type: 'text', label: 'Organization Name', placeholder: 'Ex: Airbnb', required: true, defaultValue: props.res.res_org },
    res_confirmation_num: { type: 'text', label: 'Confirmation Number', placeholder: 'Ex: #AN1234', required: true, defaultValue: props.res.res_confirmation_num },
    res_checkin: { type: 'text', label: 'Checkin Date/Time', placeholder: 'Ex: Thursday 2nd at Noon', required: true, defaultValue: props.res.res_checkin },
    res_checkout: { type: 'text', label: 'Checkout Date/Time', placeholder: 'Ex: Thursday 4nd at Noon', required: true, defaultValue: props.res.res_checkout },
    res_address: { type: 'text', label: 'Address', placeholder: 'Ex: 1234 Forest Hill Dr', required: true, defaultValue: props.res.res_address },
    res_notes: { type: 'textarea', label: 'Additional Notes', placeholder: 'Notes (optional)', defaultValue: props.res.res_notes }
  };
  const isFlight = props.res.type === 'Flight';

  useEffect(() => {
    reset();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(isFlight ? FLIGHT_SCHEMA : NON_FLIGHT_SCHEMA),
    defaultValues: Object.keys(isFlight ? FLIGHT_SCHEMA : NON_FLIGHT_SCHEMA).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {})
  });

  const onSubmit = async (data) => {
    const newRes = Object.keys(isFlight ? FLIGHT_TYPES : NON_FLIGHT_TYPES)
      .reduce((acc, field) => {
        acc[field] = data[field];
        return acc;
      }, {});

    newRes.user_id = props.userId;
    newRes.type = isFlight ? 'Flight' : 'NonFlight';

    console.log(newRes);
    await editReservation(props.userId, props.tripId, props.res.res_id, newRes);
    props.fetchTrips(props.userId);
    reset();
    props.setShowOptions(false);
  };
  const onError = (errors) => {
    console.log(errors);
  };

  return (
    <>

      <form className='Trip-form' onSubmit={handleSubmit(onSubmit, onError)}>
        {isFlight
          ? Object.keys(FLIGHT_TYPES).map((field, index) => (
            <Input
              key={index}
              name={field}
              label={FLIGHT_TYPES[field].label}
              placeholder={FLIGHT_TYPES[field].placeholder}
              type={FLIGHT_TYPES[field].type}
              defaultValue={FLIGHT_TYPES[field].defaultValue}
              required={FLIGHT_TYPES[field].required}
              errors={errors}
              register={register}
            />
            ))
          : Object.keys(NON_FLIGHT_TYPES).map((field, index) => (
            <Input
              key={index}
              name={field}
              label={NON_FLIGHT_TYPES[field].label}
              placeholder={NON_FLIGHT_TYPES[field].placeholder}
              type={NON_FLIGHT_TYPES[field].type}
              defaultValue={NON_FLIGHT_TYPES[field].defaultValue}
              required={FLIGHT_TYPES[field].required}
              errors={errors}
              register={register}
            />
          )
          )}
        <button className='Trip-button' type='submit'>Edit Reservation</button>
      </form>
    </>
  );
};

export default EditReservations;
