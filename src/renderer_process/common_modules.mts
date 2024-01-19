const appendOptions = (
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

const getMonthName = (monthIndex: number): string => {
    const monthNames: string[] = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
    ];
    return monthNames[monthIndex];
}

export { appendOptions, getMonthName }