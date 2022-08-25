import { Component } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import fileWords from "./ru";
import checkRu from "./manyRu";
import looseModal from "./components/looseModal";
import winModal from "./components/winModal";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const events = new Set();

interface state {
    word: string;
    words: string[];
    attempts: any[];
}

interface props {}

class App extends Component<props, state> {
    constructor(props: props) {
        super(props);
        this.state = {
            word: fileWords.split(" ")[
                Math.floor(fileWords.split(" ").length * Math.random())
            ],
            words: fileWords.split(" "),
            attempts: [],
        };
    }
    inputs: Element[] = [];

    componentDidMount() {
        const inputsContainer = document.querySelector(".inputs-container");
        if (inputsContainer) {
            Array.from(inputsContainer.children).forEach((child, index) => {
                this.inputs.push(child);
                child.addEventListener("input", () => {
                    this.changeInput(index);
                    (child as any).disabled = true;
                });
            });
        }
        document.addEventListener("keydown", (key) => {
            if (key.key === "Backspace") {
                this.backspace();
                return;
            }
        });
        events.add({
            event: "keydown",
            cb: (key: KeyboardEvent) => {
                if (key.key === "Backspace") {
                    this.backspace();
                    return;
                }
            },
        });
    }

    componentWillUnmount() {
        this.clearEvents();
    }

    clearEvents = () => {
        events.forEach((event: any) => {
            document.removeEventListener(event.event, event.cb);
        });
    };

    backspace = () => {
        let activeIndex: number | null = null;
        this.inputs.forEach((input, index) => {
            if ((input as any).value) {
                activeIndex = index;
            }
        });

        setTimeout(() => {
            if (activeIndex === null) return;
            (this.inputs[activeIndex] as any).value = "";
            (this.inputs[activeIndex] as any).disabled = false;
            (this.inputs[activeIndex] as any).focus();
        });
    };

    changeInput = (index: number) => {
        let indexSkipped = 0;
        while (indexSkipped !== this.inputs.length) {
            indexSkipped++;
            index++;
            if (index === this.inputs.length) {
                index = 0;
            }
            if (!(this.inputs[index] as any).value) {
                (this.inputs[index] as any).focus();
                break;
            }
        }

        if (indexSkipped === this.inputs.length) {
            (this.inputs[index] as any).blur();
            this.addWord();
        }
    };

    addWord = () => {
        let inputWord = this.inputs.map((input) => {
            let letter = (input as any).value;
            (input as any).value = "";
            return letter;
        });

        if (!checkRu.split(" ").includes(inputWord.join(""))) {
            setTimeout(() => {
                this.inputs.forEach((input) => {
                    (input as any).disabled = false;
                });
                (this.inputs as any)[0].focus();
            });
            return;
        }

        if (inputWord.join("") === this.state.word) {
            this.win();
            return;
        }

        if (this.state.attempts.length === 5) {
            this.loose();
            return;
        }

        let splitedWord = this.state.word.split("");
        inputWord = inputWord.map((letter, index) => {
            if (splitedWord[index] === letter) {
                return {
                    letter,
                    sign: "right",
                };
            }
            if (splitedWord.includes(letter)) {
                return {
                    letter,
                    sign: "has",
                };
            }
            return {
                letter,
                sign: "none",
            };
        });

        this.setState((state) => ({
            ...state,
            attempts: [...state.attempts, inputWord],
        }));

        setTimeout(() => {
            this.inputs.forEach((input) => {
                (input as any).disabled = false;
            });
            (this.inputs[0] as any).focus();
        });
    };

    loose = () => {
        looseModal(() => {
            (this.inputs[0] as any).focus();
        }, this.state.word);
        setTimeout(() => {
            this.inputs.forEach((input) => {
                (input as any).disabled = false;
            });
        });
        this.setState((state) => ({
            ...state,
            attempts: [],
            word: fileWords.split(" ")[
                Math.floor(fileWords.split(" ").length * Math.random())
            ],
        }));
        return;
    };

    win = () => {
        winModal(() => {
            (this.inputs[0] as any).focus();
        });
        setTimeout(() => {
            this.inputs.forEach((input) => {
                (input as any).disabled = false;
            });
        });
        this.setState((state) => ({
            ...state,
            word: state.words[Math.floor(state.words.length * Math.random())],
            attempts: [],
        }));
        return;
    };

    render() {
        const attempts = this.state.attempts;
        console.log(this.state.word);
        return (
            <div className="app">
                <div className="stat">{`Осталось попыток: ${
                    6 - this.state.attempts.length
                }`}</div>
                <div className="inputs-container">
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                </div>
                <div className="tries" key={attempts.length}>
                    {attempts.map((attempt, index) => {
                        return (
                            <div className="word" key={index}>
                                {attempt.map((letter: any, index: number) => {
                                    return (
                                        <div
                                            className={letter.sign}
                                            key={index}
                                        >
                                            {letter.letter}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

root.render(<App />);
