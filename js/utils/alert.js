/**
 * Creates an alert element
 */

export class Alert{
    show(type, message) {
        if (!["error", "success"].includes(type)) {
            throw Error("Type must be 'error' or 'success'");
        }
        //add alert element on the body
        const body = document.body;
        const alertDiv = document.createElement("div");
        //add classes
        alertDiv.classList.add("alert");
        alertDiv.classList.add(type.toLowerCase());

        //message
        const alertParagraph = document.createElement("p");
        alertParagraph.innerText = message;

        //display on the body
        body.appendChild(alertDiv);
        alertDiv.appendChild(alertParagraph);

        //after some time, remove the element
        setTimeout(() => {
            alertDiv.remove();
        },4000)
    }
}