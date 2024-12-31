const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function DividendYield(ticker) {
    const url = `https://finviz.com/quote.ashx?t=${ticker}&p=d`;
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null }); // Open browser window on your end
    const page = await browser.newPage();

    try {
        // Go to the Finviz page for the given ticker
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 }); // Increased timeout to 90s

        // Wait for the dividend yield element to appear using the provided CSS selector
        await page.waitForSelector('table[width="100%"] tbody tr td div div table tbody tr td div[align="center"] table tbody tr td div[align="left"] b', { timeout: 90000 });

        // Extract the dividend yield using the CSS selector
        const yieldValue = await page.evaluate(() => {
            const dividendElement = document.querySelector('table[width="100%"] tbody tr td div div table tbody tr td div[align="center"] table tbody tr td div[align="left"] b');
            if (dividendElement) {
                return dividendElement.innerText.trim();  // Return the dividend yield text
            } else {
                return null;  // Return null if dividend yield is not found
            }
        });

        if (!yieldValue) throw new Error('Dividend yield not found');

        console.log({ ticker, yield: yieldValue });
        return { ticker, yield: yieldValue };
    } catch (error) {
        console.error('Error fetching dividend yield:', error.message);
        return { ticker, yield: null };
    }
}

// Example usage
DividendYield('VOO');  // For VOO or any other ticker symbol
