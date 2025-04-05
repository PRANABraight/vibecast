const defaultSettings = {
    tempUnit: 'celsius',
    musicSource: 'spotify',
    theme: 'light'
};

export function loadSettings() {
    const savedSettings = localStorage.getItem('vibecast-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

export function saveSettings(settings) {
    localStorage.setItem('vibecast-settings', JSON.stringify(settings));
}

export function convertTemperature(temp, unit) {
    if (unit === 'fahrenheit') {
        return (temp * 9/5) + 32;
    }
    return temp;
}

export function formatTemperature(temp, unit) {
    const converted = convertTemperature(temp, unit);
    return `${Math.round(converted)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeSettings();
    } catch (error) {
        console.error('Error initializing settings:', error);
    }
});

function initializeSettings() {
    const settings = loadSettings();
    const settingsModal = document.getElementById('settingsModal');
    const saveButton = document.getElementById('saveSettings');
    
    if (!settingsModal || !saveButton) {
        console.error('Required settings elements not found');
        return;
    }

    // Initialize form values and apply initial settings
    Object.keys(settings).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.value = settings[key];
    });

    // Handle settings save
    saveButton.addEventListener('click', () => {
        // Get new settings values
        const newSettings = {
            tempUnit: document.getElementById('tempUnit').value,
            musicSource: document.getElementById('musicSource').value,
            theme: document.getElementById('theme').value
        };

        // Save settings to localStorage
        saveSettings(newSettings);

        // Apply theme immediately
        applyTheme(newSettings.theme);

        // Update temperature display if it exists
        const tempDisplay = document.querySelector('.temperature');
        if (tempDisplay) {
            const rawTemp = parseFloat(tempDisplay.getAttribute('data-temp') || tempDisplay.textContent);
            tempDisplay.setAttribute('data-temp', rawTemp.toString());
            tempDisplay.textContent = formatTemperature(rawTemp, newSettings.tempUnit);
        }

        // Show success toast
        showNotification('Settings saved successfully!', 'success');

        // Close modal using Bootstrap
        const modalInstance = bootstrap.Modal.getInstance(settingsModal);
        modalInstance?.hide();
    });

    // Initialize modal
    if (!bootstrap.Modal.getInstance(settingsModal)) {
        new bootstrap.Modal(settingsModal);
    }
}

function updateWeatherDisplay(temperature, unit) {
    const tempElement = document.querySelector('.temperature');
    if (tempElement) {
        tempElement.setAttribute('data-temp', temperature.toString());
        tempElement.textContent = formatTemperature(temperature, unit);
    }
}

function updateMusicSource(source) {
    const weatherCondition = document.querySelector('.condition')?.textContent;
    if (weatherCondition) {
        document.dispatchEvent(new CustomEvent('musicSourceChanged', {
            detail: { source }
        }));
    }
}

function showNotification(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

function applyTheme(theme) {
    const isDark = theme === 'auto' 
        ? window.matchMedia('(prefers-color-scheme: dark)').matches 
        : theme === 'dark';

    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(isDark ? 'theme-dark' : 'theme-light');
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = isDark ? '#1a1a1a' : '#ffffff';
    }
}
