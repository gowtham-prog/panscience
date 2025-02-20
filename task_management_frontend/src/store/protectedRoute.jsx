import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requireAuth }) => {
    const { authenticated, loading } = useSelector((state) => state.auth);

    if (loading) return <div>Loading...</div>;

    if (requireAuth && !authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!requireAuth && authenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
