import Header from './Header.jsx'
import Footer from './Footer.jsx'
import DCF from './DCF.jsx'
import Card from './Card.jsx'
import Student from './Student.jsx'

function App() {
  
  return(
    <>
      <Header></Header>
      <Card></Card>
      <DCF></DCF>
      <Student name="Spongebob" age={30} isStudent = {true}></Student>
      <Footer></Footer>
    </>
  );
}

export default App
