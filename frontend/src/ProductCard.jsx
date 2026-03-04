function ProductCard({ image, name, price }) {
    return (
        <div className="card">
            <img src={image} alt={name}/>
            <h4>{name}</h4>
            <p>₹{price}</p>
            <button>Add to Cart</button>
        </div>
    );
}
export default ProductCard;