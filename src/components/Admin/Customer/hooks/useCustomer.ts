import useSWR from "swr";
import {getCustomers, URL_API_CUSTOMER} from "@/services/CustomerService";
import useAppNotifications from "@/hooks/useAppNotifications";

const useCustomer = () => {
    const {showNotification} = useAppNotifications();

    const handleGetCustomers = (searchTerm: string) => {
        const {data, error, isLoading, mutate: mutateCustomers} = useSWR(
            searchTerm ? `${URL_API_CUSTOMER.get}?page=1&size=10&status=ACTIVE&keyword=${searchTerm}` : null,
            getCustomers,
            {
                revalidateIfStale: false,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
            }
        );

        if (error) {
            showNotification("error", {
                message: error?.message,
                description: error?.response?.data?.message || "Error fetching customers",
            });
        }

        const dataCustomers = !isLoading && data?.data?.items ? data.data.items : [];

        return {dataCustomers, error, isLoading};
    }

    return {handleGetCustomers};
}
export default useCustomer;