
async function checkStock(productId) {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const product = await response.json();
    return product.stock > 0; 
  } catch (error) {
    console.error(`Stock check error for product ${productId}:`, error.message);
    return false; 
  }
}

module.exports = { checkStock };
