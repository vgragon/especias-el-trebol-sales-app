export default {
    isEmployeeValid: function (employee) {
        let response = {};
        response.messages = [];
        if (this.isStringEmptyOrUndefined(employee.givenName)) {
            response.isError = true;
            response.messages.push("Please enter the first name");
        }
        if (this.isStringEmptyOrUndefined(employee.familyName)) {
            response.isError = true;
            response.messages.push("Please enter the last name");
        }
        if (this.isStringEmptyOrUndefined(employee.telephoneNumber)) {
            response.isError = true;
            response.messages.push("Please enter a telephone number");
        }
        if (this.isStringEmptyOrUndefined(employee.primaryEmail)) {
            response.isError = true;
            response.messages.push("Please enter a primary email");
        }
        if (this.isStringEmptyOrUndefined(employee.homeAddress)) {
            response.isError = true;
            response.messages.push("Please enter a home address");
        }

        return response;
    },
    isClientValid: function (client) {
        let response = {};
        response.messages = [];
        if (this.isStringEmptyOrUndefined(client.name)) {
            response.isError = true;
            response.messages.push("Please enter the company name");
        }
        if (this.isStringEmptyOrUndefined(client.primaryTelephoneNumber)) {
            response.isError = true;
            response.messages.push("Please enter the primary telephone number");
        }
        if (this.isStringEmptyOrUndefined(client.primaryEmail)) {
            response.isError = true;
            response.messages.push("Please enter the primary email");
        }
        if (this.isStringEmptyOrUndefined(client.workAddress)) {
            response.isError = true;
            response.messages.push("Please enter the work address");
        }

        return response;
    }
};