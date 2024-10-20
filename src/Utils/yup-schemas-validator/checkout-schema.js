import * as yup from "yup";

const schema = yup.object().shape({
  fname: yup.string().required("First Name is required"),
  lname: yup.string().required("Last Name is required"),
  compName: yup.string().required("Company Name is required"),

  country: yup.string().required("Choose a Country"),
  address: yup.string().required("Price is required"),
  town: yup.string().required("Price is required"),
  state: yup.string().required("Price is required"),

  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\+?\d{1,3}[- ]?)?\d{10}$/,
      "Phone number must be valid and contain 10 digits"
    ),
  email: yup.string().required("Email is required"),
  notes: yup.string("A note here"),
  paymentMethod: yup
    .string()
    .required("Choose a payment method")
    .oneOf(
      ["credit_card", "paypal", "bank_transfer"],
      "Invalid payment method selected"
    ),
});

export { schema };
