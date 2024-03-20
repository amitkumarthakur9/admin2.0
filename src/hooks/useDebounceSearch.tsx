import { useState } from "react";
import { useQuery } from "react-query";
import debounce from "lodash/debounce";

function useDebouncedSearch<T>(
    queryKey: string,
    searchFunction: (searchQuery: string) => Promise<T>,
    debounceDelay: number = 500
) {
    const [query, setQuery] = useState<string>("");

    const debouncedSearch = debounce((searchQuery) => {
        return searchQuery;
    }, debounceDelay);

    const { data, isSuccess, isError, error, isLoading } = useQuery(
        [queryKey, query],
        () => searchFunction(debouncedSearch(query)),
        {
            // This ensures the query does not automatically run
            enabled: !!query && query.length > 2,
        }
    );

    return { query, setQuery, data, isSuccess, isError, error, isLoading };
}

export default useDebouncedSearch;
