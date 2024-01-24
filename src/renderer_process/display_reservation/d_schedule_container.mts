const ScheduleContainer = class {
    appendScheduleBars = async (): Promise<void> => {
        const calendarYear: number = this.calendarInfo.dateObject.getFullYear();
        const calendarMonthIndex: number = this.calendarInfo.dateObject.getMonth();

        const startDate: Date = new Date(calendarYear, calendarMonthIndex, 1, 0, 0, 0, 0);
        const endDate: Date = new Date(calendarYear, calendarMonthIndex + 1, 0, 23, 59, 59, 999);
        const totalMsOfMonth: number = endDate.getTime() - startDate.getTime();

        const monthReservationData: ReservationData[] = await window.sqlSelect.reservationData({
            startDate: startDate,
            endDate: endDate
        });

        this.calendarInfo.reservationDataArray = monthReservationData;

        this.calendarInfo.reservationDataArray.forEach((reservationData: ReservationData) => {
            this.calendarInfo.vehicleScheduleCells.forEach((vehicleScheduleCell) => {
                const reservationScheduleDiv: HTMLDivElement = vehicleScheduleCell.vehicleScheduleCellInfo.reservationScheduleDiv;

                if (reservationData.vehicleId === vehicleScheduleCell.vehicleScheduleCellInfo.vehicleId) {
                    const previousScheduleBar: Element | undefined = reservationScheduleDiv.lastElementChild;
                    const previousScheduleBarWidth: number = previousScheduleBar ? previousScheduleBar.getBoundingClientRect().width : 0;

                    const scheduleBar = new ScheduleBar({
                        reservationData: reservationData,
                        calendarStartMs: startDate.getTime(),
                        totalMsOfSchedule: totalMsOfMonth,
                        previousScheduleBarWidth: `${previousScheduleBarWidth}px`,
                        color: "green"
                    }).getScheduleBarElement();

                    reservationDisplayDiv.append(newScheduleBar);
                }
            });
        });
    }
}