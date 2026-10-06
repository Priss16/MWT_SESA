import React from 'react';
import LoginLayout from '../../components/LoginLayout';

export default function LoginHod() {
  return (
    <LoginLayout
      role={'hod'}
      headline="Welcome"
      subheadline="Please enter your credentials"
      tagline="SESA Examination Management"
      fieldLabel="Username"
      fieldPlaceholder="Enter username"
    />
  );
}
