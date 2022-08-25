function modal(cb: any, word: string) {
    const app = document.querySelector(".app");

    const modal = document.createElement("div");
    modal.setAttribute("class", "modal");

    const text = document.createElement("span");
    text.textContent = `Вы проиграли`;
    text.setAttribute("class", "text");

    const text2 = document.createElement("span");
    text2.textContent = `Слово было - ${word}`;
    text2.setAttribute("class", "text");

    const button = document.createElement("button");
    button.textContent = "Ок";
    button.setAttribute("class", "button");

    modal.appendChild(text);
    modal.appendChild(text2);
    modal.appendChild(button);

    app?.appendChild(modal);

    button.addEventListener("click", close);
    function close() {
        cb();
        app?.removeChild(modal);
        button.removeEventListener("click", close);
    }
    return;
}
export default modal;
