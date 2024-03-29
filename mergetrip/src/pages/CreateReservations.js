import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { getAuth } from '@firebase/auth';

import Input from '../components/Input';
import { createReservation } from '../api/flaskr_api';
import './Trip.css';

import { BsPlusLg } from 'react-icons/bs';

const FLIGHT_SCHEMA = Yup.object({
  res_org: Yup.string().required('Organization name is required'),
  res_confirmation_num: Yup.string().required('Confirmation Number is required'),
  res_date: Yup.string().required('End date is required'),
  res_from_location: Yup.string().required('Departure location is required'),
  res_to_location: Yup.string().required('Arrival location is required'),
  res_notes: Yup.string()
});
const FLIGHT_TYPES = {
  res_org: { type: 'text', label: 'Organization Name', placeholder: 'Ex: Delta', required: true },
  res_confirmation_num: { type: 'text', label: 'Confirmation Number', placeholder: 'Ex: #AN1234', required: true },
  res_date: { type: 'time', label: 'Date', placeholder: '', required: true },
  res_from_location: { type: 'text', label: 'Departure location', placeholder: 'Ex: IND', required: true },
  res_to_location: { type: 'text', label: 'Arrival location', placeholder: 'Ex: ORD', required: true },
  res_notes: { type: 'textarea', label: 'Additional Notes', placeholder: 'Notes (optional)' }
};

const NON_FLIGHT_SCHEMA = Yup.object({
  res_org: Yup.string().required('Organization name is required'),
  res_confirmation_num: Yup.string().required('Confirmation Number is required'),
  res_checkin: Yup.string().required('Check-in time is required'),
  res_checkout: Yup.string().required('Check-out is required'),
  res_address: Yup.string().required('Address is required'),
  res_notes: Yup.string()
});
const NON_FLIGHT_TYPES = {
  res_org: { type: 'text', label: 'Organization Name', placeholder: 'Ex: Airbnb', required: true },
  res_confirmation_num: { type: 'text', label: 'Confirmation Number', placeholder: 'Ex: #AN1234', required: true },
  res_checkin: { type: 'text', label: 'Checkin Date/Time', placeholder: 'Ex: Thursday 2nd at Noon', required: true },
  res_checkout: { type: 'text', label: 'Checkout Date/Time', placeholder: 'Ex: Thursday 4nd at Noon', required: true },
  res_address: { type: 'text', label: 'Address', placeholder: 'Ex: 1234 Forest Hill Dr', required: true },
  res_notes: { type: 'textarea', label: 'Additional Notes', placeholder: 'Notes (optional)' }
};

const CreateReservation = (props) => {
  const [show, setShow] = useState(false);

  const [isFlight, setIsFlight] = useState(true);
  useEffect(() => {
    reset();
  }, []);

  const toggleShow = () => {
    setShow(prevShow => !prevShow);
  };

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
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    // console.log(data);

    const newRes = Object.keys(isFlight ? FLIGHT_TYPES : NON_FLIGHT_TYPES)
      .reduce((acc, field) => {
        acc[field] = data[field];
        return acc;
      }, {});

    newRes.user_id = userId;
    newRes.res_type = isFlight ? 'Flight' : 'NonFlight';

    // console.log(newRes);
    await createReservation(userId, props.tripId, newRes);
    props.fetchTrips(userId);
    reset();
  };
  const onError = (errors) => {
    console.log(errors);
  };

  return (
    <>
      {
        show
          ? (
            <form className='Trip-form' onSubmit={handleSubmit(onSubmit, onError)}>
              <p>Create a {isFlight ? 'Flight' : 'Non-Flight'}Reservation:</p>
              <select className='form-input' value={isFlight} onChange={() => { setIsFlight(prevIsFlight => !prevIsFlight); }}>
                <option value>Flight</option>
                <option value={false}>Non-Flight</option>
              </select>

              {isFlight
                ? Object.keys(FLIGHT_TYPES).map((field, index) => (
                  <Input
                    key={index}
                    name={field}
                    label={FLIGHT_TYPES[field].label}
                    placeholder={FLIGHT_TYPES[field].placeholder}
                    type={FLIGHT_TYPES[field].type}
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
                    required={NON_FLIGHT_TYPES[field].required}
                    errors={errors}
                    register={register}
                  />
                )
                )}

              <button className='Trip-button' type='button' onClick={toggleShow}>Hide</button>
              <button className='Trip-button' type='submit'>Create Reservation</button>
            </form>
            )
          : <button className='Trip-button' type='button' onClick={toggleShow}>Show create reservation</button>

      }
    </>
  );
};

export default CreateReservation;
