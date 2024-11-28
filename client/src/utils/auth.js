import { useCookies } from '@vueuse/integrations/useCookies';
const cookies = useCookies();

async function refreshAccessToken(serverUrl) {
    const refreshToken = cookies.get('refreshToken');  // Lấy refresh token từ cookie
    const user = cookies.get('user')

    if (!refreshToken) {
        throw new Error('No refresh token found');
    }

    const response = await fetch(`${serverUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken, user }),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Unable to refresh access token');
    }

    const data = await response.json();
    cookies.set('accessToken', data.newAccessToken, {
        path: '/admin',
        expires: new Date(
            new Date().getTime() + 60 * 60 * 1000
        ), // 1 hour
    });
    if (data.status !== 200) {
        cookies.remove('refreshToken');
        throw new Error('No access token received from refresh');
    }
}

async function checkProtectedRoute(serverUrl) {
    let token = cookies.get('accessToken');
    let refreshToken = cookies.get('refreshToken');

    if (!token && refreshToken) {
        try {
            await refreshAccessToken(serverUrl);
            token = cookies.get('accessToken');
        } catch (error) {
            console.error('Error refreshing token:', error);

            return false;
        }
    }

    if (token !== undefined)
        try {
            // Kiểm tra route bảo vệ
            const response = await fetch(`${serverUrl}/api/auth/protected`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    credentials: 'include',
                },
            });

            const data = await response.json();

            if (data.status !== 200) {
                cookies.remove('accessToken');
                cookies.remove('refreshToken');
                cookies.remove('user');
                throw new Error(data.message ? data.message : 'Login session has been changed illegally!');
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
}

export { checkProtectedRoute, refreshAccessToken }
