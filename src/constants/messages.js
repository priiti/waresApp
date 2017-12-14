exports.AssetMessage = {
  ASSET_CREATE_FAIL: 'Asset creation failed. Please check input data.',
  ASSET_NOT_FOUND: 'Asset with a given id was not found.',
  ASSET_CREATED: 'Asset was successfully created.',
  ASSET_UPDATED: 'Asset was successfully updated.'
};

exports.UserMessage = {
  DUPLICATE_EMAIL: 'Account with given email address already exists.',
  USER_CREATE_FAIL: 'User creation failed.',
  USER_CREATED: 'User was successfully created.',
  PASSWORD_RESET_LINK: email => `Password reset link has been sent to ${email}.`,
  PASSWORD_RESET_LINK_ALREADY_SENT: 'Password reset link has been already sent. Please wait to request new one.',
  PASSWORD_RESET_EXP_INVALID: 'Password reset link invalid or expired. Please try again or contact your administrator.',
  PASSWORD_REQUIRED_FIELDS: 'Please fill required fields for password reset.',
  PASSWORD_RESET_SUCCESS: 'Password reset has been successfully completed.'
};

exports.IncidentMessage = {
  INCIDENT_NOT_FOUND: 'Incident with given id was not found',
  INCIDENTS_NOT_FOUND: 'No incidents found'
};
