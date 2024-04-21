import { RentalCar } from "../../@types/types";
import { RentalCarItem } from "./rental_car_item.mjs";
import { CalendarDaysAndSchedule } from "./calendarDays_and_schedule.mjs";

const rentalCarItemsContainer: HTMLDivElement = document.querySelector("#rental-car-items-container");
const daysContainer: HTMLDivElement = document.querySelector("#days-container");
const scheduleContainer: HTMLDivElement = document.querySelector("#schedule-container");

const appendRentalCarItems = async (args: { rentalCars: RentalCar[] }): Promise<void> => {
    const { rentalCars } = args;

    await Promise.all(rentalCars.map((rentalCar: RentalCar) => {
        const rentalCarItem = new RentalCarItem({ rentalCar: rentalCar });
        rentalCarItemsContainer.append(rentalCarItem);
    }));
}

const appendCalendarDaysAndScheduleContainers = (): void => {
    const currentDate: Date = new Date();
    const firstDateOfPreviousMonth: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const firstDateOfNextMonth: Date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const previousMonthInstance = new CalendarDaysAndSchedule({ dateObject: firstDateOfPreviousMonth });
    const currentMonthInstance = new CalendarDaysAndSchedule({ dateObject: currentDate });
    const nextMonthInstance = new CalendarDaysAndSchedule({ dateObject: firstDateOfNextMonth });

    daysContainer.append(
        previousMonthInstance.calendarDays,
        currentMonthInstance.calendarDays,
        nextMonthInstance.calendarDays
    );

    scheduleContainer.append(
        previousMonthInstance.schedule,
        currentMonthInstance.schedule,
        nextMonthInstance.schedule
    );
}

(async () => {
    const rentalCars: RentalCar[] = await window.sqlSelect.rentalCars({});

    await appendRentalCarItems({ rentalCars: rentalCars });
    appendCalendarDaysAndScheduleContainers();
})();