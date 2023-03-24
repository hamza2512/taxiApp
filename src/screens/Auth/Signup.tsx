import {View} from 'react-native';
import React, {useState} from 'react';

import Header from '../../components/Header';
import {Block, Button, Input, Text} from '../../components';
import {useTheme} from '../../hooks';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {storeData} from '../../AsyncStorage';
import {setDriverId, setUSerData} from '../../../Redux/CounterSlice';
import {useDispatch} from 'react-redux';
const Signup = () => {
  const {colors, sizes, icons} = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const SignupSchema = Yup.object().shape({
    driverID: Yup.string().required('Driver Id required'),
    firstname: Yup.string()
      .min(2, 'First Name too short!')
      .max(30, 'First name too long!')
      .required('First name required'),
    lastname: Yup.string()
      .min(2, 'Last Name too short!')
      .max(30, 'Last Name too long!')
      .required('Last Name required'),
    Liecence: Yup.string()
      .min(2, 'Liscence too short!')
      .max(30, 'Liscence too long!')
      .required('Liscence Plate no required'),
  });

  return (
    <Formik
      initialValues={{
        driverID: '',
        firstname: '',
        lastname: '',
        Liecence: '',
        showErrors: false,
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values: any) => {
        console.log(values);
        await storeData({
          driverID: values.driverID,
          firstname: values.firstname,
          lastname: values.lastname,
          Liecence: values.Liecence,
        });
        dispatch(
          setUSerData({
            driverID: values.driverID,
            firstname: values.firstname,
            lastname: values.lastname,
            Liecence: values.Liecence,
          }),
        );
        dispatch(setDriverId(values.driverID));
        // navigation.navigate('Tab');
      }}>
      {({handleChange, handleSubmit, values, setValues, errors}) => (
        <Block flex={1} scroll keyboard color={colors.white}>
          <Header title="Complete Your Profile" />
          <Block padding={sizes.sm}>
            <Block flex={0} height={350} color={colors.white} paddingTop={40}>
              <Input
                marginTop={sizes.md}
                placeholder="Driver ID"
                icon="email"
                style={{
                  backgroundColor: colors.inputcolor,
                  borderRadius: 5,
                  height: 50,
                }}
                onChangeText={handleChange('driverID')}
              />
              {values.showErrors && errors?.driverID && (
                <Text style={{color: colors.danger}}>*{errors?.driverID}*</Text>
              )}
              <Block flex={0} row>
                <Block width={'40%'} paddingRight={5}>
                  <Input
                    marginTop={sizes.m}
                    placeholder="First Name"
                    style={{
                      backgroundColor: colors.inputcolor,
                      borderRadius: 5,
                      height: 50,
                    }}
                    icon="profiles"
                    onChangeText={handleChange('firstname')}
                  />
                  {values.showErrors && errors?.firstname && (
                    <Text style={{color: colors.danger}}>
                      *{errors?.firstname}*
                    </Text>
                  )}
                </Block>
                <Block width={'40%'} paddingLeft={5}>
                  <Input
                    marginTop={sizes.m}
                    placeholder="Last Name"
                    style={{
                      backgroundColor: colors.inputcolor,
                      borderRadius: 5,
                      height: 50,
                    }}
                    onChangeText={handleChange('lastname')}
                  />
                  {values.showErrors && errors?.lastname && (
                    <Text style={{color: colors.danger}}>
                      *{errors?.lastname}*
                    </Text>
                  )}
                </Block>
              </Block>
              <Block flex={0}>
                <Input
                  placeholder="License Plate no."
                  marginTop={sizes.m}
                  icon="licence"
                  style={{
                    backgroundColor: colors.inputcolor,
                    borderRadius: 5,
                    height: 50,
                  }}
                  onChangeText={handleChange('Liecence')}
                />
              </Block>
              {values.showErrors && errors?.Liecence && (
                <Text style={{color: colors.danger}}>*{errors?.Liecence}*</Text>
              )}
              <Block></Block>
            </Block>
            <Button
              color={colors.lightgreen}
              onPress={() => {
                setValues({...values, showErrors: true}), handleSubmit();
              }}
              radius={20}>
              <Text color={colors.white}>continue</Text>
            </Button>
          </Block>
        </Block>
      )}
    </Formik>
  );
};

export default Signup;
