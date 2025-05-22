function cleaner(object) {
    Object.keys(object).forEach((key) => {
        if (object[key] === null) {
            delete object[key]; // Delete key if value is null
        }
    });
    return (object);
}

export default cleaner;
