export const appendOptions = (
    args: {
        selectbox: HTMLSelectElement,
        options: string[],
        values?: string[]
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
                option.value = values[index];
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