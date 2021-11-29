import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { getAuth } from '@firebase/auth';

import Input from '../components/Input';
import { createTrip } from '../api/flaskr_api';
import './CreateTrip.css'

const CreateTripFormSchema = Yup.object({
  tripName: Yup.string().required('Trip name is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required')
});

const CreateTrip = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(CreateTripFormSchema),
    defaultValues: {
      tripName: '',
      startDate: '',
      endDate: ''
    }
  });

  const onSubmit = async (data) => {

    const auth = getAuth();
    const userId = auth.currentUser.uid;

    const res = await createTrip(userId, data.tripName, data.startDate, data.endDate);
    if (res.status !== 200) {
      alert('something went wrong! ;-;');
      return;
    }
    alert("OnSUBMIT");
    props.updateTrips({
      trip_name: data.tripName,
      start_date: data.startDate,
      end_date: data.endDate,
      owner_id: userId,
      reservations: []
    });
    alert("success");
  };
  const onError = (errors) => {
    alert("Error");
    console.log(errors);
  };

  return (
    <div className='Form-containter'>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <header className='Form-header'>Lets Create a trip:</header>
        <Input
          name='tripName'
          type='text'
          placeholder='Trip Name'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='startDate'
          label=''
          placeholder='Start Date'
          type='date'
          errors={errors}
          register={register}
        />
        <Input
          name='endDate'
          label=''
          placeholder='End Date'
          type='date'
          errors={errors}
          register={register}
        />

        <button className='Account-button' type='submit'>Create Trip</button>
      </form>
    </div>
  );
};

export default CreateTrip;
