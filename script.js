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
                    event: row['Event'],
                    player: row['Player']
                }));
                console.log('Events:', events); // Debugging line
                const uniqueDates = [...new Set(events.map(e => e.date))];
                const uniqueSports = [...new Set(events.map(e => e.sport))];

                console.log('Unique Dates:', uniqueDates); // Debugging line
                console.log('Unique Sports:', uniqueSports); // Debugging line

                createButtons(uniqueSports);
                createTables(uniqueSports, uniqueDates, events);

                // Show the first sport by default
                if (uniqueSports.length > 0) {
                    filterSport(uniqueSports[0]);
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching CSV:', error); // Debugging line
    });

// Create buttons for sports
const createButtons = (uniqueSports) => {
    const buttonsDiv = document.getElementById('buttons');
    uniqueSports.forEach((sport, index) => {
        const button = document.createElement('button');
        button.innerText = sport;
        button.onclick = () => filterSport(sport);
        if (index === 0) button.classList.add('active'); // Default active button for the first sport
        buttonsDiv.appendChild(button);
    });
    console.log('Buttons:', buttonsDiv.innerHTML); // Debugging line
};

// Create tables for each sport
const createTables = (uniqueSports, uniqueDates, events) => {
    const tablesDiv = document.getElementById('tables');
    uniqueSports.forEach(sport => {
        const table = document.createElement('table');
        table.id = sport;
        table.classList.add('hidden');
        table.innerHTML = generateTableHTML(uniqueDates, events.filter(event => event.sport === sport));
        tablesDiv.appendChild(table);
    });
};

// Generate HTML for each table
const generateTableHTML = (uniqueDates, events) => {
    let tableHTML = '<thead>';
    let headerRow = '<tr><th></th>';
    uniqueDates.forEach(date => {
        const [day, month, year] = date.split('/');
        const dateObj = new Date(`${year}-${month}-${day}`);
        const dayStr = dateObj.toLocaleDateString('zh-HK', { month: 'numeric', day: 'numeric' });
        const weekday = dateObj.toLocaleDateString('zh-HK', { weekday: 'short' });
        headerRow += `<th>${dayStr} (${weekday})</th>`;
    });
    headerRow += '</tr>';
    tableHTML += headerRow + '</thead><tbody>';

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00 - ${String(i + 1).padStart(2, '0')}:00`);

    timeSlots.forEach(slot => {
        let row = `<tr><td>${slot}</td>`;
        let rowHasEvent = false;
        uniqueDates.forEach(date => {
            const slotStartHour = parseInt(slot.split(':')[0]);
            const slotEvents = events.filter(event => {
                const [eventHour, eventMinute] = event.time.split(':').map(Number);
                return event.date === date && eventHour >= slotStartHour && eventHour < slotStartHour + 1;
            });
            if (slotEvents.length > 0) rowHasEvent = true;
            console.log(`Events for ${slot} on ${date}:`, slotEvents); // Debugging line
            const eventsList = slotEvents.map(event => `${event.time} ${event.event} ${event.player}`).join('<br>');
            row += `<td>${eventsList}</td>`;
        });
        row += '</tr>';
        if (rowHasEvent) tableHTML += row;
    });

    tableHTML += '</tbody>';
    console.log(`Generated Table HTML for ${events[0]?.sport}:`, tableHTML); // Debugging line
    return tableHTML;
};

// Filter events by sport
const filterSport = (sport) => {
    console.log('Filtering for sport:', sport); // Debugging line
    const tables = document.querySelectorAll('#tables table');
    tables.forEach(table => {
        if (table.id === sport) {
            table.classList.remove('hidden');
        } else {
            table.classList.add('hidden');
        }
    });

    // Update active button
    const buttons = document.querySelectorAll('#buttons button');
    buttons.forEach(button => {
        if (button.innerText === sport) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
};

// Debugging: Log to verify script load
console.log('Script loaded and running.');
