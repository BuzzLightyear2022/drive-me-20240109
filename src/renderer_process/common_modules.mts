import NoImagePng from "../assets/NoImage.png";

export const appendOptions = (
    args: {
        selectbox: HTMLSelectElement,
        options: string[],
        values?: number[]
    }
): void => {
    const { selectbox, options, values } = args;
    while (selectbox.firstChild) {
        selectbox.removeChild(selectbox.firstChild);
    }

    if (options) {
        options.forEach((element: string, index: number) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.textContent = element;
            if (values && values[index]) {
                option.value = String(values[index]);
            }
            selectbox.append(option);
        });
    }
}

export const getDayString = (args: { dayIndex: number }): string => {
    const { dayIndex } = args;

    const dayNames: string[] = [
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土"
    ]

    return dayNames[dayIndex];
}

export const replaceFullWidthNumToHalfWidthNum = (args: { element: HTMLInputElement, limitDigits?: number }): void => {
    const { element, limitDigits = undefined } = args;

    const fullWidthNumbersRegExp = new RegExp(/[０-９]/);
    const NotHalfWidthBumbersRegExp = new RegExp(/[^0-9]/);
    const fullWidthNumbers = "０１２３４５６７８９";

    element.addEventListener("input", (): void => {
        const inputtedValue = String(element.value);
        const inputtedValueLength: number = inputtedValue.length;

        element.value = element.value.replace(fullWidthNumbersRegExp, (match: string): string => {
            return fullWidthNumbersRegExp.test(match) ? String(fullWidthNumbers.indexOf(match)) : "";
        });

        element.value = element.value.replace(NotHalfWidthBumbersRegExp, "");

        if (limitDigits) {
            if (inputtedValueLength > limitDigits) {
                element.value = inputtedValue.slice(0, limitDigits);
            }
        }
    }, false);
}


export const generateUniqueId = (): number => {
    const randomNumStr: string = Math.random().toString(36).substring(2, 9);
    return parseInt(randomNumStr, 36);
}

export const getRadioValue = (args: { radios: NodeListOf<HTMLElement>, defaultValue?: string }): string => {
    const { radios, defaultValue } = args;

    let selectedValue = defaultValue;
    radios.forEach((radio: HTMLInputElement): void => {
        if (radio.checked) {
            selectedValue = radio.value;
        }
    });
    return selectedValue;
}

export const setRadioValue = (args: { radios: NodeListOf<HTMLInputElement>, checkedValue: string }) => {
    const { radios, checkedValue } = args;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].value === checkedValue) {
            radios[i].checked = true;
        }
    }
}

export const loadImage = async (args: { fileName: string, width: string, height: string }): Promise<HTMLImageElement> => {
    const { fileName, width, height } = args;

    const serverHost: string = await window.serverInfo.serverHost();
    const serverPort: string = await window.serverInfo.port();
    const imageDirectory: string = await window.serverInfo.imageDirectory();

    const imgElement: HTMLImageElement = new Image();
    Object.assign(imgElement.style, {
        objectFit: "contain",
        width: width,
        height: height
    });

    imgElement.addEventListener("dragstart", (event: MouseEvent) => {
        event.preventDefault();
    }, false);

    imgElement.onerror = () => {
        imgElement.src = NoImagePng;
    };

    if (fileName) {
        imgElement.src = `https://${serverHost}:${serverPort}/${imageDirectory}/${fileName}`;
        return imgElement;
    } else {
        imgElement.src = NoImagePng;
        return imgElement;
    }
}

export const convertToKatakana = (inputElement: HTMLInputElement): void => {
    inputElement.addEventListener("input", () => {
        const convertedValue: string = inputElement.value.replace(/[\u3041-\u3096]/g, (match: string) => {
            const chr = match.charCodeAt(0) + 0x60;
            return String.fromCharCode(chr);
        });
        inputElement.value = convertedValue;
    }, false);
}

export const asyncAppendOptionElements = async (args: { selectElement: HTMLSelectElement, appendedOptionStrings: string[] }): Promise<void> => {
    const { selectElement, appendedOptionStrings } = args;

    await Promise.all(appendedOptionStrings.map(async (appendedOptionString: string) => {
        const option: HTMLOptionElement = document.createElement("option");
        option.textContent = appendedOptionString;
        option.value = appendedOptionString;
        selectElement.append(option);
    }));
}

export const formatDateForInput = (args: { dateObject: Date }): string => {
    const { dateObject } = args;

    const year: number = dateObject.getFullYear();
    const month: string = String(dateObject.getMonth() + 1).padStart(2, "0");
    const date: string = String(dateObject.getDate()).padStart(2, "0");
    const hours: string = String(dateObject.getHours()).padStart(2, "0");
    const minutes: string = String(dateObject.getMinutes()).padStart(2, "0");
    const dateString: string = `${year}-${month}-${date}T${hours}:${minutes}`;

    return dateString;
}

export const getTimeString = (args: { dateObject: Date }): string => {
    const { dateObject } = args;

    const hours: number = dateObject.getHours();
    const minutes: number = dateObject.getMinutes();

    const minutesString: string = String(minutes).padStart(2, "0");

    return `${hours}:${minutes}`;
}