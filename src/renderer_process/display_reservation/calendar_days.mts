import { getMonthName, getDayName } from "../common_modules.mjs"

export class CalendarDays extends HTMLElement {
    constructor(args: { dateObject: Date }) {
        super();

        const { dateObject } = args;

        const timestamp: number = dateObject.getTime();
        this.setAttribute("data-dateObject", String(timestamp));

        Object.assign(this.style, {
            display: "flex",
            flexDirection: "row",
            flexBasis: "auto",
            flexGrow: 1,
            flexShrink: 1,
            whiteSpace: "nowrap",
            overflow: "visible"
        });

        const currentDate: Date = new Date();

        const calendarYear: number = dateObject.getFullYear();
        const calendarMonthIndex: number = dateObject.getMonth();
        const calendarDays: number = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();

        const calendarMonthString: string = getMonthName(calendarMonthIndex);

        (async () => {
            let holidays: string[];

            try {
                const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
                const holidaysJson: JSON = await response.json();
                holidays = Object.keys(holidaysJson);
            } catch (error) {
                console.error(error);
            }

            for (let i = 1; i <= calendarDays; i++) {
                const dayCell: HTMLDivElement = document.createElement("div");
                Object.assign(dayCell.style, {
                    display: "flex",
                    justifyContent: "center",
                    minWidth: "120px",
                    height: "50px",
                    lineHeight: "200%",
                    fontSize: "150%",
                    border: "solid",
                    borderWidth: "1px 0.5px",
                    cursor: "default",
                    userSelect: "none"
                });

                const thisDateObject: Date = new Date(calendarYear, calendarMonthIndex, i, 9);
                const dayIndex: number = new Date(calendarYear, calendarMonthIndex, i).getDay();
                const dayString: string = getDayName(dayIndex);
                dayCell.textContent = i === 1 ? `${calendarMonthString}/${i}(${dayString})` : `${i}(${dayString})`;

                if (dayIndex === 0) {
                    dayCell.style.background = "#ff0033";
                } else if (dayIndex === 6) {
                    dayCell.style.background = "#0582ff";
                }

                holidays.forEach(holiday => {
                    const thisDateMs: number = thisDateObject.getTime();
                    const holidayDate = new Date(holiday).getTime();

                    if (thisDateMs === holidayDate) {
                        dayCell.style.color = "black"
                        dayCell.style.background = "radial-gradient(circle closest-corner, rgba(255, 0, 0, 1) 25%, rgba(255, 255, 255, 1) 20%)";
                    }
                });

                if (currentDate.getFullYear() === calendarYear && currentDate.getMonth() === calendarMonthIndex && currentDate.getDate() === i) {
                    dayCell.style.borderColor = "yellow";
                    dayCell.style.borderWidth = "10px";
                    dayCell.style.lineHeight = "calc(200% - 20px)";
                }

                this.append(dayCell);
            }
        })();
    }
}

customElements.define("calendar-days", CalendarDays);