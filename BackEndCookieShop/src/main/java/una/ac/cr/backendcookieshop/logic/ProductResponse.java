package una.ac.cr.backendcookieshop.logic;

import java.util.List;

public class ProductResponse {
    private List<ProductoDTO> products;
    private List<Integer> purchasedProductIds;

    public ProductResponse(List<ProductoDTO> products, List<Integer> purchasedProductIds) {
        this.products = products;
        this.purchasedProductIds = purchasedProductIds;
    }

    public List<ProductoDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ProductoDTO> products) {
        this.products = products;
    }

    public List<Integer> getPurchasedProductIds() {
        return purchasedProductIds;
    }

    public void setPurchasedProductIds(List<Integer> purchasedProductIds) {
        this.purchasedProductIds = purchasedProductIds;
    }
}

