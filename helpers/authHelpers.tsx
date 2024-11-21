import { createCode } from "supertokens-web-js/recipe/passwordless";

export async function sendMagicLink(email: string) {
    try {
        let response = await createCode({
            email
        });

        if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
            throw Error(response.reason)
        }
    } catch (err: any) {
        if (err.isSuperTokensGeneralError === true) {
            throw Error(err.message)
        } else {
            throw Error("Oops! Something went wrong.");
        }
    }
}