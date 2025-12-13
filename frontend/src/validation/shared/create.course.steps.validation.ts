// const validateCurrentStep = () => {
//   const step = steps[currentStep - 1];
//   const schema = step.schema;

//   const result = schema.safeParse(courseData);

//   if (!result.success) {
//     setErrors((prev) => ({
//       ...prev,
//       [step.key]: result.error.flatten().fieldErrors,
//     }));
//     return false;
//   }

//   // clear errors if valid
//   setErrors((prev) => ({ ...prev, [step.key]: {} }));
//   return true;
// };
