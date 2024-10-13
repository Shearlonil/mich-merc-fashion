import * as yup from "yup";
import { availabilityOptions, categoryOptions } from "../../../data";

const schema = yup.object().shape({
  product_name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),

  price: yup.number().required("Price is required"),
  category: yup
    .object()
    .oneOf(categoryOptions)
    .required("Category is required"),
  available: yup
    .object()
    .oneOf(availabilityOptions)
    .required("Availability is required"),
  image_upload: yup
    .array()
    .of(
      yup
        .mixed()
        .required("An image is required")
        .test(
          "fileSize",
          "The file is too large",
          (value) => value && value.size <= 10000000
        ) // 10MB limit
        .test("fileType", "Unsupported file format", (value) =>
          value ? ["image/jpeg", "image/jpg"].includes(value.type) : false
        )
    )
    .required("At least one image is required")
    .min(1, "At least one image is required")
    .max(4, "maximum of 4 images allowed"), // Max 4 images
});

export { schema };
