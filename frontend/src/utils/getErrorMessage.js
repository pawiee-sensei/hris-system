const getErrorMessage = (err, fallback = "Something went wrong") => {
    const validationErrors = err.response?.data?.errors;

    if (validationErrors?.length) {
        return validationErrors[0].message;
    }

    return err.response?.data?.message || fallback;
};

export default getErrorMessage;