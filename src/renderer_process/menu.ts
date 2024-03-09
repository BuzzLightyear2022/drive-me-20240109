const vehicleInputButton: HTMLButtonElement = document.querySelector("#vehicle-input-button");
const reservationInputButton: HTMLButtonElement = document.querySelector("#reservation-input-button");
const displayReservationButton: HTMLButtonElement = document.querySelector("#display-reservation");
const editCarCatalogButton: HTMLButtonElement = document.querySelector("#edit_carCatalog-button");

vehicleInputButton.addEventListener("click", (): void => {
    window.openWindow.vehicleInputWindow();
}, false);

reservationInputButton.addEventListener("click", (): void => {
    window.openWindow.reservationInputWindow();
}, false);

displayReservationButton.addEventListener("click", (): void => {
    window.openWindow.displayReservationWindow();
}, false);

editCarCatalogButton.addEventListener("click", (): void => {
    window.openWindow.editCarCatalogWindow();
}, false);