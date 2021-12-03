import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { getAuth } from '@firebase/auth';

import Input from '../components/Input';
import { createTrip } from '../api/flaskr_api';
import './CreateTrip.css';

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
    await createTrip(userId, data.tripName, data.startDate, data.endDate);
    props.fetchTrips(userId);
  };
  const onError = (errors) => {
    alert('Error');
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
          label='Trip Name'
          placeholder='Trip Name'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='startDate'
          label='Start Date'
          placeholder='Start Date'
          type='date'
          required
          errors={errors}
          register={register}
        />
        <Input
          name='endDate'
          label='End Date'
          placeholder='End Date'
          type='date'
          required
          errors={errors}
          register={register}
        />

        <button className='Account-button' type='submit'>Create Trip</button>
      </form>
    </div>
  );
};

export default CreateTrip;
