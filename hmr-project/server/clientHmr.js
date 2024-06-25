// This file is been injected into the html files from the server

/**
 * 1. Generate a new script tag with a cache busting query parameter.
 * 2. Appends our new script tag into our document.
 * 3. Removes the old script tag once the new one is loaded.
 */
function reloadScript(filePath) {
    try {
        // Ensure we will fetch a new file, instead of getting it from browser's cache.
        const scriptUrl = `/${filePath}?v=${new Date().getTime()}`

        // Create a new script tag
        const newScript = document.createElement('script')
        newScript.src = scriptUrl
        newScript.type = 'module';

        document.body.appendChild(newScript);

        newScript.onload = () => {
            const oldScript = document.querySelector(`script[src^="/${filePath}"]`);

            if (oldScript) {
                oldScript.remove();
            }
        };
    } catch (error) {
        console.error('Error reloading script:', error);
    }
}

/**
 * 1. Create a new link.
 * 2. Once the link is loaded, remove the old one.
 */
function reloadStylesheet(filePath) {
    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = `/${filePath}`;

    document.head.appendChild(newLink);

    newLink.onload = function () {
        const oldLink = document.querySelector(`link[href^="/${filePath}"]`);
        oldLink.remove();
        console.log(`Reloaded stylesheet: ${filePath}`);
    };
}

/**
 * Fun fact - Vite performs a full refresh once it detects changes on .html files
 * We will handle HMR logic for the body tag.
 * 
 * 1. Fetching the file from the server.
 * 2. Parsing the HTML content into a DOM document.
 * 3. Update the body of our document.
 */
async function reloadHtml(filePath) {
    try {
        const response = await fetch(`/${filePath}?v=${new Date().getTime()}`);
        const fileContent = await response.text();
        
        // Parse HTML string into a DOM document
        const parser = new DOMParser();
        const doc = parser.parseFromString(fileContent, 'text/html');

        document.body.innerHTML = doc.body.innerHTML;

        console.log(`Reloaded HTML: ${filePath}`);
    } catch (error) {
        console.error('Error reloading HTML:', error);
    }
}

const handleUpdatedFile = async (filePath) => {
    const fileExtension = filePath.split('.').pop();
    switch (fileExtension) {
        case 'js':
            reloadScript(filePath);
            break;
        case 'css':
            reloadStylesheet(filePath);
            break;
        case 'html':
            await reloadHtml(filePath);
            break;
        default:
            console.warn(`Unknown file type: ${fileExtension}`);
    }
}

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};
ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    try {
        const { payload: { filePath } } = data
        handleUpdatedFile(filePath);
    } catch (error) {
        console.error('Error reloading file:', error);
    }
};

// Close the WebSocket connection before the page unloads
window.addEventListener('beforeunload', () => {
    ws.close();
});