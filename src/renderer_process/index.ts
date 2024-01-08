const vehicleInputButton: HTMLButtonElement = document.querySelector("#vehicle-input-button") as HTMLButtonElement;
const reservationInputButton: HTMLButtonElement = document.querySelector("#reservation-input-button") as HTMLButtonElement;
const displayReservationButton: HTMLButtonElement = document.querySelector("#display-reservation") as HTMLButtonElement;

vehicleInputButton.addEventListener("click", (): void => {
    window.openWindow.vehicleInputWindow();
}, false);

reservationInputButton.addEventListener("click", (): void => {
    window.openWindow.reservationInputWindow();
}, false);

displayReservationButton.addEventListener("click", (): void => {
    window.openWindow.displayReservationWindow();
}, false);
