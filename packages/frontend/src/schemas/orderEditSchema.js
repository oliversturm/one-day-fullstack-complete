import * as yup from 'yup';

export default yup.object().shape({
  text: yup
    .string()
    .required()
    .ensure()
    .label('Text'),
  value: yup
    .number()
    .positive()
    .label('Value')
});
