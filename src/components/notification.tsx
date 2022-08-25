function notification(notificationText: string) {
    const container = document.querySelector(".app .notifications");

    const notificationContainer = document.createElement("div");
    notificationContainer.setAttribute("class", "notification");

    const text = document.createElement("span");
    text.setAttribute("class", "text");
    text.textContent = notificationText;

    notificationContainer.appendChild(text);

    container?.appendChild(notificationContainer);

    notificationContainer.addEventListener("animationend", animationStart);

    function animationStart() {
        notificationContainer.setAttribute("class", "notification close");
        notificationContainer.removeEventListener(
            "animationend",
            animationStart
        );
        notificationContainer.addEventListener("animationend", close);
    }

    function close() {
        container?.removeChild(notificationContainer);
        notificationContainer.removeEventListener("animationend", close);
    }
}

export default notification;
