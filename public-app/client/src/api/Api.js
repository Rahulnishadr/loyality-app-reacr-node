import axios from 'axios';

export const apiCall = async (endpoint = '', method = 'GET', data = null, headers = {}) => {
    const url = process.env.REACT_APP_BASE_URL || '';
    const token = localStorage.getItem("token");
    try {
        const response = await axios({
            method: method,
            url: `${url}${endpoint}`,
            data: method !== 'GET' ? data : null,
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Content-Type': 'application/json',
                ...headers,
                'access-token': `${token}`
            },
        });
        return { status: response.status, data: response?.data };
    } catch (error) {
        // const {success,message}=error.response.data
        // if (success === false && message === 'Failed to authenticate token!') {
        //     localStorage.removeItem("token");
        //     localStorage.removeItem("Values");
        //     localStorage.removeItem("hastoken");
        //      // navigate('/login');
        //    }
        // //    setTimeout(() => {
        // //     window.location.reload();
        // //   }, 1000); 
        throw error.response ? error.response.data : new Error('API call failed');
    }
};

export const apiCallLocal = async (endpoint = '', method = 'GET', data = null, headers = {}) => {
     let url = "https://08d2-103-184-70-96.ngrok-free.app"
    const token = localStorage.getItem("token")
    try {
        const response = await axios({
            method: method,
            url: `${url}${endpoint}`,
            data: method !== 'GET' ? data : null,
            headers: {
                "ngrok-skip-browser-warning": "69420",
                'Content-Type': 'application/json',
                
                ...headers,
               'access-token': `${token}`
            },
        });
 
        return response?.data;
    } catch (error) {
        // const {success,message}=error.response.data
        // if (success === false && message === 'Failed to authenticate token!') {
        //     localStorage.removeItem("token");
        //     localStorage.removeItem("Values");
        //     localStorage.removeItem("hastoken");
        //      // navigate('/login');
        //    }
        // //    setTimeout(() => {
        // //     window.location.reload();
        // //   }, 1000); 
        throw error.response ? error.response.data : new Error('API call failed');
    }
};