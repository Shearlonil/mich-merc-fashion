import * as yup from "yup";

const schema = yup.object().shape({
  fname: yup.string().required("First Name is required"),
  lname: yup.string().required("Last Name is required"),
  // compName: yup.string().required("Company Name is required"),

  country: yup.string().required("Country is required"),
  address: yup.string().required("Address is required"),
  town: yup.string().required("Town is required"),
  state: yup.string().required("State is required"),

  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\+?\d{1,3}[- ]?)?\d{10}$/,
      "Phone number must be valid and more than 10 digits"
    ),
  email: yup.string().required("Email is required"),
  terms_and_conditions: yup
    .boolean()
    .isTrue("Please accept the Terms and Conditions to continue!")
    .required("Required!"),
  notes: yup.string("A note here"),
  payment_method: yup
    .string()
    .required("Choose a payment method")
    .oneOf(
      ["credit card", "cash on delivery"],
      "Invalid payment method selected"
    ),
});

export { schema };
