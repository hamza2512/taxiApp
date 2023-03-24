import { StyleSheet, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Block, Button, Input, Text } from '../../components';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useTheme } from '../../hooks';
import { color } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store';

const Signin = () => {
    const { colors, sizes } = useTheme()
    const [pwdvisible, setPwdvisible] = useState(false);
    const navigation = useNavigation()


    return (
        <Formik
            initialValues={{
                driverId: '',
            }}
            // validationSchema={ }
            onSubmit={async (values: any) => {
                console.log(values);

            }}>
            {({ handleChange, handleSubmit, values, setValues, errors }) => (
                <Block safe>
                    <Block scroll flex={1} color={colors.white}  >
                        <Header title='Login to your   Account' />
                        <Block padding={sizes.sm} flex={0} height={200} justify="center">
                            <Input
                                marginTop={sizes.md}
                                placeholder="Driver ID"
                                icon="email"
                                style={{ backgroundColor: colors.inputcolor, borderRadius: 5, height: 50 }}
                                onChangeText={handleChange('driverId')}
                            />
                            {errors?.email && <Text style={{ color: colors.danger }} >*{errors?.email}*</Text>}
                        </Block>
                        <Block padding={sizes.sm}>
                            <Button color={colors.lightgreen}
                                onPress={() => { navigation.navigate("Signup") }}
                                radius={20}
                                flex={0}
                                marginTop={20}
                            >
                                <Text color={colors.white}>continue</Text>
                            </Button>

                          

                        </Block>
                    </Block>

                </Block>
            )}

        </Formik>


    );
}

export default Signin

const styles = StyleSheet.create({})