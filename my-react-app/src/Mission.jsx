import 'bootstrap/dist/css/bootstrap.min.css';

function Mission() {
    return (
        <div 
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
                fontSize: '1.5rem', // Adjust the font size if needed
                color: '#333' // Optional: Change text color
            }}
        >
            <p>
                Our mission is to help you make better decisions and not get rug pulled.
            </p>
        </div>
    );
}

export default Mission;
