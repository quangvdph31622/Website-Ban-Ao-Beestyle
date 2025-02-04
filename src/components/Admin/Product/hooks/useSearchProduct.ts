import useSWR from "swr";
import {getProducts, URL_API_PRODUCT} from "@/services/ProductService";

const useSearchProduct = (searchTerm: string) => {
    const {data, error, isLoading} = useSWR(
        searchTerm ? `${URL_API_PRODUCT.search}?keyword=${searchTerm}` : null,
        getProducts,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const dataOptionSearchProduct = !isLoading && data?.data?.items ? data.data.items : [];
    return {dataOptionSearchProduct, error, isLoading};
}
export default useSearchProduct;