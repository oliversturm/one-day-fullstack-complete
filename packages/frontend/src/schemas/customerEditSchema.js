import * as yup from 'yup';

export default yup.object().shape({
  name: yup
    .string()
    .required()
    .ensure()
    .label('Name'),
  location: yup
    .string()
    .ensure()
    .label('Location')
});
