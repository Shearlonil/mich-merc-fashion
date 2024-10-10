import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { schema } from "./schema";
import { Form, Button } from "react-bootstrap";
import ErrorMessage from "../Components/ErrorMessage";
import { schema } from "../Utils/yup-schemas-validator/checkout-schema";

const PaymentForm = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data) => {
		console.log(data);
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			{/* Other form fields */}

			{/* Radio buttons for Payment Method */}
			<Form.Group>
				<Form.Label>Payment Method</Form.Label>
				<div>
					<Form.Check
						type="radio"
						label="Credit Card"
						value="credit_card"
						{...register("payment_method")}
					/>
					<Form.Check
						type="radio"
						label="PayPal"
						value="paypal"
						{...register("payment_method")}
					/>
					<Form.Check
						type="radio"
						label="Bank Transfer"
						value="bank_transfer"
						{...register("payment_method")}
					/>
				</div>
				<ErrorMessage source={errors.payment_method} />
			</Form.Group>

			<Button variant="primary" type="submit">
				Submit
			</Button>
		</Form>
	);
};

export default PaymentForm;
