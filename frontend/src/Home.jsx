import { useNavigate } from "react-router-dom"

function Home(){
    const navigate=useNavigate()
    return(
        <div className="home">
            <div className="home-text">
                <h1>Welcome to MyShop</h1>
                <p>Discover the best products at amazing prices, all in one place. At MyShop, we are committed to giving you a smooth, secure, and enjoyable shopping experience. Explore a wide range of high-quality products, from everyday essentials to the latest gadgets, handpicked just for you. Shop smarter, faster, and safer with MyShop — your one-stop destination for quality, variety, unbeatable deals, and trusted service.</p>
                <button onClick={()=>navigate("/shop")}>Start Shopping</button>
            </div>
            <img src="/cart.jpg" alt="Shop Banner" />
        </div>
    )
}
export default Home