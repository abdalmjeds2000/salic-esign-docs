import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, PinInput, PinInputField, Text, useColorMode } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useStateContext } from '../context/ContextProvider';

const OTP = () => {
  const {isAllowShowDoc, setIsAllowShowDoc} = useStateContext();
  const { currentMode, setMode } = useStateContext();
  const { toggleColorMode } = useColorMode();
  const [isValid, setIsValid] = useState(false)


  const validate = () => {
    setIsValid(true);
  }
  const checkOTP = () => {
    setIsAllowShowDoc(true);
  }

  const handleSubmitForm = (values, actions) => {
    console.log(values, actions);
    actions.resetForm();
    validate()
  }



  return (
    <div className='flex flex-col w-screen h-screen overflow-auto bg-white dark:bg-third-dark-bg'>
      <div className='relative right-0 top-0 w-full h-16 pt-3 px-6 pb-6 bg-gradient-to-b from-neutral-300 dark:from-neutral-900 dark:bg-transparent'>
        <div className='flex justify-between max-w-[1600px] mx-auto'>
          <div>
            <img 
              src={require("../assets/images/horizontal-logo.png")} alt="salic_logo" 
              className='w-48' 
              style={{ height: 30, filter: currentMode === "dark" ? "grayscale(1) invert(1)" : "" }}
            />
          </div>
          <Button
            title={`Switch To ${currentMode === "dark" ? "Light" : "Dark"} Mode`}
            variant="unstyled"
            onClick={() => {
              setMode(currentMode === "dark" ? "light" : "dark");
              toggleColorMode();
            }}
          >
            {currentMode === "dark" ? <MdDarkMode /> : <MdOutlineLightMode />}
          </Button>
        </div>
      </div>


      <div className='p-10 max-md:px-4'>  
        <div className='max-w-lg p-6 rounded-xl mx-auto min bg-neutral-50 dark:bg-main-dark-bg border'>
          <div className='flex flex-col justify-between h-full'>
            <div>
              {!isValid && (
                <div>
                  <Formik initialValues={{ documentTitle: "", fromEmail: "", totalPages: "", signsCount: "" }} onSubmit={handleSubmitForm}>
                    {(props) => (
                      <Form>
                        <Field name="documentTitle" validate={val => !val ? "Document Title is required" : null}>
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.documentTitle && form.touched.documentTitle}>
                              <FormLabel>Document Title</FormLabel>
                              <Input variant='outline' {...field} placeholder='Write Document Title' />
                              <FormErrorMessage>{form.errors.documentTitle}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <br />
                        <Field name="fromEmail" validate={val => !val ? "Enter Valid Email" : null}>
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.fromEmail && form.touched.fromEmail}>
                              <FormLabel>Invitation From</FormLabel>
                              <Input variant='outline' type="email" {...field} placeholder='Write Email Address' />
                              {!form.errors.fromEmail && <FormHelperText>
                                Enter the email of the person who sent you an invitation to this document
                              </FormHelperText>}
                              <FormErrorMessage>{form.errors.fromEmail}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <br />
                        
                        <div className='flex gap-3 max-sm:flex-col'>
                          <Field name="totalPages" validate={val => !val ? "Enter Count of document pages" : null}>
                            {({ field, form }) => (
                              <FormControl isInvalid={form.errors.totalPages && form.touched.totalPages}>
                                <FormLabel>Total Pages</FormLabel>
                                <NumberInput max={10000} min={1}   variant='outline' onChange={val=>form.setFieldValue(field.name, val)} placeholder='Enter Count of document pages'>
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{form.errors.totalPages}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="signsCount" validate={val => !val ? "Enter Total Signatures" : null}>
                            {({ field, form }) => (
                              <FormControl isInvalid={form.errors.signsCount && form.touched.signsCount}>
                                <FormLabel>Total Signatures</FormLabel>
                                <NumberInput max={10000} min={1} variant='outline' onChange={val=>form.setFieldValue(field.name, val)} placeholder='Enter Count of Total Signatures'>
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{form.errors.signsCount}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </div>


                        <Button
                          mt={16}
                          colorScheme='teal'
                          isLoading={props.isSubmitting}
                          type='submit'
                        >
                          Submit
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>


            <div>
              {/* {!isValid && <Button colorScheme='blue' className='w-full' onClick={validate}>Send PIN</Button>} */}
              {isValid && (
                <div>
                  <div className='mb-14 flex flex-col items-center'>
                    <img 
                      src={require("../assets/images/otp_graphic.png")} alt="" 
                      width={75} 
                      className="mb-4" 
                    />
                    <Text fontSize='3xl'>Check Your Email</Text>
                    <Text fontSize='1xl'>Code is sent to your email</Text>
                  </div>
                  <div className='flex gap-4 mb-14 justify-center'>
                    <PinInput otp size="lg">
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </div>
                  <Button colorScheme='blue' className='w-full' onClick={checkOTP}>Verify</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTP