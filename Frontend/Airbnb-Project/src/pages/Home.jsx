import Banner from '../Components/Banner.jsx'
import Inspiration from '../Components/Inspiration.jsx'
import Discover from '../Components/Discover.jsx'
import Giftcards from '../Components/Giftcards.jsx'
import Questions from '../Components/Questions.jsx'
import Getaway from '../Components/Getaway.jsx'
import Footer from '../Components/Footer.jsx'
import './Home.css'


function Home() {
  return (
    <div className="home">
      
      <Banner />
      <Inspiration />
      <Discover />
      <Giftcards />
      <Questions />
      <Getaway />
      <Footer />

    </div>
  )
}

export default Home