import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { getAuth } from '@firebase/auth';

import Input from '../components/Input';
import { createReservation } from '../api/flaskr_api';

const CreateTripFormSchema = Yup.object({
  resName: Yup.string().required('Trip name is required'),
  resLocation: Yup.string().required('Start date is required'),
  resTime: Yup.string().required('End date is required')
});

const CreateReservation = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(CreateTripFormSchema),
    defaultValues: {
      resName: '',
      resLocation: '',
      resTime: ''
    }
  });

  const onSubmit = async (data) => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    const res = await createReservation(userId, props.tripId, data.resName, data.resLocation, data.resTime);
    if (res.status !== 200) {
      alert('something went wrong! ;-;');
    }
    props.updateReservations(props.tripId, {
      res_name: data.resName,
      res_location: data.resLocation,
      res_time: data.resTime
    });
  };
  const onError = (errors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <p>Create trips form:</p>
      <Input
        name='resName'
        label='Reservation Name'
        placeholder='Enter the reservation name'
        type='text'
        required
        errors={errors}
        register={register}
      />
      <Input
        name='resLocation'
        label='Reservation Location'
        placeholder='Enter the reservation location'
        type='text'
        required
        errors={errors}
        register={register}
      />
      <Input
        name='resTime'
        label='Reservation Time'
        placeholder='Enter the reservation time'
        type='time'
        required
        errors={errors}
        register={register}
      />

      <button type='submit'>Create Reservation</button>
    </form>

  );
};

export default CreateReservation;
