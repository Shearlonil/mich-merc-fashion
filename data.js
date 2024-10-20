const categoryMap = ["Footwears", "Belts", "Shirts", "Glasses"];

const categoryOptions = [
  { value: 1, label: "Footwears" },
  { value: 2, label: "Belts" },
  { value: 3, label: "Shirt" },
  { value: 4, label: "Glasses" },
];

const availabilityOptions = [
  { value: true, label: "In-Stock" },
  { value: false, label: "Out-Of-Stock" },
];

const catOptions = [
  { value: "", label: "All" },
  { value: "footwears", label: "Footwears" },
  { value: "Belts", label: "Belts" },
  { value: "shirts", label: "Shirt" },
  { value: "glasses", label: "Glasses" },
];

const stateOptions = [
  { value: "", label: "All" },
  { value: true, label: "In-Stock" },
  { value: false, label: "Out-Of-Stock" },
];

export {
  categoryMap,
  categoryOptions,
  availabilityOptions,
  stateOptions,
  catOptions,
};
