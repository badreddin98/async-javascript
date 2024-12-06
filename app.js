// My Async JavaScript Assignment
// Demonstrating async/await, fetch, and timers

// Part 1: Working with APIs
class PokemonAPI {
    async fetchPokemon() {
        try {
            // Using the free Pokemon API - no authentication needed!
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=5');
            const data = await response.json();
            
            // Get details for each Pokemon
            const pokemonDetails = await Promise.all(
                data.results.map(async pokemon => {
                    const detailResponse = await fetch(pokemon.url);
                    return detailResponse.json();
                })
            );
            
            this.displayPokemon(pokemonDetails);
        } catch (error) {
            console.log('Error fetching Pokemon:', error);
            alert('Failed to load Pokemon. Please try again!');
        }
    }

    displayPokemon(pokemonList) {
        const container = document.getElementById('characters-container');
        container.innerHTML = '';

        pokemonList.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card">
                    <img src="${pokemon.sprites.front_default}" 
                         class="card-img-top" 
                         alt="${pokemon.name}">
                    <div class="card-body">
                        <h5>${pokemon.name}</h5>
                        <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// Part 2: Timer Functions
class Timer {
    constructor() {
        this.timeLeft = 0;
        this.timerId = null;
    }

    startTimer(seconds) {
        // Clear any existing timer
        this.stopTimer();
        
        this.timeLeft = seconds;
        this.updateDisplay();

        // Update every second using setInterval
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.stopTimer();
                alert('Timer finished!');
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timerDisplay').textContent = 
            `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Part 3: Notifications using setTimeout and setInterval
class Notifications {
    constructor() {
        this.repeatTimer = null;
    }

    showMessage(message) {
        const notificationArea = document.getElementById('notificationArea');
        const notification = document.createElement('div');
        notification.className = 'alert alert-info';
        notification.textContent = message;
        notificationArea.appendChild(notification);

        // Remove notification after 3 seconds using setTimeout
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showDelayedMessage() {
        // Show message after 2 second delay using setTimeout
        setTimeout(() => {
            this.showMessage('This message was delayed by 2 seconds!');
        }, 2000);
    }

    toggleRepeatingMessage() {
        if (this.repeatTimer) {
            // Stop repeating messages
            clearInterval(this.repeatTimer);
            this.repeatTimer = null;
            this.showMessage('Stopped repeating messages');
        } else {
            // Start repeating messages every 3 seconds using setInterval
            this.repeatTimer = setInterval(() => {
                this.showMessage('This message repeats every 3 seconds');
            }, 3000);
        }
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    const pokemonAPI = new PokemonAPI();
    const timer = new Timer();
    const notifications = new Notifications();

    // Load Pokemon data
    pokemonAPI.fetchPokemon();

    // Set up timer button
    document.getElementById('startTimer').addEventListener('click', () => {
        const seconds = parseInt(document.getElementById('timerInput').value);
        if (seconds > 0) {
            timer.startTimer(seconds);
        } else {
            alert('Please enter a valid number of seconds');
        }
    });

    // Set up notification buttons
    document.getElementById('showDelayedNotification').addEventListener('click', () => {
        notifications.showDelayedMessage();
    });

    document.getElementById('toggleRepeatingNotification').addEventListener('click', () => {
        notifications.toggleRepeatingMessage();
    });
});
