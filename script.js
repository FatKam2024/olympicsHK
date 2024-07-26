// Function to fetch and parse CSV data
fetch('OlympicsHK.csv')
    .then(response => response.text())
    .then(data => {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const events = results.data.map(row => ({
                    sport: row['Type'],
                    date: row['Date'],
                    time: row['HK Time'],
                    event: row['Event'],
                    player: row['Player']
                }));
                const uniqueDates = [...new Set(events.map(e => e.date))];
                const uniqueSports = [...new Set(events.map(e => e.sport))];

                createButtons(['All Sports', ...uniqueSports]);
                createTables('All Sports', uniqueDates, events);
                createTables(uniqueSports, uniqueDates, events);

                // Show the first sport by default
                if (uniqueSports.length > 0) {
                    filterSport('All Sports');
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching CSV:', error);
    });

// Create buttons for sports
const createButtons = (uniqueSports) => {
    const buttonsDiv = document.getElementById('buttons');
    uniqueSports.forEach((sport, index) => {
        const button = document.createElement('button');
        button.innerText = sport;
        button.onclick = () => filterSport(sport);
        if (index === 0) button.classList.add('active');
        buttonsDiv.appendChild(button);
    });
};

// Create tables for each sport
const createTables = (uniqueSports, uniqueDates, events) => {
    const tablesDiv = document.getElementById('tables');
    if (typeof uniqueSports === 'string') {
        // For 'All Sports' table
        const table = document.createElement('table');
        table.id = uniqueSports;
        table.classList.add('hidden');
        table.innerHTML = generateTableHTML(uniqueDates, events);
        tablesDiv.appendChild(table);
    } else {
        // For individual sport tables
        uniqueSports.forEach(sport => {
            const table = document.createElement('table');
            table.id = sport;
            table.classList.add('hidden');
            table.innerHTML = generateTableHTML(uniqueDates, events.filter(event => event.sport === sport));
            tablesDiv.appendChild(table);
        });
    }
};

// Generate HTML for each table
const generateTableHTML = (uniqueDates, events) => {
    let tableHTML = '<thead><tr><th style="width: 80px;">Time</th>';
    const hardcodedDates = [
        '27 Jul (Sat)', '28 Jul (Sun)', '29 Jul (Mon)', '30 Jul (Tue)', '31 Jul (Wed)',
        '1 Aug (Thu)', '2 Aug (Fri)', '3 Aug (Sat)', '4 Aug (Sun)', '5 Aug (Mon)',
        '6 Aug (Tue)', '7 Aug (Wed)', '8 Aug (Thu)', '9 Aug (Fri)', '10 Aug (Sat)', '11 Aug (Sun)'
    ];
    hardcodedDates.forEach(date => {
        tableHTML += `<th class="date-header" style="width: 250px;">${date}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    timeSlots.forEach(slot => {
        let row = `<tr><td>${slot}</td>`;
        let rowHasEvent = false;
        hardcodedDates.forEach((date, index) => {
            const slotStartHour = parseInt(slot.split(':')[0]);
            const slotEvents = events.filter(event => {
                const [eventDay, eventMonth] = event.date.split('/');
                const [eventHour, eventMinute] = event.time.split(':').map(Number);
                return `${eventDay} ${eventMonth.slice(0, 3)}` === date.slice(0, 6) && eventHour === slotStartHour;
            });
            if (slotEvents.length > 0) rowHasEvent = true;
            const eventsList = slotEvents.map(event => `
                <div class="event">
                    <div class="event-time">${event.time}</div>
                    <div class="event-name">${event.event}</div>
                    <div class="event-player">${event.player}</div>
                </div>
            `).join('');
            row += `<td>${eventsList}</td>`;
        });
        row += '</tr>';
        if (rowHasEvent) tableHTML += row;
    });

    tableHTML += '</tbody>';
    return tableHTML;
};

// Filter events by sport
const filterSport = (sport) => {
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