import 'bootstrap/dist/css/bootstrap.min.css';

function Team(){
    return(
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
                CEO: Dane Kelii (business economics)
            </p>
        </div>
    )
}

export default Team