import VObjects from "@/constants/vObjects.js";

function validate(keys) {
    const selectedSchemaFields = {};
    keys.forEach(key => {
        if (VObjects[key]) {
            selectedSchemaFields[key] = VObjects[key];
        }
    });
    return  (selectedSchemaFields);
}

export default validate;
