const getApiEndpoints = async (port) => {
    let response;
    try {
        response = await fetch(`http://localhost:${port}`);
        if (!response.ok) {
            return 'Local mock API server is not running - please start the server first.';
        }
    }
    catch {
        return 'Local mock API server is not running - please start the server first.';
    }
    return response.text();
};
export { getApiEndpoints };
