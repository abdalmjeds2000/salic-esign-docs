import { Button, useColorMode } from '@chakra-ui/react';
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

  return (
    <div className='w-screen h-screen overflow-auto p-10 bg-white dark:bg-third-dark-bg'>
      <span className='absolute right-0 top-2'>
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
      </span>
      <div className='w-96 p-6 rounded-xl mx-auto h-full bg-gray-200 dark:bg-main-dark-bg'>
        <div className='flex flex-col justify-between h-full'>
          <div>

            {isValid && (
              <div>
                otp
              </div>
            )}
          </div>


          <div>
            <Button colorScheme='blue' className='w-full' onClick={validate}>Send PIN</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTP