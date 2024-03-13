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

export const getMonthName = (monthIndex: number): string => {
    const monthNames: string[] = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
    ];
    return monthNames[monthIndex];
}

export const getDayName = (dayIndex: number): string => {
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

export const getRadioValue = (args: { radios: NodeListOf<HTMLInputElement>, defaultValue: string }): string => {
    const { radios, defaultValue } = args;

    let selectedValue: string = defaultValue;
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

export const loadImage = async (args: { fileName: string, width: number, height: number }): Promise<HTMLImageElement> => {
    const { fileName, width, height } = args;

    const serverHost: string = await window.serverInfo.serverHost();
    const serverPort: string = await window.serverInfo.port();
    const imageDirectory: string = await window.serverInfo.imageDirectory();

    const imgElement: HTMLImageElement = new Image();
    Object.assign(imgElement.style, {
        objectFit: "contain",
        width: `${width}px`,
        height: `${height}px`
    });

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