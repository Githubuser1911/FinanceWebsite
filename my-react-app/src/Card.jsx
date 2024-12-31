import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import pensulogo from './assets/pensulogo.PNG'; // Default image (optional)
import budget from './assets/budget.png';
import dividend from './assets/dividend.jpg';
import mortgage from './assets/mortgage.png';
import retirement from './assets/retirement.png';

function Card({ title, text, link, linkText, image }) {
    return (
        <div className="card" style={{ width: '16rem' }}>
            <img src={image || pensulogo} className="card-img-top rounded-3" alt="Card logo" />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{text}</p>
                <a href={link} className="btn btn-primary">
                    {linkText}
                </a>
            </div>
        </div>
    );
}

export default Card;
