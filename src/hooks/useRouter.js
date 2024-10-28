// 
import queryString from 'query-string';
const { useMemo } = require("react");
const { useParams, useLocation, useNavigate } = require("react-router-dom");

function useRouter() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Tra ve doi tuong custom Router
    // Memoize so that a new object is only returned if something changes
    return useMemo(() => {
        return {
            pathname: location.pathname,
            // Merge params and parsed query string into single "query" object
            // so that they can be used interchangeably.
            // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
            query: {
                ...queryString.parse(location.search),  // Convert string to object
                ...params,
            },
            // Include match, location, history objects so we have
            // access to extra React Router functionality if needed.
            // match,
            location,
            navigate
        }
    }, [params, location, navigate]);
}

export default useRouter;