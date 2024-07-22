// Function to fetch and parse CSV data
fetch('OlympicsHK.csv')
    .then(response => response.text())
    .then(data => {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log('CSV Parsed Data:', results.data); // Debugging line
                const events = results.data.map(row => ({
                    sport: row['Type'],
                    date: row['Date'],
                    time: row['HK Time'],
                    event: row['Event']
                }));
                console.log('Events:', events); // Debugging line
                const uniqueDates = [...new Set(events.map(e => e.date))];
                const uniqueSports = [...new Set(events.map(e => e.sport))];

                createTableHeaders(uniqueDates);
                createTableRows(events, uniqueDates);
                createButtons(uniqueSports);
            }
        });
    });

// Create table headers
const createTableHeaders = (uniqueDates) => {
    const tableHead = document.getElementById('tableHead');
    let headerRow = '<tr><th></th>';
    uniqueDates.forEach(date => {
        headerRow += `<th>${date}</th>`;
    });
    headerRow += '</tr>';
    tableHead.innerHTML = headerRow;
    console.log('Table Headers:', tableHead.innerHTML); // Debugging line
};

// Create table rows with time slots
const createTableRows = (events, uniqueDates) => {
    const tableBody = document.getElementById('tableBody');
    const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00 - ${String(i + 1).padStart(2, '0')}:00`);

    timeSlots.forEach(slot => {
        let row = `<tr><td>${slot}</td>`;
        uniqueDates.forEach(date => {
            const slotStart = slot.split(' ')[0];
            const slotEvents = events.filter(event => event.date === date && event.time.startsWith(slotStart));
            const eventsList = slotEvents.map(event => `${event.time} ${event.event}`).join('<br>');
            row += `<td data-sport="${slotEvents.length ? slotEvents[0].sport : ''}">${eventsList}</td>`;
        });
        row += '</tr>';
        tableBody.innerHTML += row;
    });
    console.log('Table Body:', tableBody.innerHTML); // Debugging line
};

// Create buttons for sports
const createButtons = (uniqueSports) => {
    const buttonsDiv = document.getElementById('buttons');
    uniqueSports.forEach(sport => {
        const button = document.createElement('button');
        button.innerText = sport;
        button.onclick = () => filterSport(sport);
        buttonsDiv.appendChild(button);
    });
    console.log('Buttons:', buttonsDiv.innerHTML); // Debugging line
};

// Filter events by sport
const filterSport = (sport) => {
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let hasSportEvent = false;
        cells.forEach(cell => {
            if (cell.dataset.sport === sport) {
                hasSportEvent = true;
            }
        });
        row.style.display = hasSportEvent ? '' : 'none';
    });
};

// Debugging: Log to verify script load
console.log('Script loaded and running.');
