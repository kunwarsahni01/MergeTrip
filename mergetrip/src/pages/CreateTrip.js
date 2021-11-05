import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { getAuth } from '@firebase/auth';

import Input from '../Components/Input';
import { createTrip } from '../api/flaskr_api';

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

    props.updateTrips({
      trip_name: data.tripName,
      start_date: data.startDate,
      end_date: data.endDate,
      owner_id: userId,
      reservations: []
    });
  };
  const onError = (errors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <p>Create trips form:</p>
      <Input
        name='tripName'
        label='Trip Name'
        placeholder='Enter the trip name'
        type='text'
        required
        errors={errors}
        register={register}
      />
      <Input
        name='startDate'
        label='Start Date'
        placeholder='Enter the start date'
        type='date'
        required
        errors={errors}
        register={register}
      />
      <Input
        name='endDate'
        label='End Date'
        placeholder='Enter the end date'
        type='date'
        required
        errors={errors}
        register={register}
      />

      <button type='submit'>Create Trip</button>
    </form>

  );
};

export default CreateTrip;
