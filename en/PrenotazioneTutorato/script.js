const bookings = [];

// Dati delle date e orari dei tutorati (estratti dal CSV)
const tutoringDates = [
    { date: "2024-10-23", dayName: "Mercoledì 23/10/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-10-28", dayName: "Lunedì 28/10/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-10-30", dayName: "Mercoledì 30/10/2024, SeSa 2.0 (ex Bip Lab.)", time: "9:00 - 11:00" },
    { date: "2024-11-04", dayName: "Lunedì 04/11/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-11-06", dayName: "Mercoledì 06/11/2024, SeSa 2.0 (ex Bip Lab.)", time: "9:00 - 11:00" },
    { date: "2024-11-11", dayName: "Lunedì 11/11/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-11-14", dayName: "Giovedì 14/11/2024, SeSa 2.0 (ex Bip Lab.)", time: "13:30 - 15:30" },
    { date: "2024-11-18", dayName: "Lunedì 18/11/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-11-21", dayName: "Giovedì 21/11/2024, SeSa 2.0 (ex Bip Lab.)", time: "9:00 - 11:00" },
    { date: "2024-11-25", dayName: "Lunedì 25/11/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-11-28", dayName: "Giovedì 28/11/2024, SeSa 2.0 (ex Bip Lab.)", time: "15:30 - 17:30" },
    { date: "2024-12-02", dayName: "Lunedì 02/12/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-12-04", dayName: "Mercoledì 04/12/2024, SeSa 2.0 (ex Bip Lab.)", time: "9:00 - 11:00" },
    { date: "2024-12-09", dayName: "Lunedì 09/12/2024, Lab. Sammet", time: "11:00 - 13:00" },
    { date: "2024-12-12", dayName: "Giovedì 12/12/2024, SeSa 2.0 (ex Bip Lab.)", time: "13:30 - 15:30" },
    { date: "2024-12-16", dayName: "Lunedì 16/12/2024, Lab. Sammet", time: "11:00 - 13:00" }
];
console.log("Date dei tutorati:", tutoringDates);
document.title = "This is the new page title.";

// Inizializza Firestore
const db = firebase.firestore();
/*
// Funzione per controllare se una data è prenotabile (attivabile 3 giorni prima)
function isDateAvailable(tutoringDate) {
    const currentDate = new Date();
    const tutorDate = new Date(tutoringDate);
    const diffTime = tutorDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
}
*/


// Aggiungi una prenotazione al database
function addBookingToFirebase(booking) {
    db.collection("bookings").add(booking)
        .then(() => {
            alert("Prenotazione effettuata con successo!");
            loadBookingsFromFirebase(); // Ricarica le prenotazioni
        })
        .catch(error => console.error("Errore nell'aggiunta della prenotazione:", error));
}

// Carica le prenotazioni dal database
function loadBookingsFromFirebase() {
    bookings.length = 0; // Pulisce l'array locale
    db.collection("bookings").get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const booking = doc.data();
                bookings.push(booking);
            });
            updateSlots(); // Aggiorna gli slot in base alle prenotazioni caricate
        })
        .catch(error => console.error("Errore nel caricamento delle prenotazioni:", error));
}

// Salva le prenotazioni nel file CSV
function saveBookingsToCSV() {
    const csvContent = "Date,Slot,Project Name,First Name,Last Name,Student ID,Email\n" +
        bookings.map(b => `${b.date},${b.slot},${b.projectName},${b.firstName},${b.lastName},${b.studentId},${b.email}`).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "prenotazioni_tutorato.csv";
    link.click();
}

// Carica le date nel selettore solo se sono attivabili (entro 3 giorni)
const dateSelect = document.getElementById("date");
const slotSelect = document.getElementById("slot");
tutoringDates.forEach(dateObj => {
    if (isDateAvailable(dateObj.date)) {
        const option = document.createElement("option");
        option.value = dateObj.dayName;
        option.textContent = dateObj.dayName;
        dateSelect.appendChild(option);
    }
});

// Aggiorna gli slot disponibili e disabilita quelli già prenotati
function updateSlots() {
    const selectedDate = dateSelect.value;
    slotSelect.innerHTML = ""; // Reset degli slot

    // Trova la data selezionata e genera gli slot
    const tutoringDateObj = tutoringDates.find(dateObj => dateObj.dayName === selectedDate);
    if (tutoringDateObj) {
        const slots = generateSlots(tutoringDateObj.time);
        slots.forEach(slotTime => {
            const option = document.createElement("option");
            option.value = slotTime;
            option.textContent = slotTime;
            option.disabled = bookings.some(b => b.date === selectedDate && b.slot === slotTime);
            slotSelect.appendChild(option);
        });
    }
}

// Funzione per generare slot di 30 minuti a partire dall'orario
function generateSlots(timeRange) {
    const [start, end] = timeRange.split(" - ");
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let slots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const nextMinute = (currentMinute + 30) % 60;
        const nextHour = currentMinute + 30 >= 60 ? currentHour + 1 : currentHour;
        const slotStart = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;
        const slotEnd = `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
        slots.push(`${slotStart} - ${slotEnd}`);
        currentHour = nextHour;
        currentMinute = nextMinute;
    }
    return slots;
}

// Gestione della prenotazione
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const slot = document.getElementById("slot").value;
    const projectName = document.getElementById("projectName").value.trim();
    const normalizedProjectName = projectName.toLowerCase();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();

    // Controlla se lo slot è già stato prenotato
    if (bookings.some(b => b.date === date && b.slot === slot)) {
        alert("Questo slot è già stato prenotato.");
        return;
    }

    // Controlla se il progetto ha già una prenotazione case insensitive
    if (bookings.some(b => b.date === date && b.projectName.toLowerCase() === normalizedProjectName)) {
        alert("Questo progetto ha già una prenotazione per questa data.");
        return;
    }

    // Aggiungi la prenotazione al database Firebase
    addBookingToFirebase({ date, slot, projectName, firstName, lastName, studentId, email });
    this.reset();
});

// Scarica le prenotazioni come CSV
document.getElementById("downloadBookings").addEventListener("click", saveBookingsToCSV);

// Carica le prenotazioni dal database al caricamento della pagina
window.addEventListener("load", loadBookingsFromFirebase);