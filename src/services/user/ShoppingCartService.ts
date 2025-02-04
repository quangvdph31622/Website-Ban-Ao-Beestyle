import { message } from "antd";
import { ProductVariant } from "./SingleProductService";
import httpInstance from "@/utils/HttpInstance";
import { getAccountInfo } from "@/utils/AppUtil";
import useSWR, { mutate } from "swr";

export const CART_KEY = 'shopping_cart';

export const URL_API_SHOPPING_CART = {
    get: '/cart',
    update: '/cart/update',
    checking: '/cart/check',
    updateQuantity: '/cart/update/quantity',
};

export interface ICartItem {
    id: number;
    productVariantId: string;
    productId: string;
    cartCode: string;
    customerId: number;
    productName: string;
    sizeName: string;
    colorName: string;
    quantityInStock: number;
    quantity: number;
    salePrice: number;
    discountedPrice: number;
    totalPrice: number;
    description: string;
    imageUrl: string;
}

export const getCartFromLocalStorage = () => {
    if (typeof window !== 'undefined' && !getAccountInfo()) {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }
    return [];
};

const getCartFromServer = async (customerId: number) => {
    const response = await httpInstance.post(URL_API_SHOPPING_CART.get, customerId);
    return response.data.data;
};

const saveCart = (cart: ICartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
};

export const useShoppingCart = () => {
    const customerId = getAccountInfo()?.id ?? null; // Lấy customerId từ LocalStorage

    const {
        data: cartDataFromServer,
        error,
        isLoading,
    } = useSWR(
        customerId ? [customerId] : null, // Chỉ fetch từ server nếu có customerId
        () => getCartFromServer(customerId)
    );

    const cartData = customerId ? cartDataFromServer || [] : getCartFromLocalStorage() || [];

    return {
        cartData,
        isLoading,
        error,
    };
};

export const createCartItems = async (cartData: ICartItem) => {
    const response = await httpInstance.post(URL_API_SHOPPING_CART.update, cartData);
    return response.data;
}

export const updateCartQuantity = async (params: Record<string, number>) => {
    const response = await httpInstance.post(URL_API_SHOPPING_CART.updateQuantity, params);
    return response.data;
}

export const deleteCartItem = async (cartId: number) => {
    const response = await httpInstance.get(`${URL_API_SHOPPING_CART.get}/${cartId}/delete`);
    return response.data;
}

export const deleteAllCartItems = async () => {
    const response = await httpInstance.get(`${URL_API_SHOPPING_CART.get}/deleteAll`);
    return response.data;
}

const checkDataCartItem = async (data: ICartItem) => {
    const response = await httpInstance.post(URL_API_SHOPPING_CART.checking, data);
    return response.data;
}

export const addToCart = async (product: ProductVariant, quantity: number, imageUrl?: string) => {
    if (getAccountInfo()) {
        const productData: any = [
            {
                customerId: getAccountInfo().id,
                cartCode: "SC-" + Date.now(),
                productVariantId: product.id,
                salePrice: product.salePrice,
                quantity: quantity,
            }
        ];

        try {
            if (product.quantityInStock >= quantity && quantity > 0) {
                await createCartItems(productData);
                mutate(getAccountInfo().id ? [getAccountInfo().id] : null);
                message.success("Đã thêm sản phẩm vào giỏ hàng");
            } else {
                message.warning("Số lượng sản phẩm trong của hàng không còn đủ");
            }
        } catch (err) {
            message.warning("Số lượng sản phẩm trong cửa hàng không còn đủ");
            console.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng:", err);
        }
    } else {
        const cart = getCartFromLocalStorage();

        try {
            if (product && quantity) {
                const existingIndex = cart.findIndex((item: ICartItem) =>
                    item.productId === product.productId &&
                    item.colorName === product.colorName &&
                    item.sizeName === product.sizeName
                );

                if (existingIndex !== -1) {
                    cart[existingIndex].quantity += quantity;
                    cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].discounted_price;
                } else {
                    const newItem = {
                        cartCode: "SC-" + Date.now(),
                        productVariantId: product.id,
                        productId: product.productId,
                        productName: product.productName,
                        colorName: product.colorName,
                        sizeName: product.sizeName,
                        quantityInStock: product.quantityInStock,
                        quantity: quantity,
                        salePrice: product.salePrice,
                        discountedPrice: product.discountPrice,
                        totalPrice: quantity * product.discountPrice,
                        imageUrl: imageUrl
                    };
                    cart.push(newItem);
                }
                if (product.quantityInStock >= quantity && quantity > 0) {
                    saveCart(cart);
                    message.success("Đã thêm sản phẩm vào giỏ hàng");
                } else {
                    message.warning("Số lượng sản phẩm trong cửa hàng không còn đủ");
                }
            }
        } catch (error) {
            console.error("Đã xảy ra lỗi khi thêm mới sản phẩm vào giỏ:", error);
        }
    }
};

export const removeItemFromCart = async (params: { id: number, cartCode: string }) => {
    if (getAccountInfo()) {
        try {
            await deleteCartItem(params.id);
            mutate(getAccountInfo().id ? [getAccountInfo().id] : null);
        } catch (err) {
            console.error("Đã xảy ra lỗi khi xoá sản phẩm khỏi giỏ hàng:", err);
        }
    } else {
        const cartItems = getCartFromLocalStorage();
        const updatedCart = cartItems.filter((item: ICartItem) => item.cartCode !== params.cartCode);
        localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    }
};

export const removeAllCartItems = () => {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cartUpdated'));
}

export const fetchCartFromLocalToServer = async () => {
    const cart = localStorage.getItem(CART_KEY);
    const cartItems = cart ? JSON.parse(cart) : [];
    const productData: ICartItem = cartItems.map((item: ICartItem) => {
        return {
            customerId: getAccountInfo().id,
            cartCode: "SC-" + Date.now(),
            productVariantId: item.productVariantId,
            salePrice: item.salePrice,
            quantity: item.quantity,
        }
    })

    try {
        removeAllCartItems();
        await createCartItems(productData);
        mutate(getAccountInfo().id ? [getAccountInfo().id] : null);
    } catch (err) {
        console.error("Đã xảy ra lỗi khi đồng bộ sản phẩm vào giỏ hàng:", err);
    }
}

export const checkShoppingCartData = async () => {
    const cartItems = getCartFromLocalStorage();

    if (!cartItems?.length) return;

    const cartRequests = cartItems.map(({ productVariantId, quantity }: ICartItem) => ({
        productVariantId,
        quantity
    }));

    try {
        if (!getAccountInfo()) {
            const updatedCartDataFromServer = await checkDataCartItem(cartRequests);

            const updatedCartItems = cartItems.map((item: ICartItem) => {
                const matchingItemFromServer = updatedCartDataFromServer.find(
                    (beItem: { id: string }) => beItem.id === item.productVariantId
                );

                if (!matchingItemFromServer) {
                    console.warn("Không tìm thấy sản phẩm");
                    return null;
                }

                const updatedItem: ICartItem = { ...item };

                // Cập nhật các thuộc tính nếu có thay đổi
                const propertiesToUpdate: (keyof ICartItem)[] = [
                    "salePrice",
                    "discountedPrice",
                    "quantityInStock",
                    "productName",
                    "colorName",
                    "sizeName",
                    "totalPrice",
                    "productId",
                    "imageUrl",
                ];

                for (const prop of propertiesToUpdate) {
                    if (matchingItemFromServer[prop] !== item[prop]) {
                        updatedItem[prop] = matchingItemFromServer[prop];
                    }
                }

                // Xử lý quantity và thông báo hết hàng
                if (
                    matchingItemFromServer.quantityInStock < item.quantity &&
                    matchingItemFromServer.quantityInStock > 0
                ) {
                    updatedItem.quantity = 1;
                } else if (matchingItemFromServer.quantityInStock === 0) {
                    message.warning({
                        content: `Sản phẩm ${matchingItemFromServer.productName} đã hết hàng!`,
                        duration: 5,
                    });
                    return null;
                }

                return updatedItem;
            }).filter(Boolean); // Loại bỏ các phần tử null

            if (updatedCartItems.length) {
                saveCart(updatedCartItems);
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                localStorage.removeItem(CART_KEY);
            }
        }
    } catch (error) {
        console.error("Đã xảy ra lỗi trong quá trình đồng bộ dữ liệu", error);
    }
};
